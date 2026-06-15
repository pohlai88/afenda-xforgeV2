import "server-only";

import { APP_AUTH_ERROR_CODES, getAuthErrorKey } from "./auth-form-messages";
import { resolveSafeRedirectPath } from "./safe-redirect";
import { createClient } from "./server";
import type {
  AuthOtpType,
  ConfirmAuthLinkParams,
  ConfirmAuthLinkResult,
} from "./types";
import { AUTH_OTP_TYPES } from "./types";

export const isAuthOtpType = (value: string | null): value is AuthOtpType =>
  value !== null && (AUTH_OTP_TYPES as readonly string[]).includes(value);

export const resolveSafeRedirect = (next: string | null): string =>
  resolveSafeRedirectPath(next);

export const confirmAuthLink = async (
  params: ConfirmAuthLinkParams
): Promise<ConfirmAuthLinkResult> => {
  const safeNext = resolveSafeRedirect(params.next);
  const supabase = await createClient();

  if (params.tokenHash && params.type) {
    if (!isAuthOtpType(params.type)) {
      return {
        ok: false,
        error: APP_AUTH_ERROR_CODES.invalidAuthLink,
      };
    }

    const { error } = await supabase.auth.verifyOtp({
      type: params.type,
      token_hash: params.tokenHash,
    });

    if (error) {
      return { ok: false, error: getAuthErrorKey(error) };
    }

    return { ok: true, redirectTo: `${params.origin}${safeNext}` };
  }

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);

    if (error) {
      return { ok: false, error: getAuthErrorKey(error) };
    }

    return { ok: true, redirectTo: `${params.origin}${safeNext}` };
  }

  return { ok: false, error: APP_AUTH_ERROR_CODES.invalidAuthLink };
};

export type {
  AuthOtpType,
  ConfirmAuthLinkParams,
  ConfirmAuthLinkResult,
} from "./types";
