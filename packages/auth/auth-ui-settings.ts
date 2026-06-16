export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

/** Serializable — safe to pass from Server Components to client context. */
export interface PasswordPolicyConfig {
  blockLeakedPasswords: boolean;
  minLength: number;
  requireDigits: boolean;
  requiredCharacters: string | null;
  requireLowercase: boolean;
  requireSymbols: boolean;
  requireUppercase: boolean;
}

/** Resolved on the client — includes validator functions. */
export type PasswordPolicy = PasswordPolicyConfig & {
  rules: PasswordRule[];
};

export interface AuthPasskeySettings {
  enabled: boolean;
  rpDisplayName: string | null;
  rpId: string | null;
  rpOrigins: string[];
}

export interface AuthMfaSettings {
  maxEnrolledFactors: number;
  phoneEnrollEnabled: boolean;
  phoneVerifyEnabled: boolean;
  totpEnrollEnabled: boolean;
  totpVerifyEnabled: boolean;
}

export interface AuthOtpSettings {
  expSeconds: number;
  length: number;
}

export interface AuthUrlSettings {
  siteUrl: string | null;
  uriAllowList: string[];
}

export interface AuthSecuritySettings {
  captchaEnabled: boolean;
  captchaProvider: string | null;
  manualLinkingEnabled: boolean;
  requireCurrentPasswordOnChange: boolean;
  requireReauthenticationOnChange: boolean;
}

export interface AuthSessionSettings {
  /** Inactivity timeout in hours before session ends on next refresh. */
  inactivityTimeoutHours: number | null;
  /** Access token (JWT) lifetime in seconds. Supabase recommends 3600 (1 hour). */
  jwtExpSeconds: number;
  /** SSR-safe reuse window — keep at 10s unless you know why you are changing it. */
  refreshTokenReuseIntervalSeconds: number;
  refreshTokenRotationEnabled: boolean;
  singlePerUser: boolean;
  /** Fixed max session lifetime in hours; `null` when time-box is disabled. */
  timeboxHours: number | null;
}

export interface AuthRateLimitSettings {
  anonymousUsersPerHour: number | null;
  emailSentPerHour: number | null;
  otpPerInterval: number | null;
  otpResendSeconds: number | null;
  sbForwardedForEnabled: boolean;
  smsSentPerHour: number | null;
  tokenRefreshPerInterval: number | null;
  verifyPerInterval: number | null;
}

export interface AuthAuditSettings {
  /** When false, events still go to Supabase dashboard log storage. */
  postgresStorageEnabled: boolean;
}

export interface AuthUiSettings {
  anonymous: boolean;
  audit: AuthAuditSettings;
  disableSignup: boolean;
  email: boolean;
  google: boolean;
  mailerAutoconfirm: boolean;
  mfa: AuthMfaSettings;
  otp: AuthOtpSettings;
  passkey: AuthPasskeySettings;
  passkeys: boolean;
  password: PasswordPolicyConfig;
  phone: boolean;
  rateLimits: AuthRateLimitSettings;
  saml: boolean;
  security: AuthSecuritySettings;
  sessions: AuthSessionSettings;
  urls: AuthUrlSettings;
}

export interface SupabaseAuthSettingsResponse {
  disable_signup?: boolean;
  external?: {
    email?: boolean;
    google?: boolean;
    phone?: boolean;
    anonymous_users?: boolean;
  };
  mailer_autoconfirm?: boolean;
  passkeys_enabled?: boolean;
  saml_enabled?: boolean;
}

