import "server-only";

import {
  blogCollection,
  type collections,
  legalCollection,
} from "../collections";
import { DEFAULT_LOCALE } from "../locale";
import type { BlogFrontmatter } from "../schemas/blog.schema";
import type { LegalFrontmatter } from "../schemas/legal.schema";
import { createCollectionWriter } from "./create-collection-writer";
import type { DeleteResult, SaveResult } from "./types";

export {
  createCollectionWriter,
  readRawDocument,
} from "./create-collection-writer";
export { serializeDocument } from "./serialize-document";
export type { SettingsSaveResult } from "./settings";
export { readSiteSettings, saveSiteSettings } from "./settings";
export { isValidSlug, slugifyTitle } from "./slug";
export type {
  CollectionWriter,
  DeleteResult,
  RawDocument,
  SaveDocumentInput,
  SaveResult,
  WriterConfig,
} from "./types";
export { getWriteMode } from "./write-mode";

const blogWriter = createCollectionWriter({
  name: "blog",
  schema: blogCollection.schema,
  defaultFrontmatter: blogCollection.createDefaultFrontmatter(),
});

const legalWriter = createCollectionWriter({
  name: "legal",
  schema: legalCollection.schema,
  defaultFrontmatter: legalCollection.createDefaultFrontmatter(),
});

export const cmsWriters = {
  blog: blogWriter,
  legal: legalWriter,
} as const;

export {
  cmsCollectionNames,
  cmsCollectionSchema,
  getCollectionFrontmatterFields,
  getDefaultFrontmatter,
  isCmsCollection,
} from "../collections";
export { cmsReaders } from "../loader";

export const collectionLabels: Record<keyof typeof collections, string> = {
  blog: "Blog",
  legal: "Legal",
};

export type CmsCollectionName = keyof typeof collections;

export const saveCmsDocument = async (
  collection: CmsCollectionName,
  input: {
    slug?: string;
    locale?: string;
    frontmatter: Record<string, unknown>;
    body: string;
  }
): Promise<SaveResult> => {
  const locale = input.locale ?? DEFAULT_LOCALE;

  switch (collection) {
    case "blog":
      return cmsWriters.blog.save({
        slug: input.slug,
        locale,
        frontmatter: input.frontmatter as BlogFrontmatter,
        body: input.body,
      });
    case "legal":
      return cmsWriters.legal.save({
        slug: input.slug,
        locale,
        frontmatter: input.frontmatter as LegalFrontmatter,
        body: input.body,
      });
    default: {
      const exhaustive: never = collection;
      throw new Error(`Unknown collection: ${exhaustive}`);
    }
  }
};

export const deleteCmsDocument = async (
  collection: CmsCollectionName,
  slug: string,
  locale: string = DEFAULT_LOCALE
): Promise<DeleteResult> => cmsWriters[collection].delete(slug, locale);
