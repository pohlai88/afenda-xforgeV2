"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import {
  type AuthUiSettings,
  defaultAuthUiSettings,
  type PasswordPolicy,
  resolvePasswordPolicy,
} from "../auth-ui-settings";

type AuthUiConfig = {
  termsUrl?: string;
  privacyUrl?: string;
  helpUrl?: string;
  settings: AuthUiSettings;
  passwordPolicy: PasswordPolicy;
};

const AuthUiConfigContext = createContext<AuthUiConfig>({
  settings: defaultAuthUiSettings(),
  passwordPolicy: resolvePasswordPolicy(defaultAuthUiSettings().password),
});

type AuthUiConfigProviderProperties = {
  children: ReactNode;
  termsUrl?: string;
  privacyUrl?: string;
  helpUrl?: string;
  settings?: AuthUiSettings;
};

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
