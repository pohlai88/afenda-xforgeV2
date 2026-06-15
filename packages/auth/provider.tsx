"use client";

import type { ReactNode } from "react";
import type { AuthUiSettings } from "./auth-ui-settings";
import { SupabaseAuthListener } from "./components/supabase-auth-listener";
import { AuthUiConfigProvider } from "./context/auth-ui-config";

type AuthProviderProperties = {
  children: ReactNode;
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
  settings?: AuthUiSettings;
};

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
