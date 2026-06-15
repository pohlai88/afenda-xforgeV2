import "server-only";

import { createServerClient } from "@supabase/ssr";
import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  getOrganizationIdFromAccessTokenClaims,
  type SupabaseAccessTokenClaims,
} from "./access-token-claims";
import {
  getSupabasePublishableKey,
  getSupabaseSecretKey,
  getSupabaseUrl,
} from "./keys";
import { resolveActiveOrganizationId } from "./organization-context";
import type { AuthContext, AuthenticatedContext, AuthSession } from "./types";
import { MissingOrganizationError, UnauthenticatedError } from "./types";

/**
 * Verified access-token claims via `supabase.auth.getClaims()`.
 * Prefer this over manual JWT parsing or shared-secret verification.
 */
const readAccessTokenClaims = async (
  supabase: SupabaseClient
): Promise<SupabaseAccessTokenClaims | null> => {
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return data.claims as SupabaseAccessTokenClaims;
};

export const createClient = async () => {
  // Per-request client — never store in module scope (Vercel Fluid compute).
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, _headers) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component — proxy refreshes sessions and applies cache headers.
        }
      },
    },
  });
};

type AdminClientOptions = {
  /** End-user IP for Supabase rate limiting (requires sb_forwarded_for_enabled). */
  forwardedFor?: string | null;
};

/** Secret-key Supabase client for server-side Auth admin calls. */
export const createAdminClient = ({
  forwardedFor,
}: AdminClientOptions = {}) => {
  const secretKey = getSupabaseSecretKey();

  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY) is not set"
    );
  }

  const headers: Record<string, string> = {};

  if (forwardedFor) {
    headers["sb-forwarded-for"] = forwardedFor;
  }

  return createSupabaseClient(getSupabaseUrl(), secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      experimental: { passkey: true },
    },
    global: Object.keys(headers).length > 0 ? { headers } : undefined,
  });
};

/** Prefer x-forwarded-for first hop, then x-real-ip. */
export const resolveClientIp = (request: Request): string | null => {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip")?.trim() || null;
};

export const currentUser = async () => {
  const supabase = await createClient();
  const claims = await readAccessTokenClaims(supabase);

  if (!claims) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const auth = async (): Promise<AuthContext> => {
  const supabase = await createClient();
  const claims = await readAccessTokenClaims(supabase);

  if (!claims?.sub) {
    return { userId: null, orgId: null };
  }

  const orgFromToken = getOrganizationIdFromAccessTokenClaims(claims);

  if (orgFromToken) {
    return { userId: claims.sub, orgId: orgFromToken };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, orgId: null };
  }

  return {
    userId: user.id,
    orgId: await resolveActiveOrganizationId(user.id, user.user_metadata),
  };
};

export const requireAuth = async (): Promise<AuthenticatedContext> => {
  const context = await auth();

  if (context.userId === null) {
    throw new UnauthenticatedError();
  }

  return context;
};

export const requireOrg = async (): Promise<
  AuthenticatedContext & { orgId: string }
> => {
  const context = await requireAuth();

  if (!context.orgId) {
    throw new MissingOrganizationError();
  }

  return { ...context, orgId: context.orgId };
};

export const getAuthSession = async (): Promise<AuthSession | null> => {
  const supabase = await createClient();
  const claims = await readAccessTokenClaims(supabase);

  if (!claims?.sub) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const orgFromToken = getOrganizationIdFromAccessTokenClaims(claims);

  return {
    user,
    orgId:
      orgFromToken ??
      (await resolveActiveOrganizationId(user.id, user.user_metadata)),
  };
};

export {
  getSupabaseAuthIssuer,
  getSupabaseJwksUrl,
  type SupabaseAccessTokenClaims,
  type SupabaseApiKeyJwtClaims,
  validateAccessTokenClaims,
} from "./access-token-claims";
export type {
  AuthActionResult,
  AuthContext,
  AuthenticatedContext,
  AuthOtpType,
  AuthSession,
  ConfirmAuthLinkParams,
  ConfirmAuthLinkResult,
} from "./types";
export {
  AUTH_OTP_TYPES,
  MissingOrganizationError,
  UnauthenticatedError,
  UnauthorizedOrganizationError,
} from "./types";
