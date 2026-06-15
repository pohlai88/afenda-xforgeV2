export type JwtSigningKeyInfo = {
  kid: string;
  algorithm: string;
  keyType: string;
};

export type JwtApiKeyMode = {
  client: "publishable" | "legacy_anon_jwt" | "missing" | "unknown";
  server: "secret" | "legacy_service_role_jwt" | "missing" | "unknown";
};

export type JwtSigningReport = {
  jwksUrl: string;
  signingSystem: "asymmetric" | "legacy_hs256_only" | "unknown";
  activeKeys: JwtSigningKeyInfo[];
  apiKeys: JwtApiKeyMode;
  verificationMethod: "getClaims_jwks";
  legacyAnonKeyEnabled: boolean | null;
  recommendations: string[];
};

export const describeJwtAlgorithm = (algorithm: string): string => {
  switch (algorithm) {
    case "ES256":
      return "ES256 (P-256 elliptic curve)";
    case "RS256":
      return "RS256 (RSA 2048)";
    case "HS256":
      return "HS256 (shared secret — legacy)";
    default:
      return algorithm;
  }
};

export const describeClientKeyMode = (mode: JwtApiKeyMode["client"]): string => {
  switch (mode) {
    case "publishable":
      return "Publishable (`sb_publishable_…`)";
    case "legacy_anon_jwt":
      return "Legacy anon JWT (deprecated)";
    case "missing":
      return "Not configured";
    default:
      return "Unknown key format";
  }
};

export const describeServerKeyMode = (mode: JwtApiKeyMode["server"]): string => {
  switch (mode) {
    case "secret":
      return "Secret (`sb_secret_…`)";
    case "legacy_service_role_jwt":
      return "Legacy service_role JWT (deprecated)";
    case "missing":
      return "Not configured";
    default:
      return "Unknown key format";
  }
};

export const detectClientKeyMode = (key: string): JwtApiKeyMode["client"] => {
  if (!key) {
    return "missing";
  }

  if (key.startsWith("sb_publishable_")) {
    return "publishable";
  }

  if (key.startsWith("eyJ")) {
    return "legacy_anon_jwt";
  }

  return "unknown";
};

export const detectServerKeyMode = (key: string): JwtApiKeyMode["server"] => {
  if (!key) {
    return "missing";
  }

  if (key.startsWith("sb_secret_")) {
    return "secret";
  }

  if (key.startsWith("eyJ")) {
    return "legacy_service_role_jwt";
  }

  return "unknown";
};
