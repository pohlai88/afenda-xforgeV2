import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { resolveActiveOrganizationId } from "./organization-context";
import {
  getOrganizationIdFromAccessTokenClaims,
  type SupabaseAccessTokenClaims,
} from "./access-token-claims";
import { readAccessTokenClaims } from "./read-access-token-claims";
import {
  getSupabasePublishableKey,
  getSupabaseSecretKey,
  getSupabaseUrl,
} from "./keys";
import type {
  AuthContext,
  AuthSession,
  AuthenticatedContext,
} from "./types";
import {
  MissingOrganizationError,
  UnauthenticatedError,
} from "./types";

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

export const createAdminClient = () => {
  const secretKey = getSupabaseSecretKey();

  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY) is not set"
    );
  }

  return createSupabaseClient(getSupabaseUrl(), secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      experimental: { passkey: true },
    },
  });
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

export type {
  AuthActionResult,
  AuthContext,
  AuthOtpType,
  AuthSession,
  AuthenticatedContext,
  ConfirmAuthLinkParams,
  ConfirmAuthLinkResult,
} from "./types";
export {
  getSupabaseAuthIssuer,
  getSupabaseJwksUrl,
  type SupabaseAccessTokenClaims,
  type SupabaseApiKeyJwtClaims,
  validateAccessTokenClaims,
} from "./access-token-claims";
export { readAccessTokenClaims } from "./read-access-token-claims";
export {
  AUTH_OTP_TYPES,
  MissingOrganizationError,
  UnauthorizedOrganizationError,
  UnauthenticatedError,
} from "./types";