export interface SupabaseManagementAuthConfig {
  audit_log_disable_postgres?: boolean | null;
  external_anonymous_users_enabled?: boolean | null;
  jwt_exp?: number | null;
  mailer_otp_exp?: number | null;
  mailer_otp_length?: number | null;
  mfa_max_enrolled_factors?: number | null;
  mfa_phone_enroll_enabled?: boolean | null;
  mfa_phone_verify_enabled?: boolean | null;
  mfa_totp_enroll_enabled?: boolean | null;
  mfa_totp_verify_enabled?: boolean | null;
  passkey_enabled?: boolean | null;
  password_hibp_enabled?: boolean | null;
  password_min_length?: number | null;
  password_required_characters?: string | null;
  rate_limit_anonymous_users?: number | null;
  rate_limit_email_sent?: number | null;
  rate_limit_otp?: number | null;
  rate_limit_sms_sent?: number | null;
  rate_limit_token_refresh?: number | null;
  rate_limit_verify?: number | null;
  rate_limit_web3?: number | null;
  refresh_token_rotation_enabled?: boolean | null;
  security_captcha_enabled?: boolean | null;
  security_captcha_provider?: string | null;
  security_manual_linking_enabled?: boolean | null;
  security_refresh_token_reuse_interval?: number | null;
  security_sb_forwarded_for_enabled?: boolean | null;
  security_update_password_require_current_password?: boolean | null;
  security_update_password_require_reauthentication?: boolean | null;
  sessions_inactivity_timeout?: number | null;
  sessions_single_per_user?: boolean | null;
  sessions_timebox?: number | null;
  site_url?: string | null;
  smtp_max_frequency?: number | null;
  uri_allow_list?: string | null;
  webauthn_rp_display_name?: string | null;
  webauthn_rp_id?: string | null;
  webauthn_rp_origins?: string | null;
}

const LOWER_SET = "abcdefghijklmnopqrstuvwxyz";
const UPPER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT_SET = "0123456789";
const SYMBOL_SET = "!@#$%^&*()_+-=[]{};':\"|<>?,./`~";

const describeCharacterSet = (characterSet: string): string => {
  if (characterSet === LOWER_SET) {
    return "Lowercase";
  }

  if (characterSet === UPPER_SET) {
    return "Uppercase";
  }

  if (characterSet === DIGIT_SET) {
    return "Digits";
  }

  return "Symbol";
};

const includesFromSet = (password: string, characterSet: string) =>
  [...characterSet].some((character) => password.includes(character));

export const parsePasswordRequiredCharacters = (
  raw: string | null | undefined
) => {
  if (!raw) {
    return {
      requiredCharacters: null,
      requireLowercase: false,
      requireUppercase: false,
      requireDigits: false,
      requireSymbols: false,
    };
  }

  const sets = raw.split(":").filter(Boolean);

  return {
    requiredCharacters: raw,
    requireLowercase: sets.includes(LOWER_SET),
    requireUppercase: sets.includes(UPPER_SET),
    requireDigits: sets.includes(DIGIT_SET),
    requireSymbols: sets.some(
      (set) =>
        set !== LOWER_SET &&
        set !== UPPER_SET &&
        set !== DIGIT_SET &&
        set.length > 0
    ),
  };
};

export const buildPasswordPolicyConfig = (input: {
  minLength?: number | null;
  requiredCharacters?: string | null;
  blockLeakedPasswords?: boolean | null;
}): PasswordPolicyConfig => {
  const parsed = parsePasswordRequiredCharacters(input.requiredCharacters);

  return {
    minLength: input.minLength ?? 8,
    blockLeakedPasswords: input.blockLeakedPasswords ?? false,
    ...parsed,
  };
};

export const resolvePasswordPolicy = (
  config: PasswordPolicyConfig
): PasswordPolicy => {
  const sets = config.requiredCharacters?.split(":").filter(Boolean) ?? [];
  const lengthRule: PasswordRule = {
    id: "length",
    label: `At least ${config.minLength} characters`,
    test: (password) => password.length >= config.minLength,
  };

  const charsetRules = sets.map((set, index) => ({
    id: `charset-${index}`,
    label: describeCharacterSet(set),
    test: (password: string) => includesFromSet(password, set),
  }));

  return {
    ...config,
    rules: [lengthRule, ...charsetRules],
  };
};

export const defaultPasswordPolicyConfig = (): PasswordPolicyConfig =>
  buildPasswordPolicyConfig({
    minLength: 8,
    requiredCharacters: `${LOWER_SET}:${UPPER_SET}:${DIGIT_SET}:${SYMBOL_SET}`,
    blockLeakedPasswords: false,
  });

