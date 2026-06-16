"use client";

import {
  cn,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  recipe,
} from "@repo/design-system/design-system";
import { useId, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { completeAuthenticatedNavigation } from "../client-navigation";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { AuthCaptcha, useCaptchaOptions } from "./auth-captcha";
import { AuthDivider } from "./auth-divider";
import { AuthErrorAlert, AuthSuccessAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";

interface PhoneAuthPanelProperties {
  mode: "sign-in" | "sign-up";
  onError?: (message: string | null) => void;
}

export const PhoneAuthPanel = ({ mode, onError }: PhoneAuthPanelProperties) => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const phoneFieldId = useId();
  const otpFieldId = useId();
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaOptions = useCaptchaOptions(captchaToken);

  if (!settings.phone) {
    return null;
  }

  const clearErrors = () => {
    setFormError(null);
    setFieldError(null);
    onError?.(null);
  };

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    clearErrors();
    setCodeSent(false);
    setOtpCode("");

    const trimmed = phone.trim();

    if (!trimmed) {
      setFieldError(
        "Enter your phone number in E.164 format (e.g. +15551234567)."
      );
      setLoading(false);
      return;
    }

    if (settings.security.captchaEnabled && !captchaToken) {
      setFormError("Complete the CAPTCHA before continuing.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: trimmed,
      options: {
        ...captchaOptions,
        shouldCreateUser: mode === "sign-up",
      },
    });

    const failure = fromSupabaseError(error);

    if (failure) {
      setFormError(failure.error);
      onError?.(failure.error);
      setLoading(false);
      return;
    }

    setCodeSent(true);
    setLoading(false);
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    clearErrors();

    const trimmedCode = otpCode.trim();

    if (trimmedCode.length !== settings.otp.length) {
      setFieldError(
        `Enter the ${settings.otp.length}-digit code from your SMS.`
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token: trimmedCode,
      type: "sms",
    });

    const failure = fromSupabaseError(error);

    if (failure) {
      setFormError(failure.error);
      setFieldError(failure.error);
      onError?.(failure.error);
      setLoading(false);
      return;
    }

    await completeAuthenticatedNavigation("/");
  };

  return (
    <div className={cn("flex flex-col", recipe("sectionGap"))}>
      <AuthDivider
        label={
          mode === "sign-up" ? "Or sign up with phone" : "Or sign in with phone"
        }
      />
      {codeSent ? (
        <AuthSuccessAlert
          message={`Enter the ${settings.otp.length}-digit code sent to your phone.`}
        />
      ) : null}
      {formError ? <AuthErrorAlert message={formError} /> : null}
      <form
        className={cn("flex flex-col", recipe("sectionGap"))}
        noValidate
        onSubmit={codeSent ? handleVerifyCode : handleSendCode}
      >
        <Field>
          <FieldLabel htmlFor={phoneFieldId}>Phone number</FieldLabel>
          <Input
            autoComplete="tel"
            id={phoneFieldId}
            inputMode="tel"
            onChange={(event) => {
              setPhone(event.target.value);
              setFieldError(null);
            }}
            placeholder="+15551234567"
            required
            type="tel"
            value={phone}
          />
          <FieldHint>
            Use international format including country code.
          </FieldHint>
          {fieldError && !codeSent ? (
            <FieldError>{fieldError}</FieldError>
          ) : null}
        </Field>
        {codeSent ? (
          <Field>
            <FieldLabel htmlFor={otpFieldId}>SMS code</FieldLabel>
            <InputOTP
              id={otpFieldId}
              maxLength={settings.otp.length}
              onChange={(value) => {
                setOtpCode(value);
                setFieldError(null);
              }}
              value={otpCode}
            >
              <InputOTPGroup>
                {Array.from({ length: settings.otp.length }, (_, index) => (
                  <InputOTPSlot index={index} key={`phone-otp-${index}`} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {fieldError ? <FieldError>{fieldError}</FieldError> : null}
          </Field>
        ) : (
          <AuthCaptcha onTokenChange={setCaptchaToken} />
        )}
        <AuthPendingButton
          className="w-full"
          pending={loading}
          pendingLabel={codeSent ? "Verifying…" : "Sending code…"}
          type="submit"
          variant="secondary"
        >
          {codeSent ? "Verify and continue" : "Send SMS code"}
        </AuthPendingButton>
      </form>
    </div>
  );
};
