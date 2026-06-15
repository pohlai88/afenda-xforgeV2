"use server";

import { withEditor } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  buildCmsDocumentEvent,
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_UNPUBLISHED,
  type CmsDocumentEventInput,
} from "@repo/cms/events";
import {
  fetchDocumentListItems,
  type CmsDocumentListItem,
} from "@repo/cms/document-list";
import {
  cmsLocaleSchema,
  cmsLocales,
  DEFAULT_LOCALE,
  normalizeLocale,
  publicPreviewPath,
  type CmsLocale,
} from "@repo/cms/locale";
import { createPreviewToken } from "@repo/cms/preview-token";
import { getCmsCacheTags } from "@repo/cms/revalidate";
import { notifyWebContentChanged } from "@repo/cms/revalidate-web";
import {
  cmsReaders,
  collectionLabels,
  deleteCmsDocument,
  isCmsCollection,
  readRawDocument,
  saveCmsDocument,
  type CmsCollectionName,
  type DeleteResult,
  type SaveResult,
} from "@repo/cms/writer";
import { webhooks } from "@repo/webhooks";
import { keys as webhookKeys } from "@repo/webhooks/keys";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { env } from "@/env";

export type { CmsDocumentListItem } from "@repo/cms/document-list";

const collectionSchema = z.enum(["blog", "legal"]);

const saveDocumentSchema = z.object({
  collection: collectionSchema,
  locale: cmsLocaleSchema.default(DEFAULT_LOCALE),
  slug: z.string().optional(),
  frontmatter: z.record(z.string(), z.unknown()),
  body: z.string(),
});

export type CmsDocumentDetail = {
  collection: CmsCollectionName;
  locale: CmsLocale;
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
};

const isPublishedStatus = (frontmatter: Record<string, unknown>): boolean =>
  frontmatter.status === "published";

const revalidateCmsPaths = (
  collection: CmsCollectionName,
  locale: CmsLocale,
  slug?: string
) => {
  revalidatePath("/cms");
  revalidatePath(`/cms/${collection}`);
  revalidatePath(`/cms/${collection}/${locale}`);

  if (slug) {
    revalidatePath(`/cms/${collection}/${locale}/${slug}`);
    revalidatePath(`/cms/${collection}/${locale}/${slug}/preview`);
  }

  for (const tag of getCmsCacheTags(collection, locale, slug)) {
    revalidateTag(tag, "max");
  }
};

const notifyPublicContentChange = async (
  collection: CmsCollectionName,
  locale: CmsLocale,
  slug?: string
) => {
  await notifyWebContentChanged({
    collection,
    locale,
    slug,
    webUrl: env.NEXT_PUBLIC_WEB_URL,
  });
};

const emitCmsWebhook = async (
  eventType: typeof CMS_EVENT_PUBLISHED | typeof CMS_EVENT_UNPUBLISHED,
  payload: CmsDocumentEventInput
) => {
  if (!webhookKeys().SVIX_TOKEN) {
    return;
  }

  try {
    await webhooks.send(eventType, buildCmsDocumentEvent(payload));
  } catch (error) {
    console.error(`[cms] Webhook ${eventType} failed:`, error);
  }
};

export const listDocuments = async (
  collection: string,
  locale: string = DEFAULT_LOCALE
): Promise<AuthActionResult<CmsDocumentListItem[]>> =>
  withEditor(async () => {
    if (!isCmsCollection(collection)) {
      throw new Error("Unknown collection");
    }

    return fetchDocumentListItems(collection, normalizeLocale(locale));
  });

export const getDocument = async (
  collection: string,
  locale: string,
  slug: string
): Promise<AuthActionResult<CmsDocumentDetail | null>> =>
  withEditor(async () => {
    if (!isCmsCollection(collection)) {
      throw new Error("Unknown collection");
    }

    const normalizedLocale = normalizeLocale(locale);
    const raw = await readRawDocument(collection, slug, normalizedLocale);

    if (!raw) {
      return null;
    }

    return {
      collection,
      locale: normalizedLocale,
      slug: raw.slug,
      frontmatter: raw.frontmatter,
      body: raw.body,
    };
  });

