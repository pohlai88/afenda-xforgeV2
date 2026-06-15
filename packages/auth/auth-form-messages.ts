import {
  type AuthError,
  isAuthApiError,
  isAuthError,
  isAuthWeakPasswordError,
} from "@supabase/supabase-js";

/** App-local keys passed through redirects (not Supabase API codes). */
export const APP_AUTH_ERROR_CODES = {
  invalidAuthLink: "invalid_auth_link",
} as const;

/**
 * User-facing messages keyed by Supabase Auth API `error.code`.
 * Prefer branching on codes — not `error.message` — per Supabase guidance.
 */
export const AUTH_ERROR_CODE_MESSAGES: Record<string, string> = {
  invalid_credentials: "Email or password is incorrect.",
  email_not_confirmed:
    "Confirm your email before signing in. Check your inbox or request a new link from sign-up.",
  user_already_exists:
    "An account with this email already exists. Sign in instead.",
  email_exists: "An account with this email already exists. Sign in instead.",
  weak_password: "Choose a stronger password that meets the requirements below.",
  over_request_rate_limit: "Too many attempts. Wait a minute and try again.",
  over_email_send_rate_limit:
    "Too many emails sent. Wait a minute and try again.",
  over_sms_send_rate_limit: "Too many SMS messages sent. Wait a minute and try again.",
  otp_expired: "This link is invalid or has expired. Request a new one.",
  otp_disabled: "Email codes are not enabled for this project.",
  signup_disabled: "New account registration is currently closed.",
  passkey_disabled: "Passkey sign-in is not enabled for this project.",
  too_many_passkeys:
    "You have reached the maximum number of passkeys for this account.",
  webauthn_credential_exists:
    "This passkey is already registered to your account.",
  webauthn_credential_not_found:
    "That passkey is not registered. Try another or sign in with email.",
  webauthn_challenge_not_found: "The passkey prompt expired. Try again.",
  webauthn_challenge_expired: "The passkey prompt expired. Try again.",
  webauthn_verification_failed:
    "Passkey verification failed. Try again or use another sign-in method.",
  manual_linking_disabled:
    "Manual identity linking is disabled. Enable it in Supabase Authentication settings.",
  identity_already_exists:
    "That sign-in method is already linked to your account.",
  single_identity_not_deletable:
    "Link another sign-in method before unlinking this one.",
  email_conflict_identity_not_deletable:
    "Link another sign-in method before unlinking this one.",
  saml_relay_state_expired:
    "SAML sign-in expired. Start again from your organization's portal.",
  saml_relay_state_not_found:
    "SAML sign-in could not be completed. Start again from your organization's portal.",
  user_sso_managed:
    "SAML SSO accounts cannot be linked to other identities.",
  session_expired: "Your session expired. Sign in again.",
  session_not_found: "Your session expired. Sign in again.",
  refresh_token_not_found: "Your session expired. Sign in again.",
  refresh_token_already_used: "Your session expired. Sign in again.",
  flow_state_expired: "Sign-in timed out. Try again.",
  flow_state_not_found: "Sign-in could not be completed. Try again.",
  bad_oauth_state: "Sign-in could not be completed. Try again.",
  bad_oauth_callback: "Sign-in could not be completed. Try again.",
  bad_code_verifier:
    "Sign-in could not be completed. Try again from the same browser.",
  provider_disabled: "That sign-in provider is not enabled.",
  oauth_provider_not_supported: "That sign-in provider is not supported.",
  email_provider_disabled: "Email sign-in is not enabled for this project.",
  phone_provider_disabled: "Phone sign-in is not enabled for this project.",
  anonymous_provider_disabled:
    "Anonymous sign-in is not enabled for this project.",
  captcha_failed: "Captcha verification failed. Try again.",
  same_password: "Choose a new password that is different from your current one.",
  reauthentication_needed: "Confirm your identity before continuing.",
  reauthentication_not_valid: "Confirmation failed. Try again.",
  reauth_nonce_missing: "Confirmation failed. Try again.",
  mfa_challenge_expired: "Your verification code expired. Request a new one.",
  mfa_verification_failed: "Verification code is incorrect. Try again.",
  mfa_verification_rejected: "Verification was rejected. Try again.",
  mfa_factor_not_found: "That verification method was not found.",
  mfa_factor_name_conflict: "You already have a verification method with that name.",
  too_many_enrolled_mfa_factors:
    "You have reached the maximum number of verification methods.",
  mfa_ip_address_mismatch:
    "Verification must be completed from the same network. Try again.",
  insufficient_aal: "Additional verification is required to continue.",
  mfa_totp_enroll_not_enabled:
    "Authenticator app verification is not enabled for this project.",
  mfa_totp_verify_not_enabled:
    "Authenticator app verification is not enabled for this project.",
  mfa_phone_enroll_not_enabled:
    "Phone verification is not enabled for this project.",
  mfa_phone_verify_not_enabled:
    "Phone verification is not enabled for this project.",
  mfa_webauthn_enroll_not_enabled:
    "Security key enrollment is not enabled for this project.",
  mfa_webauthn_verify_not_enabled:
    "Security key verification is not enabled for this project.",
  email_address_invalid: "Enter a valid email address.",
  email_address_not_authorized:
    "This email address is not allowed. Use a different email.",
  user_banned: "This account has been suspended.",
  user_not_found: "No account was found for those details.",
  validation_failed: "Check your details and try again.",
  unexpected_failure: "Something went wrong. Try again.",
  request_timeout: "The request timed out. Try again.",
  [APP_AUTH_ERROR_CODES.invalidAuthLink]:
    "This link is invalid or has expired. Request a new one.",
};

