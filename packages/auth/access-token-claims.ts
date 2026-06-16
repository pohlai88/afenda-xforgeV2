import { getSupabaseUrl } from "./keys";
import type { OrganizationRole } from "./organization-roles";
import { parseOrganizationRole } from "./organization-roles";

/** Postgres / JWT `role` claim values. */
export const SUPABASE_JWT_ROLES = [
  "anon",
  "authenticated",
  "service_role",
] as const;

export type SupabaseJwtRole = (typeof SUPABASE_JWT_ROLES)[number];

/** JWT `aud` claim for user access tokens. */
export const SUPABASE_JWT_AUDIENCES = ["authenticated", "anon"] as const;

export type SupabaseJwtAudience = (typeof SUPABASE_JWT_AUDIENCES)[number];

/** Authenticator assurance level (`aal` claim). */
export const SUPABASE_AAL_VALUES = ["aal1", "aal2"] as const;

export type SupabaseAal = (typeof SUPABASE_AAL_VALUES)[number];

/** `amr[].method` values documented by Supabase Auth. */
export const SUPABASE_AMR_METHODS = [
  "oauth",
  "password",
  "otp",
  "totp",
  "recovery",
  "invite",
  "sso/saml",
  "magiclink",
  "email/signup",
  "email_change",
  "token_refresh",
  "anonymous",
] as const;

export type SupabaseAmrMethod = (typeof SUPABASE_AMR_METHODS)[number];

export interface SupabaseAmrClaim {
  method: SupabaseAmrMethod | string;
  timestamp: number;
}

/** Standard Supabase `app_metadata` plus hook-injected org claims. */
export interface AccessTokenAppMetadata {
  organization_id?: string;
  organization_role?: OrganizationRole;
  provider?: string;
  providers?: string[];
}

export interface AccessTokenUserMetadata {
  activeOrganizationId?: string;
  name?: string;
}

/**
 * Supabase Auth access-token claims (authenticated user JWT).
 * Required fields are always present on valid user tokens; optional fields vary by auth flow.
 *
 * @see https://supabase.com/docs/guides/auth/jwt-fields
 */
export interface SupabaseAccessTokenClaims {
  aal: SupabaseAal | string;
  amr?: SupabaseAmrClaim[];
  app_metadata?: AccessTokenAppMetadata;
  aud: SupabaseJwtAudience | string | string[];
  email: string;
  exp: number;
  iat: number;
  is_anonymous: boolean;
  iss: string;
  jti?: string;
  nbf?: number;
  phone: string;
  role: SupabaseJwtRole | string;
  session_id: string;
  sub: string;
  user_metadata?: AccessTokenUserMetadata;
}

/**
 * Anon / service-role API key JWTs include `ref` (project reference).
 * In Rust, deserialize with `#[serde(rename = "ref")]`.
 */
export interface SupabaseApiKeyJwtClaims {
  exp: number;
  iat: number;
  iss: string;
  ref: string;
  role: "anon" | "service_role";
}

const REQUIRED_AUTHENTICATED_CLAIM_KEYS = [
  "iss",
  "aud",
  "exp",
  "iat",
  "sub",
  "role",
  "aal",
  "session_id",
  "email",
  "phone",
  "is_anonymous",
] as const satisfies readonly (keyof SupabaseAccessTokenClaims)[];

const TRAILING_SLASH_PATTERN = /\/$/;

export const getSupabaseAuthIssuer = (
  supabaseUrl = getSupabaseUrl()
): string => {
  const base = supabaseUrl.replace(TRAILING_SLASH_PATTERN, "");
  return `${base}/auth/v1`;
};

/** JWKS URL for verifying Supabase-issued JWTs outside the client SDK (do not cache >10m). */
export const getSupabaseJwksUrl = (supabaseUrl = getSupabaseUrl()): string =>
  `${getSupabaseAuthIssuer(supabaseUrl)}/.well-known/jwks.json`;

