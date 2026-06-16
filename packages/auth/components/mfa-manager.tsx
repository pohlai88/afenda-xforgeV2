"use client";

import {
  Button,
  cn,
  Field,
  FieldHint,
  FieldLabel,
  Input,
  recipe,
} from "@repo/design-system/design-system";
import { useCallback, useEffect, useId, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import {
  AuthConfigNotice,
  AuthErrorAlert,
  AuthSuccessAlert,
} from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import {
  AuthLoadingState,
  AuthSection,
  AuthSectionHeader,
} from "./auth-section";

interface MfaFactor {
  factor_type: string;
  friendly_name?: string;
  id: string;
  status: string;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Existing MFA enrollment state machine spans TOTP and phone factors.
export const MfaManager = () => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const titleId = useId();
  const verifyFieldId = useId();
  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enrollMode, setEnrollMode] = useState<"totp" | "phone" | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadFactors = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: listError } = await supabase.auth.mfa.listFactors();

    if (listError) {
      const failure = fromSupabaseError(listError);
      setError(failure?.error ?? "Could not load MFA factors.");
      setFactors([]);
      setLoading(false);
      return;
    }

    setFactors([...(data?.totp ?? []), ...(data?.phone ?? [])]);
    setLoading(false);
  }, [supabase.auth.mfa]);

  useEffect(() => {
    loadFactors().catch(() => undefined);
  }, [loadFactors]);

  const startEnrollment = async (mode: "totp" | "phone") => {
    setEnrolling(true);
    setError(null);
    setMessage(null);
    setVerifyCode("");
    setQrCode(null);
    setFactorId(null);
    setEnrollMode(mode);

    if (mode === "phone") {
      const trimmed = phoneNumber.trim();

      if (!trimmed) {
        setError(
          "Enter your phone number in E.164 format (e.g. +15551234567)."
        );
        setEnrolling(false);
        return;
      }

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "phone",
        friendlyName: "Phone",
        phone: trimmed,
      });

      const failure = fromSupabaseError(enrollError);

      if (failure) {
        setError(failure.error);
        setEnrolling(false);
        return;
      }

      setFactorId(data?.id ?? null);
      setEnrolling(false);
      return;
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator app",
    });

    const failure = fromSupabaseError(enrollError);

    if (failure) {
      setError(failure.error);
      setEnrolling(false);
      return;
    }

    setFactorId(data?.id ?? null);
    setQrCode(data?.totp?.qr_code ?? null);
    setEnrolling(false);
  };

  const verifyEnrollment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!factorId) {
      return;
    }

    setEnrolling(true);
    setError(null);

    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      const failure = fromSupabaseError(challengeError);
      setError(failure?.error ?? "Could not start MFA verification.");
      setEnrolling(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: verifyCode,
    });

    const failure = fromSupabaseError(verifyError);

    if (failure) {
      setError(failure.error);
      setEnrolling(false);
      return;
    }

    setMessage(
      enrollMode === "phone"
        ? "Phone factor added."
        : "Authenticator app added."
    );
    setFactorId(null);
    setQrCode(null);
    setVerifyCode("");
    setEnrollMode(null);
    setEnrolling(false);
    await loadFactors();
  };

  const removeFactor = async (id: string) => {
    setError(null);
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({
      factorId: id,
    });

    const failure = fromSupabaseError(unenrollError);

    if (failure) {
      setError(failure.error);
      return;
    }

    setMessage("Factor removed.");
    await loadFactors();
  };

  if (
    !(
      settings.mfa.totpEnrollEnabled ||
      settings.mfa.totpVerifyEnabled ||
      settings.mfa.phoneEnrollEnabled ||
      settings.mfa.phoneVerifyEnabled
    )
  ) {
    return null;
  }

  const showTotpActions =
    settings.mfa.totpEnrollEnabled || settings.mfa.totpVerifyEnabled;
  const showPhoneActions =
    settings.mfa.phoneEnrollEnabled || settings.mfa.phoneVerifyEnabled;
  const showTotpEnrollDisabledNotice =
    !settings.mfa.totpEnrollEnabled && showTotpActions;
  const showPhoneEnrollDisabledNotice =
    !settings.mfa.phoneEnrollEnabled && showPhoneActions;

  let factorsContent = (
    <ul className="flex flex-col gap-2">
      {factors.map((factor) => (
        <li
          className="flex items-center justify-between gap-3 rounded-[var(--xforge-radius-md)] border border-border-default px-3 py-2"
          key={factor.id}
        >
          <div>
            <p className={recipe("bodyMediumText")}>
              {factor.friendly_name ?? factor.factor_type}
            </p>
            <p className={recipe("captionText")}>{factor.status}</p>
          </div>
          <Button
            disabled={
              factor.factor_type === "totp"
                ? !settings.mfa.totpEnrollEnabled
                : !settings.mfa.phoneEnrollEnabled
            }
            onClick={() => removeFactor(factor.id)}
            size="sm"
            type="button"
            variant="quiet"
          >
            Remove
          </Button>
        </li>
      ))}
    </ul>
  );
  if (factors.length === 0) {
    factorsContent = (
      <p className={recipe("captionText")}>No MFA factors enrolled yet.</p>
    );
  }
  if (loading) {
    factorsContent = <AuthLoadingState label="Loading factors…" />;
  }

  return (
    <AuthSection aria-busy={loading} aria-labelledby={titleId}>
      <AuthSectionHeader
        description="Add an authenticator app or phone number for a second sign-in step."
        title="Multi-factor authentication"
        titleId={titleId}
      />

      {settings.mfa.totpEnrollEnabled ||
      settings.mfa.phoneEnrollEnabled ? null : (
        <AuthConfigNotice>
          MFA enrollment is disabled in Supabase. Verification may still be
          required for existing factors, but new methods cannot be added until
          enrollment is turned on in the Supabase dashboard.
        </AuthConfigNotice>
      )}

      {showTotpEnrollDisabledNotice ? (
        <AuthConfigNotice>
          TOTP enrollment is disabled in Supabase. Existing authenticator apps
          can still verify sign-in when verify is enabled.
        </AuthConfigNotice>
      ) : null}

      {showPhoneEnrollDisabledNotice ? (
        <AuthConfigNotice>
          Phone MFA enrollment is disabled in Supabase. Enable phone auth and
          SMS in the dashboard to add phone factors.
        </AuthConfigNotice>
      ) : null}

      {error && !loading ? (
        <AuthErrorAlert
          message={error}
          onRetry={
            factors.length === 0 && !enrolling && !factorId
              ? () => {
                  loadFactors().catch(() => undefined);
                }
              : undefined
          }
        />
      ) : null}
      {message ? <AuthSuccessAlert message={message} /> : null}

      {factorsContent}

      {settings.mfa.totpEnrollEnabled && !factorId && enrollMode !== "phone" ? (
        <AuthPendingButton
          className="w-fit"
          onClick={() => startEnrollment("totp")}
          pending={enrolling && enrollMode === "totp"}
          pendingLabel="Starting…"
          type="button"
          variant="secondary"
        >
          Add authenticator app
        </AuthPendingButton>
      ) : null}

      {settings.mfa.phoneEnrollEnabled && !factorId && enrollMode !== "totp" ? (
        <div className={cn("flex flex-col", recipe("sectionGap"))}>
          <Field>
            <FieldLabel htmlFor={`${titleId}-phone`}>Phone number</FieldLabel>
            <Input
              autoComplete="tel"
              id={`${titleId}-phone`}
              inputMode="tel"
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+15551234567"
              type="tel"
              value={phoneNumber}
            />
            <FieldHint>
              Use international format including country code.
            </FieldHint>
          </Field>
          <AuthPendingButton
            className="w-fit"
            onClick={() => startEnrollment("phone")}
            pending={enrolling && enrollMode === "phone"}
            pendingLabel="Sending code…"
            type="button"
            variant="secondary"
          >
            Add phone factor
          </AuthPendingButton>
        </div>
      ) : null}

      {factorId && (qrCode || enrollMode === "phone") ? (
        <form
          className={cn("flex flex-col", recipe("sectionGap"))}
          noValidate
          onSubmit={verifyEnrollment}
        >
          {qrCode ? (
            <div
              className="mx-auto rounded-[var(--xforge-radius-md)] border border-border-default bg-white p-3"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Supabase returns SVG QR markup
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
          ) : (
            <p className={recipe("captionText")}>
              Enter the SMS code sent to {phoneNumber.trim() || "your phone"}.
            </p>
          )}
          <Field>
            <FieldLabel htmlFor={verifyFieldId}>
              {enrollMode === "phone"
                ? "SMS verification code"
                : "Verification code"}
            </FieldLabel>
            <Input
              aria-describedby={`${verifyFieldId}-hint`}
              autoComplete="one-time-code"
              id={verifyFieldId}
              inputMode="numeric"
              maxLength={settings.otp.length}
              onChange={(event) => setVerifyCode(event.target.value)}
              placeholder={`${settings.otp.length}-digit code`}
              required
              value={verifyCode}
            />
            <FieldHint id={`${verifyFieldId}-hint`}>
              Enter the code from your authenticator app.
            </FieldHint>
          </Field>
          <AuthPendingButton
            className="w-fit"
            pending={enrolling}
            pendingLabel="Verifying…"
            type="submit"
            variant="primary"
          >
            Verify and enable
          </AuthPendingButton>
        </form>
      ) : null}
    </AuthSection>
  );
};