export const saveDocument = async (
  input: z.infer<typeof saveDocumentSchema>
): Promise<AuthActionResult<SaveResult>> =>
  withEditor(async () => {
    const parsed = saveDocumentSchema.parse(input);

    if (!isCmsCollection(parsed.collection)) {
      throw new Error("Unknown collection");
    }

    const locale = parsed.locale;

    const result = await saveCmsDocument(parsed.collection, {
      slug: parsed.slug,
      locale,
      frontmatter: parsed.frontmatter,
      body: parsed.body,
    });

    if (result.ok) {
      revalidateCmsPaths(parsed.collection, locale, result.slug);

      if (isPublishedStatus(parsed.frontmatter)) {
        await Promise.all([
          notifyPublicContentChange(parsed.collection, locale, result.slug),
          emitCmsWebhook(CMS_EVENT_PUBLISHED, {
            collection: parsed.collection,
            locale,
            slug: result.slug,
            title: String(parsed.frontmatter.title ?? ""),
            status: "published",
            publishedAt:
              typeof parsed.frontmatter.date === "string"
                ? parsed.frontmatter.date
                : undefined,
          }),
        ]);
      }
    }

    return result;
  });

export const deleteDocument = async (
  collection: string,
  locale: string,
  slug: string
): Promise<AuthActionResult<DeleteResult>> =>
  withEditor(async () => {
    if (!isCmsCollection(collection)) {
      throw new Error("Unknown collection");
    }

    const normalizedLocale = normalizeLocale(locale);
    const raw = await readRawDocument(collection, slug, normalizedLocale);
    const wasPublished = raw?.frontmatter.status === "published";

    const result = await deleteCmsDocument(collection, slug, normalizedLocale);

    if (result.ok) {
      revalidateCmsPaths(collection, normalizedLocale, slug);

      if (wasPublished) {
        await Promise.all([
          notifyPublicContentChange(collection, normalizedLocale, slug),
          emitCmsWebhook(CMS_EVENT_UNPUBLISHED, {
            collection,
            locale: normalizedLocale,
            slug,
            title: String(raw?.frontmatter.title ?? slug),
            status: "published",
          }),
        ]);
      }
    }

    return result;
  });

export const createPreviewLink = async (
  collection: string,
  locale: string,
  slug: string
): Promise<AuthActionResult<{ token: string | null; url: string | null }>> =>
  withEditor(async () => {
    if (!isCmsCollection(collection)) {
      throw new Error("Unknown collection");
    }

    const normalizedLocale = normalizeLocale(locale);
    const token = createPreviewToken(collection, normalizedLocale, slug);

    if (!token) {
      return { token: null, url: null };
    }

    const relativePath = publicPreviewPath(
      collection,
      normalizedLocale,
      slug,
      token
    );
    const url = new URL(relativePath, env.NEXT_PUBLIC_WEB_URL).toString();

    return { token, url };
  });

export const getCollectionSummaries = async (): Promise<
  AuthActionResult<
    Array<{
      name: CmsCollectionName;
      label: string;
      total: number;
      drafts: number;
    }>
  >
> =>
  withEditor(async () => {
    const summaries = await Promise.all(
      (Object.keys(collectionLabels) as CmsCollectionName[]).map(
        async (name) => {
          const perLocale = await Promise.all(
            cmsLocales.map(async (locale) => {
              const documents = await cmsReaders[name].getPostsMeta({
                includeDrafts: true,
                locale,
              });

              return {
                total: documents.length,
                drafts: documents.filter((doc) => doc.status === "draft").length,
              };
            })
          );

          return {
            name,
            label: collectionLabels[name],
            total: perLocale.reduce((sum, entry) => sum + entry.total, 0),
            drafts: perLocale.reduce((sum, entry) => sum + entry.drafts, 0),
          };
        }
      )
    );

    return summaries;
  });
