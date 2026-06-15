import "server-only";

import { getSupabaseJwksUrl } from "./access-token-claims";
import {
  detectClientKeyMode,
  detectServerKeyMode,
  type JwtSigningKeyInfo,
  type JwtSigningReport,
} from "./auth-jwt-signing.shared";
import {
  getSupabasePublishableKey,
  getSupabaseSecretKey,
  getSupabaseUrl,
  keys,
} from "./keys";

type JwksResponse = {
  keys?: Array<{
    kid?: string;
    alg?: string;
    kty?: string;
  }>;
};

const parseJwks = (payload: JwksResponse): JwtSigningKeyInfo[] =>
  (payload.keys ?? [])
    .filter((key) => key.kid && key.alg && key.kty)
    .map((key) => ({
      kid: key.kid as string,
      algorithm: key.alg as string,
      keyType: key.kty as string,
    }));

const inferSigningSystem = (
  keys: JwtSigningKeyInfo[]
): JwtSigningReport["signingSystem"] => {
  if (keys.length === 0) {
    return "unknown";
  }

  if (keys.every((key) => key.algorithm === "HS256")) {
    return "legacy_hs256_only";
  }

  if (
    keys.some((key) => key.algorithm === "ES256" || key.algorithm === "RS256")
  ) {
    return "asymmetric";
  }

  return "unknown";
};

export const fetchSupabaseSigningKeys = async (
  supabaseUrl = getSupabaseUrl()
): Promise<JwtSigningKeyInfo[]> => {
  if (!supabaseUrl) {
    return [];
  }

  const response = await fetch(getSupabaseJwksUrl(supabaseUrl), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`JWKS fetch failed (${response.status})`);
  }

  return parseJwks((await response.json()) as JwksResponse);
};

const fetchLegacyAnonKeyEnabled = async (): Promise<boolean | null> => {
  const projectRef = keys().SUPABASE_PROJECT_ID;
  const accessToken = keys().SUPABASE_ACCESS_TOKEN;

  if (!(projectRef && accessToken)) {
    return null;
  }

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/api-keys`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const apiKeys = (await response.json()) as Array<{
    name?: string;
    type?: string;
    disabled?: boolean;
  }>;

  const legacyAnon = apiKeys.find(
    (entry) => entry.name === "anon" || entry.type === "legacy"
  );

  return legacyAnon ? !legacyAnon.disabled : null;
};

export const getJwtSigningReport = async (): Promise<JwtSigningReport> => {
  const supabaseUrl = getSupabaseUrl();
  const jwksUrl = supabaseUrl ? getSupabaseJwksUrl(supabaseUrl) : "";
  const clientKey = getSupabasePublishableKey();
  const serverKey = getSupabaseSecretKey();

  const apiKeys = {
    client: detectClientKeyMode(clientKey),
    server: detectServerKeyMode(serverKey),
  };

  let activeKeys: JwtSigningKeyInfo[] = [];

  if (supabaseUrl) {
    try {
      activeKeys = await fetchSupabaseSigningKeys(supabaseUrl);
    } catch {
      activeKeys = [];
    }
  }

  const signingSystem = inferSigningSystem(activeKeys);
  const recommendations: string[] = [];

  if (signingSystem === "asymmetric") {
    recommendations.push(
      "Asymmetric JWT signing is active — keep using supabase.auth.getClaims() (not legacy JWT secret verification)."
    );
  } else if (signingSystem === "legacy_hs256_only") {
    recommendations.push(
      "Migrate JWT signing keys in Supabase dashboard (Settings → JWT signing keys)."
    );
  }

  if (apiKeys.client === "legacy_anon_jwt") {
    recommendations.push(
      "Switch NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to sb_publishable_… and disable the legacy anon key when traffic allows."
    );
  }

  if (apiKeys.server === "legacy_service_role_jwt") {
    recommendations.push(
      "Replace SUPABASE_SERVICE_ROLE_KEY with SUPABASE_SECRET_KEY (sb_secret_…) for server admin calls."
    );
  }

  const legacyAnonKeyEnabled = await fetchLegacyAnonKeyEnabled();

  if (legacyAnonKeyEnabled) {
    recommendations.push(
      "Legacy anon API key is still enabled in Supabase — disable it after all clients use the publishable key."
    );
  }

  if (apiKeys.client === "publishable" && apiKeys.server === "secret") {
    recommendations.push(
      "Publishable + secret API keys are configured — safe to disable legacy anon/service_role keys after verifying last-used metrics."
    );
  }

  return {
    jwksUrl,
    signingSystem,
    activeKeys,
    apiKeys,
    verificationMethod: "getClaims_jwks",
    legacyAnonKeyEnabled,
    recommendations,
  };
};

export type { JwtSigningReport } from "./auth-jwt-signing.shared";
export {
  describeClientKeyMode,
  describeJwtAlgorithm,
  describeServerKeyMode,
} from "./auth-jwt-signing.shared";
