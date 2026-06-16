import type { UserIdentity } from "@supabase/supabase-js";

export const IDENTITY_PROVIDER_LABELS: Record<string, string> = {
  email: "Email & password",
  google: "Google",
  phone: "Phone",
  apple: "Apple",
  github: "GitHub",
  azure: "Microsoft",
  facebook: "Facebook",
  discord: "Discord",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  slack: "Slack",
  spotify: "Spotify",
  twitch: "Twitch",
  workos: "WorkOS",
  keycloak: "Keycloak",
  saml: "SAML SSO",
};

export const getIdentityProviderLabel = (provider: string): string =>
  IDENTITY_PROVIDER_LABELS[provider] ?? provider;

/** Prefer generated `email` when present — do not use identity_data for authorization. */
export const getIdentityDisplayEmail = (
  identity: UserIdentity
): string | null => {
  const withEmail = identity as UserIdentity & { email?: string | null };

  if (typeof withEmail.email === "string" && withEmail.email.length > 0) {
    return withEmail.email;
  }

  const fromData = identity.identity_data?.email;

  return typeof fromData === "string" ? fromData : null;
};

export const formatIdentityLastUsed = (
  value: string | undefined
): string | null => {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleString();
};

export const canUnlinkIdentity = (identities: UserIdentity[]): boolean =>
  identities.length >= 2;

/** SAML SSO identities are excluded from manual/automatic linking targets. */
export const isSsoIdentity = (identity: UserIdentity): boolean =>
  identity.provider === "saml" || identity.provider === "sso";

export const hasEmailPasswordIdentity = (identities: UserIdentity[]): boolean =>
  identities.some((identity) => identity.provider === "email");

export const getLinkableOAuthProviders = (
  identities: UserIdentity[],
  enabled: { google?: boolean }
): "google"[] => {
  const linked = new Set(identities.map((identity) => identity.provider));
  const providers: "google"[] = [];

  if (enabled.google && !linked.has("google")) {
    providers.push("google");
  }

  return providers;
};
