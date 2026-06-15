import { cmsLocales, localePathPrefix } from "@repo/cms/locale";
import { withToolbar } from "@repo/feature-flags/lib/toolbar";
import { config, withAnalyzer } from "@repo/next-config";
import { withLogging, withSentry } from "@repo/observability/next-config";
import type { NextConfig } from "next";
import { env } from "@/env";

let nextConfig: NextConfig = withToolbar(withLogging(config));

if (process.env.NODE_ENV === "production") {
  const redirects: NextConfig["redirects"] = async () => {
    const legalRedirects = cmsLocales.flatMap((locale) => {
      const prefix = localePathPrefix(locale);
      const source = prefix === "" ? "/legal" : `${prefix}/legal`;
      const destination =
        prefix === "" ? "/legal/privacy" : `${prefix}/legal/privacy`;

      return [
        {
          source,
          destination,
          permanent: true,
        },
      ];
    });

    return legalRedirects;
  };

  nextConfig.redirects = redirects;
}

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
