import "server-only";

import type {
  CollectionConfig,
  CollectionReader,
  ReaderOptions,
} from "../collections/types";
import { compileMdxCached } from "../compiler/mdx";
import { DEFAULT_LOCALE, normalizeLocale } from "../locale";
import type { ContentStatus } from "../schemas";
import type { ContentBody } from "../types";
import type { ParsedMdxDocument } from "./content-source";
import { getContentSource } from "./resolve-source";

type DocumentMeta<
  TFrontmatter extends { status: ContentStatus },
  TMeta extends { _slug: string },
> = {
  content: string;
  frontmatter: TFrontmatter;
  meta: TMeta;
};

const resolveLocale = (options?: ReaderOptions): string =>
  normalizeLocale(options?.locale ?? DEFAULT_LOCALE);

export const createCollectionReader = <
  TFrontmatter extends { status: ContentStatus },
  TMeta extends { _slug: string },
  TDoc extends TMeta & { body: ContentBody },
>(
  config: CollectionConfig<TFrontmatter, TMeta, TDoc>
): CollectionReader<TMeta, TDoc> => {
  const source = () => getContentSource();

  const parseDocument = (
    parsed: ParsedMdxDocument
  ): DocumentMeta<TFrontmatter, TMeta> => {
    const frontmatter = config.schema.parse(parsed.data);

    return {
      content: parsed.content,
      frontmatter,
      meta: config.toMeta(parsed.slug, frontmatter),
    };
  };

  const isVisible = (
    frontmatter: TFrontmatter,
    options?: ReaderOptions
  ): boolean => options?.includeDrafts || config.isPublished(frontmatter);

  const readDocumentForLocale = async (
    locale: string,
    slug: string
  ): Promise<ParsedMdxDocument | null> =>
    source().readDocument(config.name, locale, slug);

  const readDocumentWithFallback = async (
    slug: string,
    options?: ReaderOptions
  ): Promise<ParsedMdxDocument | null> => {
    const locale = resolveLocale(options);
    const parsed = await readDocumentForLocale(locale, slug);

    if (parsed) {
      return parsed;
    }

    if (locale === DEFAULT_LOCALE) {
      return null;
    }

    return readDocumentForLocale(DEFAULT_LOCALE, slug);
  };

  const readAllDocuments = async (
    options?: ReaderOptions
  ): Promise<DocumentMeta<TFrontmatter, TMeta>[]> => {
    const locale = resolveLocale(options);
    const slugs = await source().listSlugs(config.name, locale);
    const documents = await Promise.all(
      slugs.map(async (slug) => {
        const parsed = await readDocumentForLocale(locale, slug);

        if (!parsed) {
          return null;
        }

        return parseDocument(parsed);
      })
    );

    return documents.filter(
      (document): document is DocumentMeta<TFrontmatter, TMeta> =>
        document !== null && isVisible(document.frontmatter, options)
    );
  };

  const sortDocuments = (
    documents: DocumentMeta<TFrontmatter, TMeta>[]
  ): DocumentMeta<TFrontmatter, TMeta>[] => {
    if (!config.sortMeta) {
      return documents;
    }

    return [...documents].sort((left, right) =>
      config.sortMeta!(left.meta, right.meta)
    );
  };

  const loadDocument = async (
    parsed: ParsedMdxDocument,
    options?: ReaderOptions
  ): Promise<TDoc | null> => {
    const document = parseDocument(parsed);

    if (!isVisible(document.frontmatter, options)) {
      return null;
    }

    const body = await compileMdxCached(document.content);

    return {
      ...document.meta,
      body,
    } as TDoc;
  };

  return {
    getPostsMeta: async (options?: ReaderOptions): Promise<TMeta[]> => {
      const documents = sortDocuments(await readAllDocuments(options));
      return documents.map((document) => document.meta);
    },

    getPosts: async (options?: ReaderOptions): Promise<TDoc[]> => {
      const documents = sortDocuments(await readAllDocuments(options));

      return Promise.all(
        documents.map(async (document) => {
          const body = await compileMdxCached(document.content);

          return {
            ...document.meta,
            body,
          } as TDoc;
        })
      );
    },

    getPost: async (
      slug: string,
      options?: ReaderOptions
    ): Promise<TDoc | null> => {
      const parsed = await readDocumentWithFallback(slug, options);

      if (!parsed) {
        return null;
      }

      return loadDocument(parsed, options);
    },
  };
};
