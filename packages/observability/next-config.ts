import { withLogtail } from "@logtail/next";
import { withSentryConfig } from "@sentry/nextjs";
import { keys } from "./keys";

interface TranspilableNextConfig {
  transpilePackages?: string[];
}

export const sentryConfig: Parameters<typeof withSentryConfig>[1] = {
  org: keys().SENTRY_ORG,
  project: keys().SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  /*
   * For all available options, see:
   * https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
   */

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  /*
   * Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
   * This can increase your server load as well as your hosting bill.
   * Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
   * side errors will fail.
   */
  tunnelRoute: "/monitoring",

  webpack: {
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },

    /*
     * Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
     * See the following for more information:
     * https://docs.sentry.io/product/crons/
     * https://vercel.com/docs/cron-jobs
     */
    automaticVercelMonitors: true,
  },
};

export const withSentry = <TConfig extends object & TranspilableNextConfig>(
  sourceConfig: TConfig
): TConfig => {
  const configWithTranspile = {
    ...sourceConfig,
    transpilePackages: [
      ...new Set([...(sourceConfig.transpilePackages ?? []), "@sentry/nextjs"]),
    ],
  };

  return withSentryConfig(configWithTranspile, sentryConfig) as TConfig;
};

export const withLogging = <TConfig extends object>(config: TConfig): TConfig =>
  withLogtail(config) as TConfig;
