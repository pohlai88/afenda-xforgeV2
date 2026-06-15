import { cmsLocales, DEFAULT_LOCALE, localePathPrefix, normalizeLocale } from "./locale";
import type { CollectionName } from "./collections";

export {
  CMS_CACHE_TAG_ALL,
  CMS_SETTINGS_TAG,
  cmsCollectionTag,
  cmsDocumentTag,
  getCmsCacheTags,
} from "./loader/cached-reads";

export type CmsRevalidateInput = {
  collection: CollectionName;
  locale?: string;
  slug?: string;
};

export const getCmsRevalidationPaths = ({
  collection,
  locale,
  slug,
}: CmsRevalidateInput): string[] => {
  const paths = new Set<string>(["/sitemap.xml"]);
  const targetLocales = locale
    ? [normalizeLocale(locale)]
    : [...cmsLocales];

  for (const targetLocale of targetLocales) {
    const prefix = localePathPrefix(targetLocale);
    paths.add(prefix === "" ? "/" : prefix);

    if (collection === "blog") {
      paths.add(`${prefix}/blog`);

      if (slug) {
        paths.add(`${prefix}/blog/${slug}`);
      }
    }

    if (collection === "legal" && slug) {
      paths.add(`${prefix}/legal/${slug}`);
    }
  }

  return [...paths];
};

export const getSiteSettingsRevalidationPaths = (): string[] => {
  const paths = new Set<string>(["/sitemap.xml"]);

  for (const targetLocale of cmsLocales) {
    const prefix = localePathPrefix(targetLocale);
    paths.add(prefix === "" ? "/" : prefix);
  }

  return [...paths];
};