export const parseAccessTokenAppMetadata = (
  appMetadata: unknown
): AccessTokenAppMetadata => {
  if (!appMetadata || typeof appMetadata !== "object") {
    return {};
  }

  const record = appMetadata as Record<string, unknown>;
  const organizationId =
    typeof record.organization_id === "string"
      ? record.organization_id
      : undefined;
  const organizationRole = parseOrganizationRole(record.organization_role);
  const provider =
    typeof record.provider === "string" ? record.provider : undefined;
  const providers = Array.isArray(record.providers)
    ? record.providers.filter(
        (entry): entry is string => typeof entry === "string"
      )
    : undefined;

  return {
    ...(provider ? { provider } : {}),
    ...(providers && providers.length > 0 ? { providers } : {}),
    ...(organizationId ? { organization_id: organizationId } : {}),
    ...(organizationRole ? { organization_role: organizationRole } : {}),
  };
};

export const getOrganizationIdFromAccessTokenClaims = (
  claims: Partial<SupabaseAccessTokenClaims> | null | undefined
): string | null =>
  parseAccessTokenAppMetadata(claims?.app_metadata).organization_id ?? null;

export const isAccessTokenExpired = (
  claims: Partial<SupabaseAccessTokenClaims> | null | undefined,
  nowSeconds = Math.floor(Date.now() / 1000)
): boolean => {
  if (typeof claims?.exp !== "number") {
    return true;
  }

  return claims.exp <= nowSeconds;
};

export const isAccessTokenNotYetValid = (
  claims: Partial<SupabaseAccessTokenClaims> | null | undefined,
  nowSeconds = Math.floor(Date.now() / 1000)
): boolean => {
  if (typeof claims?.nbf !== "number") {
    return false;
  }

  return claims.nbf > nowSeconds;
};

export const hasRequiredAuthenticatedClaims = (
  claims: unknown
): claims is SupabaseAccessTokenClaims => {
  if (!claims || typeof claims !== "object") {
    return false;
  }

  const record = claims as Record<string, unknown>;

  for (const key of REQUIRED_AUTHENTICATED_CLAIM_KEYS) {
    if (!(key in record)) {
      return false;
    }
  }

  return (
    typeof record.iss === "string" &&
    typeof record.exp === "number" &&
    typeof record.iat === "number" &&
    typeof record.sub === "string" &&
    typeof record.session_id === "string" &&
    typeof record.is_anonymous === "boolean"
  );
};

export interface ValidateAccessTokenClaimsOptions {
  expectedAudience?: SupabaseJwtAudience;
  expectedIssuer?: string;
  nowSeconds?: number;
}

export type AccessTokenValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Lightweight claim-shape checks after SDK verification (`getClaims()` / JWKS).
 * Does not verify signatures — use Supabase client or JWKS for that.
 */
export const validateAccessTokenClaims = (
  claims: unknown,
  options: ValidateAccessTokenClaimsOptions = {}
): AccessTokenValidationResult => {
  if (!hasRequiredAuthenticatedClaims(claims)) {
    return { ok: false, reason: "Missing required JWT claims." };
  }

  const now = options.nowSeconds ?? Math.floor(Date.now() / 1000);

  if (isAccessTokenExpired(claims, now)) {
    return { ok: false, reason: "JWT is expired." };
  }

  if (isAccessTokenNotYetValid(claims, now)) {
    return { ok: false, reason: "JWT is not yet valid." };
  }

  if (
    options.expectedIssuer &&
    claims.iss !== options.expectedIssuer &&
    !claims.iss.endsWith(options.expectedIssuer)
  ) {
    return { ok: false, reason: "JWT issuer does not match this project." };
  }

  if (options.expectedAudience) {
    const aud = claims.aud;
    const matches =
      aud === options.expectedAudience ||
      (Array.isArray(aud) && aud.includes(options.expectedAudience));

    if (!matches) {
      return { ok: false, reason: "JWT audience is invalid." };
    }
  }

  return { ok: true };
};
