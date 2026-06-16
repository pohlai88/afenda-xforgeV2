import "server-only";

import { ZodError } from "zod";
import type { CollectionName } from "../collections";
import { collections } from "../collections";
import { clearCompileCache } from "../compiler/mdx";
import { getContentSource } from "../loader/resolve-source";
import { normalizeLocale } from "../locale";
import type { ContentStatus } from "../schemas";
import { deleteGitHubDocument, writeGitHubDocument } from "./github-commit";
import { deleteLocalDocument, writeLocalDocument } from "./local-storage";
import { serializeDocument } from "./serialize-document";
import { isValidSlug, slugifyTitle } from "./slug";
import type {
  CollectionWriter,
  DeleteResult,
  SaveDocumentInput,
  SaveResult,
  WriterConfig,
} from "./types";
import { getWriteMode } from "./write-mode";

const formatZodError = (error: ZodError): string =>
  error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");

const persistDocument = (
  collection: string,
  locale: string,
  slug: string,
  content: string,
  message: string
): Promise<{ path: string }> => {
  if (getWriteMode() === "github") {
    return writeGitHubDocument(collection, locale, slug, content, message);
  }

  return writeLocalDocument(collection, locale, slug, content);
};

const removeDocument = (
  collection: string,
  locale: string,
  slug: string,
  message: string
): Promise<boolean> => {
  if (getWriteMode() === "github") {
    return deleteGitHubDocument(collection, locale, slug, message);
  }

  return deleteLocalDocument(collection, locale, slug);
};

export const createCollectionWriter = <
  TFrontmatter extends { status: ContentStatus; title: string },
>(
  config: WriterConfig<TFrontmatter>
): CollectionWriter<TFrontmatter> => {
  const resolveSlug = async (
    input: SaveDocumentInput<TFrontmatter>,
    frontmatter: TFrontmatter
  ): Promise<string | SaveResult> => {
    const locale = normalizeLocale(input.locale);
    const candidate =
      input.slug?.trim() || slugifyTitle(String(frontmatter.title));

    if (!isValidSlug(candidate)) {
      return {
        ok: false,
        code: "validation",
        message: "Slug must be lowercase kebab-case",
      };
    }

    if (
      input.slug?.trim() &&
      (await getContentSource().documentExists(config.name, locale, candidate))
    ) {
      return candidate;
    }

    if (
      !input.slug &&
      (await getContentSource().documentExists(config.name, locale, candidate))
    ) {
      return {
        ok: false,
        code: "slug_conflict",
        message: `A document with slug "${candidate}" already exists`,
      };
    }

    return candidate;
  };

  return {
    listSlugs: async (locale: string): Promise<string[]> =>
      getContentSource().listSlugs(config.name, normalizeLocale(locale)),

    save: async (
      input: SaveDocumentInput<TFrontmatter>
    ): Promise<SaveResult> => {
      const locale = normalizeLocale(input.locale);
      let frontmatter: TFrontmatter;

      try {
        frontmatter = config.schema.parse({
          ...config.defaultFrontmatter,
          ...input.frontmatter,
        });
      } catch (error) {
        return {
          ok: false,
          code: "validation",
          message:
            error instanceof ZodError
              ? formatZodError(error)
              : "Invalid frontmatter",
        };
      }

      const slugResult = await resolveSlug(input, frontmatter);

      if (typeof slugResult !== "string") {
        return slugResult;
      }

      const slug = slugResult;
      const content = serializeDocument(frontmatter, input.body);
      const message = `cms: save ${config.name}/${locale}/${slug}`;

      try {
        const { path } = await persistDocument(
          config.name,
          locale,
          slug,
          content,
          message
        );
        clearCompileCache();

        return { ok: true, slug, path };
      } catch (error) {
        return {
          ok: false,
          code: getWriteMode() === "github" ? "github" : "io",
          message:
            error instanceof Error ? error.message : "Failed to save document",
        };
      }
    },

    delete: async (slug: string, locale: string): Promise<DeleteResult> => {
      const normalizedLocale = normalizeLocale(locale);
      const exists = await getContentSource().documentExists(
        config.name,
        normalizedLocale,
        slug
      );

      if (!exists && getWriteMode() === "local") {
        return {
          ok: false,
          code: "not_found",
          message: `Document "${slug}" not found`,
        };
      }

      try {
        const removed = await removeDocument(
          config.name,
          normalizedLocale,
          slug,
          `cms: delete ${config.name}/${normalizedLocale}/${slug}`
        );

        if (!removed) {
          return {
            ok: false,
            code: "not_found",
            message: `Document "${slug}" not found`,
          };
        }

        clearCompileCache();
        return { ok: true, slug };
      } catch (error) {
        return {
          ok: false,
          code: getWriteMode() === "github" ? "github" : "io",
          message:
            error instanceof Error
              ? error.message
              : "Failed to delete document",
        };
      }
    },
  };
};

export const readRawDocument = async <TName extends CollectionName>(
  collectionName: TName,
  slug: string,
  locale: string
): Promise<{
  slug: string;
  locale: string;
  frontmatter: { status: ContentStatus } & Record<string, unknown>;
  body: string;
} | null> => {
  const config = collections[collectionName];
  const normalizedLocale = normalizeLocale(locale);
  const parsed = await getContentSource().readDocument(
    collectionName,
    normalizedLocale,
    slug
  );

  if (!parsed) {
    return null;
  }

  const frontmatter = config.schema.parse(parsed.data);

  return {
    slug: parsed.slug,
    locale: normalizedLocale,
    frontmatter,
    body: parsed.content,
  };
};
