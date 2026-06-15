import { cmsLocales, type CmsLocale } from "./locale";

export const buildLocaleSlugParams = async (
  fetchSlugsForLocale: (locale: CmsLocale) => Promise<string[]>
): Promise<Array<{ locale: CmsLocale; slug: string }>> => {
  const params = await Promise.all(
    cmsLocales.map(async (locale) => {
      const slugs = await fetchSlugsForLocale(locale);
      return slugs.map((slug) => ({ locale, slug }));
    })
  );

  return params.flat();
};
