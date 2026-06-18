import "./styles.css";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { cn } from "@repo/design-system/lib/utils";
import { Toolbar } from "@repo/feature-flags/_components/toolbar";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  ...createMetadata({
    title: "XForge Web",
    description: "Public XForge web surface.",
  }),
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3001"
  ),
};

interface RootLayoutProperties {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
}

const RootLayout = async ({ children }: RootLayoutProperties) => {
  return (
    <html
      className={cn(fonts, "scroll-smooth")}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <AnalyticsProvider>
          <DesignSystemProvider>
            {children}
          </DesignSystemProvider>
          <Toolbar />
        </AnalyticsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
