import { unstable_cache } from "next/cache";
import type { CollectionReader, ReaderOptions } from "../collections/types";
import { DEFAULT_LOCALE, normalizeLocale } from "../locale";
import type { ContentBody } from "../types";

export const CMS_CACHE_TAG_ALL = "cms";

export const CMS_SETTINGS_TAG = "cms:settings";

export const cmsCollectionTag = (collection: string, locale: string): string =>
  `cms:${collection}:${locale}`;

export const cmsDocumentTag = (
  collection: string,
  locale: string,
  slug: string
): string => `cms:${collection}:${locale}:${slug}`;

export const getCmsCacheTags = (
  collection?: string,
  locale?: string,
  slug?: string
): string[] => {
  const tags = [CMS_CACHE_TAG_ALL];

  if (collection && locale) {
    tags.push(cmsCollectionTag(collection, locale));
  }

  if (collection && locale && slug) {
    tags.push(cmsDocumentTag(collection, locale, slug));
  }

  return tags;
};

const readerOptionsKey = (options?: ReaderOptions): string => {
  const locale = normalizeLocale(options?.locale ?? DEFAULT_LOCALE);
  const visibility = options?.includeDrafts ? "drafts" : "published";
  return `${locale}:${visibility}`;
};

export const wrapCachedCollectionReader = <
  TMeta extends { _slug: string },
  TDoc extends TMeta & { body: ContentBody },
>(
  collectionName: string,
  reader: CollectionReader<TMeta, TDoc>
): CollectionReader<TMeta, TDoc> => ({
  getPostsMeta: (options?: ReaderOptions): Promise<TMeta[]> => {
    const locale = normalizeLocale(options?.locale ?? DEFAULT_LOCALE);

    return unstable_cache(
      async () => reader.getPostsMeta(options),
      ["cms", collectionName, "posts-meta", readerOptionsKey(options)],
      { tags: getCmsCacheTags(collectionName, locale) }
    )();
  },

  getPosts: (options?: ReaderOptions): Promise<TDoc[]> => {
    const locale = normalizeLocale(options?.locale ?? DEFAULT_LOCALE);

    return unstable_cache(
      async () => reader.getPosts(options),
      ["cms", collectionName, "posts", readerOptionsKey(options)],
      { tags: getCmsCacheTags(collectionName, locale) }
    )();
  },

  getPost: (slug: string, options?: ReaderOptions): Promise<TDoc | null> => {
    const locale = normalizeLocale(options?.locale ?? DEFAULT_LOCALE);

    return unstable_cache(
      async () => reader.getPost(slug, options),
      ["cms", collectionName, "post", slug, readerOptionsKey(options)],
      { tags: getCmsCacheTags(collectionName, locale, slug) }
    )();
  },
});
