import "server-only";

import { createClient } from "./server";
import type {
  AuthOtpType,
  ConfirmAuthLinkParams,
  ConfirmAuthLinkResult,
} from "./types";
import { AUTH_OTP_TYPES } from "./types";

export const isAuthOtpType = (value: string | null): value is AuthOtpType =>
  value !== null &&
  (AUTH_OTP_TYPES as readonly string[]).includes(value);

export const resolveSafeRedirect = (next: string | null): string =>
  next?.startsWith("/") ? next : "/";

export const confirmAuthLink = async (
  params: ConfirmAuthLinkParams
): Promise<ConfirmAuthLinkResult> => {
  const safeNext = resolveSafeRedirect(params.next);
  const supabase = await createClient();

  if (params.tokenHash && params.type) {
    if (!isAuthOtpType(params.type)) {
      return { ok: false, error: "invalid_auth_link" };
    }

    const { error } = await supabase.auth.verifyOtp({
      type: params.type,
      token_hash: params.tokenHash,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, redirectTo: `${params.origin}${safeNext}` };
  }

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, redirectTo: `${params.origin}${safeNext}` };
  }

  return { ok: false, error: "invalid_auth_link" };
};

export type {
  AuthOtpType,
  ConfirmAuthLinkParams,
  ConfirmAuthLinkResult,
} from "./types";
