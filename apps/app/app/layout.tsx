import "./styles.css";
import { getAuthUiSettings } from "@repo/auth/auth-ui-settings.server";
import { AuthProvider } from "@repo/auth/provider";
import { AnalyticsProvider } from "@repo/analytics/provider";
import { DesignSystemProvider } from "@repo/design-system";
import { fonts } from "@repo/design-system/lib/fonts";
import { Toolbar } from "@repo/feature-flags/components/toolbar";
import { keys as nextConfigKeys } from "@repo/next-config/keys";
import type { ReactNode } from "react";

interface RootLayoutProperties {
  readonly children: ReactNode;
}

const RootLayout = async ({ children }: RootLayoutProperties) => {
  const settings = await getAuthUiSettings();
  const { NEXT_PUBLIC_WEB_URL } = nextConfigKeys();
  const termsUrl = `${NEXT_PUBLIC_WEB_URL}/en/legal/terms`;
  const privacyUrl = `${NEXT_PUBLIC_WEB_URL}/en/legal/privacy`;

  return (
    <html className={fonts} lang="en" suppressHydrationWarning>
      <body>
        <AnalyticsProvider>
          <DesignSystemProvider>
            <AuthProvider
              privacyUrl={privacyUrl}
              settings={settings}
              termsUrl={termsUrl}
            >
              {children}
            </AuthProvider>
          </DesignSystemProvider>
        </AnalyticsProvider>
        <Toolbar />
      </body>
    </html>
  );
};

export default RootLayout;