export const defaultAuthUiSettings = (): AuthUiSettings => ({
  email: true,
  google: false,
  passkeys: false,
  phone: false,
  saml: false,
  anonymous: false,
  disableSignup: false,
  mailerAutoconfirm: false,
  password: defaultPasswordPolicyConfig(),
  passkey: {
    enabled: false,
    rpId: null,
    rpDisplayName: null,
    rpOrigins: [],
  },
  mfa: {
    maxEnrolledFactors: 10,
    totpEnrollEnabled: true,
    totpVerifyEnabled: true,
    phoneEnrollEnabled: false,
    phoneVerifyEnabled: false,
  },
  otp: {
    length: 6,
    expSeconds: 3600,
  },
  urls: {
    siteUrl: null,
    uriAllowList: [],
  },
  security: {
    captchaEnabled: false,
    captchaProvider: null,
    requireCurrentPasswordOnChange: true,
    requireReauthenticationOnChange: false,
    manualLinkingEnabled: false,
  },
  sessions: {
    jwtExpSeconds: 3600,
    timeboxHours: null,
    inactivityTimeoutHours: null,
    singlePerUser: false,
    refreshTokenRotationEnabled: true,
    refreshTokenReuseIntervalSeconds: 10,
  },
  rateLimits: {
    emailSentPerHour: null,
    otpPerInterval: null,
    verifyPerInterval: null,
    tokenRefreshPerInterval: null,
    smsSentPerHour: null,
    anonymousUsersPerHour: null,
    otpResendSeconds: null,
    sbForwardedForEnabled: false,
  },
  audit: {
    postgresStorageEnabled: true,
  },
});

const parseOrigins = (value: string | null | undefined) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const parseAllowList = (value: string | null | undefined) =>
  value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];

/** Management API session durations are expressed in hours; `0` means disabled. */
const parseSessionHours = (value: number | null | undefined): number | null =>
  value && value > 0 ? value : null;

