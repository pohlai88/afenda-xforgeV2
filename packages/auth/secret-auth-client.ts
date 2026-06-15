import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseSecretKey,
  getSupabaseUrl,
} from "./keys";

type SecretAuthClientOptions = {
  /** End-user IP for Supabase rate limiting (requires sb_forwarded_for_enabled). */
  forwardedFor?: string | null;
};

/**
 * Secret-key Supabase client for server-side Auth admin calls.
 * Set `forwardedFor` when IP forwarding is enabled so rate limits apply to the user, not the server.
 */
export const createSecretAuthClient = ({
  forwardedFor,
}: SecretAuthClientOptions = {}) => {
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
