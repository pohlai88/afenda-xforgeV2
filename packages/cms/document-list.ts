import "server-only";

import type { CollectionName } from "./collections";
import type { CmsLocale } from "./locale";
import type { ContentStatus } from "./schemas";
import type { LegalPostMeta, PostMeta } from "./types";
import { cmsReaders } from "./writer";

export type CmsDocumentListItem = {
  slug: string;
  title: string;
  status: ContentStatus;
  description: string;
  date?: string;
};

export const blogMetaToListItem = (document: PostMeta): CmsDocumentListItem => ({
  slug: document._slug,
  title: document._title,
  status: document.status,
  description: document.description,
  date: document.date,
});

export const legalMetaToListItem = (
  document: LegalPostMeta
): CmsDocumentListItem => ({
  slug: document._slug,
  title: document._title,
  status: document.status,
  description: document.description,
});

export const fetchDocumentListItems = async (
  collection: CollectionName,
  locale: CmsLocale
): Promise<CmsDocumentListItem[]> => {
  switch (collection) {
    case "blog":
      return (
        await cmsReaders.blog.getPostsMeta({
          includeDrafts: true,
          locale,
        })
      ).map(blogMetaToListItem);
    case "legal":
      return (
        await cmsReaders.legal.getPostsMeta({
          includeDrafts: true,
          locale,
        })
      ).map(legalMetaToListItem);
    default: {
      const exhaustive: never = collection;
      throw new Error(`Unknown collection: ${exhaustive}`);
    }
  }
};
