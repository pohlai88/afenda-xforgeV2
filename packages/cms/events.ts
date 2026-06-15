import { z } from "zod";
import { type CollectionName, cmsCollectionSchema } from "./collections";
import { type CmsLocale, cmsLocaleSchema } from "./locale";
import { type ContentStatus, contentStatusSchema } from "./schemas";

export const CMS_EVENT_PUBLISHED = "cms.document.published";
export const CMS_EVENT_UNPUBLISHED = "cms.document.unpublished";
export const CMS_EVENT_SETTINGS_UPDATED = "cms.settings.updated";

export type CmsDocumentEventInput = {
  collection: CollectionName;
  locale: CmsLocale;
  slug: string;
  title: string;
  status: ContentStatus;
  publishedAt?: string;
};

export const cmsDocumentEventSchema = z.object({
  collection: cmsCollectionSchema,
  locale: cmsLocaleSchema,
  slug: z.string(),
  title: z.string(),
  status: contentStatusSchema,
  publishedAt: z.string().optional(),
});

export type CmsDocumentEvent = z.infer<typeof cmsDocumentEventSchema>;

export const cmsSettingsUpdatedEventSchema = z.object({
  updatedAt: z.string(),
});

export type CmsSettingsUpdatedEvent = z.infer<
  typeof cmsSettingsUpdatedEventSchema
>;

export const buildCmsSettingsUpdatedEvent = (): CmsSettingsUpdatedEvent =>
  cmsSettingsUpdatedEventSchema.parse({
    updatedAt: new Date().toISOString(),
  });

export const buildCmsDocumentEvent = (
  input: CmsDocumentEventInput
): CmsDocumentEvent => cmsDocumentEventSchema.parse(input);
