import { z } from "zod";
import type { CollectionName } from "./collections";
import { cmsLocaleSchema, type CmsLocale } from "./locale";
import type { ContentStatus } from "./schemas";

export const CMS_EVENT_PUBLISHED = "cms.document.published";
export const CMS_EVENT_UNPUBLISHED = "cms.document.unpublished";

export type CmsDocumentEventInput = {
  collection: CollectionName;
  locale: CmsLocale;
  slug: string;
  title: string;
  status: ContentStatus;
  publishedAt?: string;
};

export const cmsDocumentEventSchema = z.object({
  collection: z.enum(["blog", "legal"]),
  locale: cmsLocaleSchema,
  slug: z.string(),
  title: z.string(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
});

export type CmsDocumentEvent = z.infer<typeof cmsDocumentEventSchema>;

export const buildCmsDocumentEvent = (
  input: CmsDocumentEventInput
): CmsDocumentEvent => cmsDocumentEventSchema.parse(input);
