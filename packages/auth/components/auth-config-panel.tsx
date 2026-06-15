"use client";

import { formatJwtLifetime } from "../auth-ui-settings";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { passwordRequirementsSummary } from "./password-requirements";
import {
  AuthConfigList,
  AuthConfigRow,
  AuthSection,
  AuthSectionHeader,
} from "./auth-section";
import { useId } from "react";

export const AuthConfigPanel = () => {
  const { settings, passwordPolicy } = useAuthUiConfig();
  const titleId = useId();

  const enabledMethods = [
    settings.email ? "Email" : null,
    settings.google ? "Google" : null,
    settings.passkeys ? "Passkeys" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const mfaStatus = settings.mfa.totpEnrollEnabled
    ? "TOTP enrollment enabled"
    : settings.mfa.totpVerifyEnabled
      ? "TOTP verify only (enrollment disabled in Supabase)"
      : "Off";

  return (
    <AuthSection aria-labelledby={titleId}>
      <AuthSectionHeader
        description="Synced from your Supabase project. These rules are enforced server-side."
        title="Sign-in configuration"
        titleId={titleId}
      />
      <AuthConfigList>
        <AuthConfigRow
          label="Allow new sign-ups"
          value={settings.disableSignup ? "Disabled" : "Enabled"}
        />
        <AuthConfigRow
          label="Confirm email"
          value={
            settings.mailerAutoconfirm
              ? "Disabled (auto-confirm)"
              : "Required before first sign-in"
          }
        />
        <AuthConfigRow
          label="Anonymous sign-ins"
          value={
            settings.anonymous
              ? "Enabled"
              : "Disabled — UI ready; enable in Supabase to show"
          }
        />
        <AuthConfigRow
          label="Phone sign-in"
          value={
            settings.phone
              ? "Enabled"
              : "Disabled — UI ready; enable phone provider in Supabase"
          }
        />
        <AuthConfigRow
          label="SAML SSO"
          value={
            settings.saml
              ? "Enabled"
              : "Disabled — UI ready; configure SAML in Supabase"
          }
        />
        <AuthConfigRow
          label="Manual identity linking"
          value={
            settings.security.manualLinkingEnabled ? "Enabled" : "Disabled"
          }
        />
        <AuthConfigRow
          label="Enabled methods"
          value={enabledMethods || "None"}
        />
        <AuthConfigRow
          label="Password policy"
          value={passwordRequirementsSummary(passwordPolicy)}
        />
        <AuthConfigRow
          label="Leaked password protection"
          value={
            passwordPolicy.blockLeakedPasswords ? "Enabled (HIBP)" : "Disabled"
          }
        />
        <AuthConfigRow
          label="Require current password to change"
          value={
            settings.security.requireCurrentPasswordOnChange
              ? "Enabled (app + GoTrue when API sync succeeds)"
              : "Disabled"
          }
        />
        <AuthConfigRow
          label="Secure password change (reauth)"
          value={
            settings.security.requireReauthenticationOnChange
              ? "Enabled (24h window or email code)"
              : "Disabled"
          }
        />
        <AuthConfigRow
          label="Magic link / OTP"
          value={`${settings.otp.length} digits, expires in ${Math.round(settings.otp.expSeconds / 60)} minutes`}
        />
        <AuthConfigRow
          label="OTP / email rate limits"
          value={
            settings.rateLimits.emailSentPerHour !== null
              ? `${settings.rateLimits.emailSentPerHour}/hr emails, ${settings.rateLimits.otpPerInterval ?? "—"}/interval OTP sends, ${settings.rateLimits.otpResendSeconds ?? 60}s resend window`
              : "Not loaded from project"
          }
        />
        <AuthConfigRow
          label="IP forwarding (rate limits)"
          value={
            settings.rateLimits.sbForwardedForEnabled ? "Enabled" : "Disabled"
          }
        />
        <AuthConfigRow
          label="Audit logs (Postgres)"
          value={
            settings.audit.postgresStorageEnabled
              ? "Writing to auth.audit_log_entries"
              : "Postgres storage disabled (dashboard logs only)"
          }
        />
        <AuthConfigRow
          label="Audit log IP capture"
          value={
            settings.rateLimits.sbForwardedForEnabled
              ? "Forwarded-for enabled for server-side Auth calls; browser sign-ins use session IP in activity table"
              : "Enable IP forwarding for accurate server-side rate limits"
          }
        />
        <AuthConfigRow label="Multi-factor auth" value={mfaStatus} />
        <AuthConfigRow
          label="Phone MFA"
          value={
            settings.mfa.phoneEnrollEnabled
              ? "Phone enrollment enabled"
              : settings.mfa.phoneVerifyEnabled
                ? "Phone verify only"
                : "Off — UI ready when phone MFA is enabled"
          }
        />
        <AuthConfigRow
          label="Passkey origins"
          value={
            settings.passkey.rpOrigins.length > 0
              ? settings.passkey.rpOrigins.join(", ")
              : "Not configured"
          }
        />
        <AuthConfigRow
          label="Passkey RP ID"
          value={settings.passkey.rpId ?? "Not configured"}
        />
        <AuthConfigRow
          label="CAPTCHA"
          value={
            settings.security.captchaEnabled
              ? (settings.security.captchaProvider ?? "Enabled")
              : "Disabled — UI ready; set NEXT_PUBLIC_CAPTCHA_SITE_KEY when enabled"
          }
        />
        <AuthConfigRow
          label="Auth hooks (hosted)"
          value="custom_access_token active — MFA/password verification hooks documented in auth.hosted.toml (Enterprise)"
        />
        <AuthConfigRow
          label="Site URL"
          value={settings.urls.siteUrl ?? "Not set"}
        />
        <AuthConfigRow
          label="Access token (JWT) lifetime"
          value={formatJwtLifetime(settings.sessions.jwtExpSeconds)}
        />
        <AuthConfigRow
          label="Refresh token rotation"
          value={
            settings.sessions.refreshTokenRotationEnabled
              ? "Enabled"
              : "Disabled"
          }
        />
        <AuthConfigRow
          label="JWT org claims (custom hook)"
          value="organization_id and organization_role in app_metadata when hook is enabled"
        />
      </AuthConfigList>
    </AuthSection>
  );
};
