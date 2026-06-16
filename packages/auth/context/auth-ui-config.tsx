"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import {
  type AuthUiSettings,
  defaultAuthUiSettings,
  type PasswordPolicy,
  resolvePasswordPolicy,
} from "../auth-ui-settings";

interface AuthUiConfig {
  helpUrl?: string;
  passwordPolicy: PasswordPolicy;
  privacyUrl?: string;
  settings: AuthUiSettings;
  termsUrl?: string;
}

const AuthUiConfigContext = createContext<AuthUiConfig>({
  settings: defaultAuthUiSettings(),
  passwordPolicy: resolvePasswordPolicy(defaultAuthUiSettings().password),
});

interface AuthUiConfigProviderProperties {
  children: ReactNode;
  helpUrl?: string;
  privacyUrl?: string;
  settings?: AuthUiSettings;
  termsUrl?: string;
}

export const AuthUiConfigProvider = ({
  children,
  termsUrl,
  privacyUrl,
  helpUrl,
  settings = defaultAuthUiSettings(),
}: AuthUiConfigProviderProperties) => {
  const passwordPolicy = useMemo(
    () => resolvePasswordPolicy(settings.password),
    [
      settings.password.minLength,
      settings.password.requiredCharacters,
      settings.password.blockLeakedPasswords,
      settings.password.requireLowercase,
      settings.password.requireUppercase,
      settings.password.requireDigits,
      settings.password.requireSymbols,
      settings.password,
    ]
  );

  return (
    <AuthUiConfigContext.Provider
      value={{ termsUrl, privacyUrl, helpUrl, settings, passwordPolicy }}
    >
      {children}
    </AuthUiConfigContext.Provider>
  );
};

export const useAuthUiConfig = () => useContext(AuthUiConfigContext);
