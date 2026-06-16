"use client";

import type { ReactNode } from "react";
import type { AuthUiSettings } from "./auth-ui-settings";
import { SupabaseAuthListener } from "./components/supabase-auth-listener";
import { AuthUiConfigProvider } from "./context/auth-ui-config";

interface AuthProviderProperties {
  children: ReactNode;
  helpUrl?: string;
  privacyUrl?: string;
  settings?: AuthUiSettings;
  termsUrl?: string;
}

export const AuthProvider = ({
  children,
  privacyUrl,
  termsUrl,
  helpUrl,
  settings,
}: AuthProviderProperties) => (
  <AuthUiConfigProvider
    helpUrl={helpUrl}
    privacyUrl={privacyUrl}
    settings={settings}
    termsUrl={termsUrl}
  >
    <SupabaseAuthListener />
    {children}
  </AuthUiConfigProvider>
);
