"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import { formatJwtLifetime } from "../auth-ui-settings";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { passwordRequirementsSummary } from "./password-requirements";

const ConfigRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-0.5 border-border-default border-b py-3 last:border-b-0">
    <dt className={recipe("captionText")}>{label}</dt>
    <dd className={recipe("bodyMediumText")}>{value}</dd>
  </div>
);

export const AuthConfigPanel = () => {
  const { settings, passwordPolicy } = useAuthUiConfig();

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
    <section className={cn("flex flex-col", recipe("sectionGap"))}>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-text-primary">Sign-in configuration</h2>
        <p className={recipe("captionText")}>
          Synced from your Supabase project. These rules are enforced server-side.
        </p>
      </div>
      <dl className="rounded-[var(--xforge-radius-md)] border border-border-default px-4">
        <ConfigRow
          label="Allow new sign-ups"
          value={settings.disableSignup ? "Disabled" : "Enabled"}
        />
        <ConfigRow
          label="Confirm email"
          value={
            settings.mailerAutoconfirm
              ? "Disabled (auto-confirm)"
              : "Required before first sign-in"
          }
        />
        <ConfigRow
          label="Anonymous sign-ins"
          value={settings.anonymous ? "Enabled" : "Disabled"}
        />
        <ConfigRow
          label="Manual identity linking"
          value={settings.security.manualLinkingEnabled ? "Enabled" : "Disabled"}
        />
        <ConfigRow label="Enabled methods" value={enabledMethods || "None"} />
        <ConfigRow
          label="Password policy"
          value={passwordRequirementsSummary(passwordPolicy)}
        />
        <ConfigRow
          label="Leaked password protection"
          value={passwordPolicy.blockLeakedPasswords ? "Enabled (HIBP)" : "Disabled"}
        />
        <ConfigRow
          label="Require current password to change"
          value={
            settings.security.requireCurrentPasswordOnChange
              ? "Enabled (app + GoTrue when API sync succeeds)"
              : "Disabled"
          }
        />
        <ConfigRow
          label="Secure password change (reauth)"
          value={
            settings.security.requireReauthenticationOnChange
              ? "Enabled (24h window or email code)"
              : "Disabled"
          }
        />
        <ConfigRow
          label="Magic link / OTP"
          value={`${settings.otp.length} digits, expires in ${Math.round(settings.otp.expSeconds / 60)} minutes`}
        />
        <ConfigRow
          label="OTP / email rate limits"
          value={
            settings.rateLimits.emailSentPerHour !== null
              ? `${settings.rateLimits.emailSentPerHour}/hr emails, ${settings.rateLimits.otpPerInterval ?? "—"}/interval OTP sends, ${settings.rateLimits.otpResendSeconds ?? 60}s resend window`
              : "Not loaded from project"
          }
        />
        <ConfigRow
          label="IP forwarding (rate limits)"
          value={
            settings.rateLimits.sbForwardedForEnabled ? "Enabled" : "Disabled"
          }
        />
        <ConfigRow
          label="Audit logs (Postgres)"
          value={
            settings.audit.postgresStorageEnabled
              ? "Writing to auth.audit_log_entries"
              : "Postgres storage disabled (dashboard logs only)"
          }
        />
        <ConfigRow
          label="Audit log IP capture"
          value={
            settings.rateLimits.sbForwardedForEnabled
              ? "Forwarded-for enabled for server-side Auth calls; browser sign-ins use session IP in activity table"
              : "Enable IP forwarding for accurate server-side rate limits"
          }
        />
        <ConfigRow label="Multi-factor auth" value={mfaStatus} />
        <ConfigRow
          label="Passkey origins"
          value={
            settings.passkey.rpOrigins.length > 0
              ? settings.passkey.rpOrigins.join(", ")
              : "Not configured"
          }
        />
        <ConfigRow
          label="Passkey RP ID"
          value={settings.passkey.rpId ?? "Not configured"}
        />
        <ConfigRow
          label="CAPTCHA"
          value={
            settings.security.captchaEnabled
              ? settings.security.captchaProvider ?? "Enabled"
              : "Disabled — built-in Auth rate limits; optional free OSS: Altcha or mCaptcha"
          }
        />
        <ConfigRow
          label="Auth hooks (hosted)"
          value="custom_access_token only — MFA/password verification hooks not required"
        />
        <ConfigRow
          label="Site URL"
          value={settings.urls.siteUrl ?? "Not set"}
        />
        <ConfigRow
          label="Access token (JWT) lifetime"
          value={formatJwtLifetime(settings.sessions.jwtExpSeconds)}
        />
        <ConfigRow
          label="Refresh token rotation"
          value={
            settings.sessions.refreshTokenRotationEnabled ? "Enabled" : "Disabled"
          }
        />
        <ConfigRow
          label="JWT org claims (custom hook)"
          value="organization_id and organization_role in app_metadata when hook is enabled"
        />
      </dl>
    </section>
  );
};
