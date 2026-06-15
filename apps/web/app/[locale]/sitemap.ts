import { cmsLocales, localePathPrefix } from "@repo/cms/locale";
import type { MetadataRoute } from "next";
import { blog, legal } from "@repo/cms";
import { env } from "@/env";

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const baseUrl = new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`);

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl.href,
      lastModified: new Date(),
    },
  ];

  for (const locale of cmsLocales) {
    const prefix = localePathPrefix(locale);
    const localeBase = prefix === "" ? baseUrl.href : new URL(prefix, baseUrl).href;

    const [blogs, legals] = await Promise.all([
      blog.getPosts({ locale }),
      legal.getPostsMeta({ locale }),
    ]);

    entries.push({
      url: new URL("blog", localeBase).href,
      lastModified: new Date(),
    });

    for (const post of blogs) {
      entries.push({
        url: new URL(`blog/${post._slug}`, localeBase).href,
        lastModified: new Date(),
      });
    }

    for (const legalPost of legals) {
      entries.push({
        url: new URL(`legal/${legalPost._slug}`, localeBase).href,
        lastModified: new Date(),
      });
    }
  }

  return entries;
};

export default sitemap;
