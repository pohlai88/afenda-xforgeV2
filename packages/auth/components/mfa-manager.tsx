"use client";

import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldLabel,
  Input,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import { useCallback, useEffect, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";

type MfaFactor = {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: string;
};

export const MfaManager = () => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadFactors = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: listError } = await supabase.auth.mfa.listFactors();

    if (listError) {
      setError(listError.message);
      setFactors([]);
      setLoading(false);
      return;
    }

    setFactors([...(data?.totp ?? []), ...(data?.phone ?? [])]);
    setLoading(false);
  }, [supabase.auth.mfa]);

  useEffect(() => {
    void loadFactors();
  }, [loadFactors]);

  const startEnrollment = async () => {
    setEnrolling(true);
    setError(null);
    setMessage(null);
    setVerifyCode("");
    setQrCode(null);
    setFactorId(null);

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
      setError(challengeError.message);
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

    setMessage("Authenticator app added.");
    setFactorId(null);
    setQrCode(null);
    setVerifyCode("");
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

  if (!settings.mfa.totpEnrollEnabled && !settings.mfa.totpVerifyEnabled) {
    return null;
  }

  return (
    <section className={cn("flex flex-col", recipe("sectionGap"))}>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-text-primary">Multi-factor authentication</h2>
        <p className={recipe("captionText")}>
          Add an authenticator app for a second sign-in step.
        </p>
      </div>

      {!settings.mfa.totpEnrollEnabled ? (
        <Alert tone="critical">
          <AlertDescription>
            TOTP enrollment is disabled in Supabase. Verification is enabled, but
            new authenticator apps cannot be added until enrollment is turned on in
            the Supabase dashboard.
          </AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert tone="critical">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {message ? (
        <Alert tone="positive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <p className={recipe("captionText")}>Loading factors…</p>
      ) : factors.length === 0 ? (
        <p className={recipe("captionText")}>No MFA factors enrolled yet.</p>
      ) : (
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
                disabled={!settings.mfa.totpEnrollEnabled}
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
      )}

      {settings.mfa.totpEnrollEnabled && !factorId ? (
        <Button
          className="w-fit"
          disabled={enrolling}
          onClick={startEnrollment}
          type="button"
          variant="secondary"
        >
          {enrolling ? "Starting…" : "Add authenticator app"}
        </Button>
      ) : null}

      {factorId && qrCode ? (
        <form className={cn("flex flex-col", recipe("sectionGap"))} onSubmit={verifyEnrollment}>
          <div
            className="mx-auto rounded-[var(--xforge-radius-md)] border border-border-default bg-white p-3"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Supabase returns SVG QR markup
            dangerouslySetInnerHTML={{ __html: qrCode }}
          />
          <Field>
            <FieldLabel htmlFor="mfa-verify-code">Verification code</FieldLabel>
            <Input
              autoComplete="one-time-code"
              id="mfa-verify-code"
              inputMode="numeric"
              maxLength={settings.otp.length}
              onChange={(event) => setVerifyCode(event.target.value)}
              placeholder={`${settings.otp.length}-digit code`}
              required
              value={verifyCode}
            />
          </Field>
          <Button className="w-fit" disabled={enrolling} type="submit" variant="primary">
            {enrolling ? "Verifying…" : "Verify and enable"}
          </Button>
        </form>
      ) : null}
    </section>
  );
};
