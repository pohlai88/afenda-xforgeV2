import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getActiveOrganizationId } from "./metadata";
import { getSupabaseAnonKey, getSupabaseUrl, keys } from "./keys";
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
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component; middleware refreshes sessions.
        }
      },
    },
  });
};

export const createAdminClient = () => {
  const serviceRoleKey = keys().SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createSupabaseClient(getSupabaseUrl(), serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const currentUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const auth = async (): Promise<AuthContext> => {
  const user = await currentUser();

  if (!user) {
    return { userId: null, orgId: null };
  }

  return {
    userId: user.id,
    orgId: getActiveOrganizationId(user.user_metadata),
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
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return {
    user,
    orgId: getActiveOrganizationId(user.user_metadata),
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
  AUTH_OTP_TYPES,
  MissingOrganizationError,
  UnauthenticatedError,
} from "./types";