/** User-facing messages keyed by client `AuthError.name` (CustomAuthError subclasses). */
export const AUTH_CLIENT_ERROR_NAME_MESSAGES: Record<string, string> = {
  AuthSessionMissingError: "Your session expired. Sign in again.",
  AuthInvalidCredentialsError: "Email or password is incorrect.",
  AuthWeakPasswordError:
    "Choose a stronger password that meets the requirements below.",
  AuthPKCECodeVerifierMissingError:
    "Sign-in could not be completed. Try again from the same browser.",
  AuthPKCEGrantCodeExchangeError:
    "Sign-in could not be completed. Try again from the same browser.",
  AuthInvalidTokenResponseError:
    "Sign-in could not be completed. Try again.",
  AuthImplicitGrantRedirectError:
    "Sign-in could not be completed. Try again.",
  AuthInvalidJwtError: "Your session is invalid. Sign in again.",
  AuthRefreshDiscardedError: "Your session expired. Sign in again.",
  AuthRetryableFetchError: "Network error. Check your connection and try again.",
};

const WEAK_PASSWORD_REASON_MESSAGES: Record<string, string> = {
  length: "Use at least 8 characters.",
  characters: "Include upper, lower, number, and symbol characters.",
  pwned: "This password appeared in a data breach. Choose a different one.",
};

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  403: "This action is not available for your account.",
  422: "We could not complete that request. Check your details and try again.",
  429: "Too many attempts. Wait a minute and try again.",
  500: "Authentication is temporarily unavailable. Try again later.",
  501: "This sign-in method is not enabled.",
};

