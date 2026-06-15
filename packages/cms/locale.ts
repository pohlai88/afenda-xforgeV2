import { z } from "zod";
import languine from "@repo/internationalization/languine.json" with {
  type: "json",
};
import type { CollectionName } from "./collections";

export const DEFAULT_LOCALE = languine.locale.source;

export const cmsLocales = [
  languine.locale.source,
  ...languine.locale.targets,
] as const;

export type CmsLocale = (typeof cmsLocales)[number];

export const cmsLocaleSchema = z.enum(cmsLocales);

export const isValidLocale = (locale: string): locale is CmsLocale =>
  (cmsLocales as readonly string[]).includes(locale);

export const normalizeLocale = (locale: string): CmsLocale =>
  isValidLocale(locale) ? locale : DEFAULT_LOCALE;

export const localePathPrefix = (locale: string): string => {
  const normalized = normalizeLocale(locale);
  return normalized === DEFAULT_LOCALE ? "" : `/${normalized}`;
};

export const publicContentPath = (
  collection: CollectionName,
  locale: string,
  slug: string
): string => {
  const prefix = localePathPrefix(locale);

  return collection === "blog"
    ? `${prefix}/blog/${slug}`
    : `${prefix}/legal/${slug}`;
};

export const publicPreviewPath = (
  collection: CollectionName,
  locale: string,
  slug: string,
  token: string
): string =>
  `${publicContentPath(collection, locale, slug)}?preview=draft&token=${encodeURIComponent(token)}`;

export const parseCmsRouteLocale = (
  localeParam: string
): CmsLocale | undefined => (isValidLocale(localeParam) ? localeParam : undefined);
