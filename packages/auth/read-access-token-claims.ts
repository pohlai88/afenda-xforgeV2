import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseAccessTokenClaims } from "./access-token-claims";

/**
 * Verified access-token claims via `supabase.auth.getClaims()`.
 * Prefer this over manual JWT parsing or shared-secret verification.
 */
export const readAccessTokenClaims = async (
  supabase: SupabaseClient
): Promise<SupabaseAccessTokenClaims | null> => {
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return data.claims as SupabaseAccessTokenClaims;
};