export const formatJwtLifetime = (seconds: number): string => {
  if (seconds % 3600 === 0 && seconds >= 3600) {
    const hours = seconds / 3600;
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  if (seconds >= 60 && seconds % 60 === 0) {
    const minutes = seconds / 60;
    return minutes === 1 ? "1 minute" : `${minutes} minutes`;
  }

  return `${seconds} seconds`;
};

export const formatSessionHours = (hours: number | null): string => {
  if (hours === null) {
    return "No limit";
  }

  if (hours === 1) {
    return "1 hour";
  }

  if (hours % 24 === 0) {
    const days = hours / 24;
    return days === 1 ? "1 day" : `${days} days`;
  }

  return `${hours} hours`;
};

const buildSessionSettings = (
  management: SupabaseManagementAuthConfig | null
): AuthSessionSettings => {
  const defaults = defaultAuthUiSettings().sessions;
  const m = management ?? {};

  return {
    jwtExpSeconds: m.jwt_exp ?? defaults.jwtExpSeconds,
    timeboxHours: parseSessionHours(m.sessions_timebox),
    inactivityTimeoutHours: parseSessionHours(m.sessions_inactivity_timeout),
    singlePerUser: m.sessions_single_per_user ?? defaults.singlePerUser,
    refreshTokenRotationEnabled:
      m.refresh_token_rotation_enabled ?? defaults.refreshTokenRotationEnabled,
    refreshTokenReuseIntervalSeconds:
      m.security_refresh_token_reuse_interval ??
      defaults.refreshTokenReuseIntervalSeconds,
  };
};

export const mergeAuthUiSettings = (
  publicSettings: SupabaseAuthSettingsResponse,
  management: SupabaseManagementAuthConfig | null
): AuthUiSettings => {
  const defaults = defaultAuthUiSettings();
  const external = publicSettings.external ?? {};
  const m = management ?? {};

  return {
    email: external.email ?? defaults.email,
    google: external.google ?? defaults.google,
    passkeys:
      publicSettings.passkeys_enabled ?? m.passkey_enabled ?? defaults.passkeys,
    phone: external.phone ?? defaults.phone,
    saml: publicSettings.saml_enabled ?? defaults.saml,
    anonymous:
      external.anonymous_users ??
      m.external_anonymous_users_enabled ??
      defaults.anonymous,
    disableSignup: publicSettings.disable_signup ?? defaults.disableSignup,
    mailerAutoconfirm:
      publicSettings.mailer_autoconfirm ?? defaults.mailerAutoconfirm,
    password: buildPasswordPolicyConfig({
      minLength: m.password_min_length,
      requiredCharacters: m.password_required_characters,
      blockLeakedPasswords: m.password_hibp_enabled,
    }),
    passkey: {
      enabled: publicSettings.passkeys_enabled ?? m.passkey_enabled ?? false,
      rpId: m.webauthn_rp_id ?? null,
      rpDisplayName: m.webauthn_rp_display_name ?? null,
      rpOrigins: parseOrigins(m.webauthn_rp_origins),
    },
    mfa: {
      maxEnrolledFactors:
        m.mfa_max_enrolled_factors ?? defaults.mfa.maxEnrolledFactors,
      totpEnrollEnabled:
        m.mfa_totp_enroll_enabled ?? defaults.mfa.totpEnrollEnabled,
      totpVerifyEnabled:
        m.mfa_totp_verify_enabled ?? defaults.mfa.totpVerifyEnabled,
      phoneEnrollEnabled:
        m.mfa_phone_enroll_enabled ?? defaults.mfa.phoneEnrollEnabled,
      phoneVerifyEnabled:
        m.mfa_phone_verify_enabled ?? defaults.mfa.phoneVerifyEnabled,
    },
    otp: {
      length: m.mailer_otp_length ?? defaults.otp.length,
      expSeconds: m.mailer_otp_exp ?? defaults.otp.expSeconds,
    },
    urls: {
      siteUrl: m.site_url ?? null,
      uriAllowList: parseAllowList(m.uri_allow_list),
    },
    security: {
      captchaEnabled:
        m.security_captcha_enabled ?? defaults.security.captchaEnabled,
      captchaProvider: m.security_captcha_provider ?? null,
      requireCurrentPasswordOnChange:
        defaults.security.requireCurrentPasswordOnChange ||
        m.security_update_password_require_current_password === true,
      requireReauthenticationOnChange:
        m.security_update_password_require_reauthentication ?? false,
      manualLinkingEnabled:
        m.security_manual_linking_enabled ??
        defaults.security.manualLinkingEnabled,
    },
    sessions: buildSessionSettings(management),
    rateLimits: {
      emailSentPerHour:
        m.rate_limit_email_sent ?? defaults.rateLimits.emailSentPerHour,
      otpPerInterval: m.rate_limit_otp ?? defaults.rateLimits.otpPerInterval,
      verifyPerInterval:
        m.rate_limit_verify ?? defaults.rateLimits.verifyPerInterval,
      tokenRefreshPerInterval:
        m.rate_limit_token_refresh ??
        defaults.rateLimits.tokenRefreshPerInterval,
      smsSentPerHour:
        m.rate_limit_sms_sent ?? defaults.rateLimits.smsSentPerHour,
      anonymousUsersPerHour:
        m.rate_limit_anonymous_users ??
        defaults.rateLimits.anonymousUsersPerHour,
      otpResendSeconds:
        m.smtp_max_frequency ?? defaults.rateLimits.otpResendSeconds,
      sbForwardedForEnabled:
        m.security_sb_forwarded_for_enabled ??
        defaults.rateLimits.sbForwardedForEnabled,
    },
    audit: {
      postgresStorageEnabled: !(m.audit_log_disable_postgres ?? false),
    },
  };
};

export const parseAuthUiSettings = (
  payload: SupabaseAuthSettingsResponse
): AuthUiSettings => mergeAuthUiSettings(payload, null);

export const fetchPublicAuthSettings = async (
  supabaseUrl: string,
  anonKey: string
): Promise<SupabaseAuthSettingsResponse> => {
  const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
    headers: { apikey: anonKey },
  });

  if (!response.ok) {
    throw new Error(`Public auth settings failed (${response.status})`);
  }

  return response.json() as Promise<SupabaseAuthSettingsResponse>;
};

export const fetchAuthUiSettings = async (
  supabaseUrl: string,
  anonKey: string
): Promise<AuthUiSettings> => {
  try {
    const payload = await fetchPublicAuthSettings(supabaseUrl, anonKey);
    return parseAuthUiSettings(payload);
  } catch {
    return defaultAuthUiSettings();
  }
};

export const PENDING_CONFIRMATION_EMAIL_KEY =
  "afenda:pending-confirmation-email";

export const isPasskeyOriginSupported = (
  passkey: AuthPasskeySettings,
  origin = typeof window === "undefined" ? null : window.location.origin
) => {
  if (!(passkey.enabled && origin)) {
    return true;
  }

  if (passkey.rpOrigins.length === 0) {
    return true;
  }

  return passkey.rpOrigins.includes(origin);
};