/** Legacy fallback when only a message string is available (e.g. old redirects). */
const AUTH_ERROR_MESSAGE_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /invalid login credentials/i,
    message: "Email or password is incorrect.",
  },
  {
    pattern: /email not confirmed/i,
    message:
      "Confirm your email before signing in. Check your inbox or request a new link from sign-up.",
  },
  {
    pattern: /user already registered/i,
    message: "An account with this email already exists. Sign in instead.",
  },
  {
    pattern: /password should be at least/i,
    message: "Choose a stronger password that meets the requirements below.",
  },
  {
    pattern: /email rate limit|too many requests|after \d+ seconds/i,
    message: "Too many attempts. Wait a minute and try again.",
  },
  {
    pattern: /invalid or has expired|otp_expired|token.*expired/i,
    message: "This link is invalid or has expired. Request a new one.",
  },
  {
    pattern: /signup is disabled/i,
    message: "New account registration is currently closed.",
  },
  {
    pattern: /passkey_disabled/i,
    message: "Passkey sign-in is not enabled for this project.",
  },
  {
    pattern: /too_many_passkeys/i,
    message: "You have reached the maximum number of passkeys for this account.",
  },
  {
    pattern: /webauthn_credential_exists/i,
    message: "This passkey is already registered to your account.",
  },
  {
    pattern: /webauthn_credential_not_found/i,
    message: "That passkey is not registered. Try another or sign in with email.",
  },
  {
    pattern: /webauthn_challenge_not_found|webauthn_challenge_expired/i,
    message: "The passkey prompt expired. Try again.",
  },
  {
    pattern: /webauthn_verification_failed/i,
    message: "Passkey verification failed. Try again or use another sign-in method.",
  },
  {
    pattern: /not allowed|not supported|publickey/i,
    message: "Passkeys are not supported in this browser or origin.",
  },
  {
    pattern: /manual linking.*disabled|manual_linking/i,
    message:
      "Manual identity linking is disabled. Enable it in Supabase Authentication settings.",
  },
  {
    pattern: /identity.*already linked|already linked to/i,
    message: "That sign-in method is already linked to your account.",
  },
  {
    pattern: /at least 2 identities|cannot unlink.*only/i,
    message: "Link another sign-in method before unlinking this one.",
  },
  {
    pattern: /saml|sso.*link/i,
    message: "SAML SSO accounts cannot be linked to other identities.",
  },
  {
    pattern: /obfuscated/i,
    message:
      "If you already have an account with this email, sign in instead. Verification emails are not sent to prevent account enumeration.",
  },
];

const DEFAULT_AUTH_ERROR_MESSAGE = "Something went wrong. Try again.";

const humanizeAuthMessage = (message: string) => {
  const trimmed = message.trim();

  if (!trimmed) {
    return DEFAULT_AUTH_ERROR_MESSAGE;
  }

  if (AUTH_ERROR_CODE_MESSAGES[trimmed]) {
    return AUTH_ERROR_CODE_MESSAGES[trimmed];
  }

  for (const { pattern, message: friendly } of AUTH_ERROR_MESSAGE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return friendly;
    }
  }

  return trimmed;
};

const humanizeWeakPasswordError = (error: AuthError) => {
  if (!isAuthWeakPasswordError(error)) {
    return null;
  }

  const reasons = error.reasons
    .map((reason) => WEAK_PASSWORD_REASON_MESSAGES[reason])
    .filter(Boolean);

  if (reasons.length > 0) {
    return reasons.join(" ");
  }

  return AUTH_CLIENT_ERROR_NAME_MESSAGES.AuthWeakPasswordError;
};

/**
 * Stable key for redirects/query params — prefers API `code`, then client `name`.
 */
export const getAuthErrorKey = (error: AuthError): string => {
  if (isAuthApiError(error) && error.code) {
    return error.code;
  }

  if (AUTH_CLIENT_ERROR_NAME_MESSAGES[error.name]) {
    return error.name;
  }

  return error.message;
};

export type AuthErrorInput =
  | string
  | AuthError
  | { message: string; name?: string }
  | null
  | undefined;

export const humanizeAuthError = (input: AuthErrorInput): string => {
  if (!input) {
    return DEFAULT_AUTH_ERROR_MESSAGE;
  }

  if (typeof input === "string") {
    return humanizeAuthMessage(input);
  }

  const weakPasswordMessage = humanizeWeakPasswordError(input as AuthError);
  if (weakPasswordMessage) {
    return weakPasswordMessage;
  }

  if (isAuthApiError(input)) {
    if (input.code && AUTH_ERROR_CODE_MESSAGES[input.code]) {
      return AUTH_ERROR_CODE_MESSAGES[input.code];
    }

    if (input.status && HTTP_STATUS_MESSAGES[input.status]) {
      return HTTP_STATUS_MESSAGES[input.status];
    }
  }

  if (input.name && AUTH_CLIENT_ERROR_NAME_MESSAGES[input.name]) {
    return AUTH_CLIENT_ERROR_NAME_MESSAGES[input.name];
  }

  return humanizeAuthMessage(input.message);
};

export const humanizeUnknownAuthError = (error: unknown): string => {
  if (isAuthError(error)) {
    return humanizeAuthError(error);
  }

  if (error instanceof Error) {
    return humanizeAuthError(error.message);
  }

  return DEFAULT_AUTH_ERROR_MESSAGE;
};
