import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveSafeRedirectPath } from "./safe-redirect";

export type MfaAssuranceStatus = {
  needsChallenge: boolean;
  currentLevel: string | null;
  nextLevel: string | null;
};

export type VerifiableTotpFactor = {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: string;
};

export const getMfaAssuranceStatus = async (
  supabase: SupabaseClient
): Promise<MfaAssuranceStatus> => {
  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error || !data) {
    return { needsChallenge: false, currentLevel: null, nextLevel: null };
  }

  return {
    needsChallenge:
      data.currentLevel === "aal1" && data.nextLevel === "aal2",
    currentLevel: data.currentLevel,
    nextLevel: data.nextLevel,
  };
};

export const buildMfaChallengeHref = (intended = "/"): string => {
  const safeHref = resolveSafeRedirectPath(intended);
  const params = new URLSearchParams();

  if (safeHref !== "/") {
    params.set("next", safeHref);
  }

  const query = params.toString();
  return query ? `/mfa-challenge?${query}` : "/mfa-challenge";
};

export const resolvePostLoginHref = async (
  supabase: SupabaseClient,
  intended = "/"
): Promise<string> => {
  const status = await getMfaAssuranceStatus(supabase);

  if (status.needsChallenge) {
    return buildMfaChallengeHref(intended);
  }

  return resolveSafeRedirectPath(intended);
};

export const listVerifiableTotpFactors = async (
  supabase: SupabaseClient
): Promise<VerifiableTotpFactor[]> => {
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    return [];
  }

  return (data?.totp ?? []).filter((factor) => factor.status === "verified");
};
