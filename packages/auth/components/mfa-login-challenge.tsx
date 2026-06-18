"use client";

import {
  cn,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  recipe,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { completeAuthNavigation } from "../client-navigation";
import { useAuthUiConfig } from "../context/auth-ui-config";
import {
  listVerifiableTotpFactors,
  type VerifiableTotpFactor,
} from "../mfa-login";
import { AuthErrorAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { AuthSection, AuthSectionHeader } from "./auth-section";

interface MfaLoginChallengeProperties {
  nextHref?: string;
}

export const MfaLoginChallenge = ({
  nextHref = "/",
}: MfaLoginChallengeProperties) => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const titleId = useId();
  const otpFieldId = useId();
  const [factors, setFactors] = useState<VerifiableTotpFactor[]>([]);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFactors = useCallback(async () => {
    setLoading(true);
    setError(null);

    const verified = await listVerifiableTotpFactors(supabase);

    if (verified.length === 0) {
      setError(
        "No verified authenticator app is enrolled. Add one in Account security, then sign in again."
      );
      setFactors([]);
      setFactorId(null);
      setLoading(false);
      return;
    }

    setFactors(verified);
    setFactorId((current) => current ?? verified[0]?.id ?? null);
    setLoading(false);
  }, [supabase.auth.mfa, supabase]);

  useEffect(() => {
    loadFactors().catch(() => undefined);
  }, [loadFactors]);

  const selectedFactor = useMemo(
    () => factors.find((factor) => factor.id === factorId) ?? null,
    [factorId, factors]
  );
  const otpSlots = Array.from({ length: settings.otp.length }, (_, index) => ({
    id: `mfa-login-otp-slot-${index + 1}`,
    index,
  }));

  let factorSelectionContent: ReactNode = null;
  if (selectedFactor) {
    factorSelectionContent = (
      <p className={recipe("captionText")}>
        Using {selectedFactor.friendly_name ?? "Authenticator app"}.
      </p>
    );
  }
  if (factors.length > 1) {
    factorSelectionContent = (
      <Field>
        <FieldLabel htmlFor={`${titleId}-factor`}>Authenticator</FieldLabel>
        <Select onValueChange={setFactorId} value={factorId ?? undefined}>
          <SelectTrigger id={`${titleId}-factor`}>
            <SelectValue placeholder="Select authenticator" />
          </SelectTrigger>
          <SelectContent>
            {factors.map((factor) => (
              <SelectItem key={factor.id} value={factor.id}>
                {factor.friendly_name ?? "Authenticator app"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }
  if (loading) {
    factorSelectionContent = (
      <p className={recipe("captionText")}>Loading verification methods…</p>
    );
  }

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!factorId) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      const failure = fromSupabaseError(challengeError);
      setError(failure?.error ?? "Could not start MFA verification.");
      setSubmitting(false);
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
      setSubmitting(false);
      return;
    }

    completeAuthNavigation(nextHref);
  };

  return (
    <AuthSection aria-busy={loading || submitting} aria-labelledby={titleId}>
      <AuthSectionHeader
        description="Enter the code from your authenticator app to finish signing in."
        title="Verify your identity"
        titleId={titleId}
      />

      {error ? (
        <AuthErrorAlert
          message={error}
          onRetry={
            factors.length === 0
              ? () => {
                  loadFactors().catch(() => undefined);
                }
              : undefined
          }
        />
      ) : null}

      {factorSelectionContent}

      {factors.length > 0 ? (
        <form
          className={cn("flex flex-col", recipe("sectionGap"))}
          noValidate
          onSubmit={handleVerify}
        >
          <Field>
            <FieldLabel htmlFor={otpFieldId}>Verification code</FieldLabel>
            <InputOTP
              aria-describedby={`${otpFieldId}-hint`}
              id={otpFieldId}
              maxLength={settings.otp.length}
              onChange={setVerifyCode}
              value={verifyCode}
            >
              <InputOTPGroup>
                {otpSlots.map((slot) => (
                  <InputOTPSlot index={slot.index} key={slot.id} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldHint id={`${otpFieldId}-hint`}>
              Open your authenticator app and enter the current code.
            </FieldHint>
            {verifyCode.length > 0 &&
            verifyCode.length < settings.otp.length ? (
              <FieldError>Enter all {settings.otp.length} digits.</FieldError>
            ) : null}
          </Field>
          <AuthPendingButton
            className="w-full"
            disabled={verifyCode.length !== settings.otp.length}
            pending={submitting}
            pendingLabel="Verifying…"
            type="submit"
            variant="primary"
          >
            Continue
          </AuthPendingButton>
        </form>
      ) : null}
    </AuthSection>
  );
};
