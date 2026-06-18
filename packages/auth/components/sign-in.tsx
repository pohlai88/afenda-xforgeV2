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
import { isAuthApiError, isAuthWeakPasswordError } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type AuthFieldErrors,
  fromSupabaseError,
  parseAuthFormFields,
} from "../auth-result";
import { createClient } from "../client";
import { completeAuthenticatedNavigation } from "../client-navigation";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { buildEmailConfirmRedirect } from "../redirects";
import {
  createEmailOtpVerifySchema,
  createSignInSchema,
  forgotPasswordSchema,
} from "../schemas";
import {
  getPreferredSignInMethod,
  preferredSignInMethodLabel,
  type SignInMethod,
  setPreferredSignInMethod,
} from "../sign-in-preference";
import { AlternativeAuthMethods } from "./alternative-auth-methods";
import { AnonymousSignInButton } from "./anonymous-sign-in-button";
import { AuthCaptcha, useCaptchaOptions } from "./auth-captcha";
import { AuthErrorAlert, AuthSuccessAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { authLinkClass } from "./auth-section";
import {
  DEVELOPER_SIGN_IN_CREDENTIALS,
  type DeveloperSignInCredentials,
  DeveloperSignInPanel,
} from "./developer-sign-in-panel";
import { PasswordField } from "./password-field";
import { passwordRequirementsSummary } from "./password-requirements";
import { PhoneAuthPanel } from "./phone-auth-panel";
import { SsoSignInPanel } from "./sso-sign-in-panel";

const emailFieldId = "sign-in-email";
const passwordFieldId = "sign-in-password";
const otpFieldId = "sign-in-otp";
const formErrorId = "sign-in-error";
const signInSchema = createSignInSchema();

type SignInMode = "password" | "magic-link";
const initialSignInMode: SignInMode =
  process.env.NODE_ENV === "development" ? "password" : "magic-link";

interface SignInProperties {
  initialError?: string | null;
}

const focusField = (field: keyof AuthFieldErrors) => {
  const id = field === "email" ? emailFieldId : passwordFieldId;
  document.getElementById(id)?.focus();
};

const getFirstSignInErrorField = (
  errors: AuthFieldErrors
): keyof AuthFieldErrors => {
  if (errors.email) {
    return "email";
  }

  if (errors.password) {
    return "password";
  }

  return "email";
};

const getSubmitLabel = (mode: SignInMode, magicLinkSent: boolean): string => {
  if (mode === "password") {
    return "Sign in";
  }

  return magicLinkSent ? "Verify code" : "Send sign-in email";
};

const getSubmitPendingLabel = (
  mode: SignInMode,
  magicLinkSent: boolean
): string => {
  if (mode === "password") {
    return "Signing in…";
  }

  return magicLinkSent ? "Verifying code…" : "Sending email…";
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Existing sign-in state machine covers password, magic link, OTP, CAPTCHA, and developer credentials.
export const SignIn = ({ initialError = null }: SignInProperties) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<SignInMode>(initialSignInMode);
  const [preferredMethod, setPreferredMethod] =
    useState<SignInMethod>(initialSignInMode);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(initialError);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [weakPasswordBlocked, setWeakPasswordBlocked] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaOptions = useCaptchaOptions(captchaToken);
  const supabase = createClient();
  const { settings, passwordPolicy } = useAuthUiConfig();
  const emailOtpSchema = useMemo(
    () => createEmailOtpVerifySchema(settings.otp.length),
    [settings.otp.length]
  );
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const preferred = getPreferredSignInMethod();
    setPreferredMethod(preferred);

    if (process.env.NODE_ENV === "development") {
      setEmail(DEVELOPER_SIGN_IN_CREDENTIALS.email);
      setPassword(DEVELOPER_SIGN_IN_CREDENTIALS.password);
      setMode("password");
      return;
    }

    setMode(preferred === "password" ? "password" : "magic-link");
  }, []);

  const clearErrors = () => {
    setFormError(null);
    setFieldErrors({});
    setWeakPasswordBlocked(false);
  };

  const handlePasswordSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    clearErrors();
    setMagicLinkSent(false);
    setOtpCode("");

    const validated = parseAuthFormFields(signInSchema, { email, password });

    if (!validated.ok) {
      setFieldErrors(validated.fieldErrors);
      setFormError(validated.formError ?? null);
      setLoading(false);
      focusField(getFirstSignInErrorField(validated.fieldErrors));
      return;
    }

    if (settings.security.captchaEnabled && !captchaToken) {
      setFormError("Complete the CAPTCHA before signing in.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      ...validated.data,
      options: captchaOptions,
    });

    const failure = fromSupabaseError(signInError);

    if (failure) {
      const isWeakPassword =
        (signInError && isAuthWeakPasswordError(signInError)) ||
        (signInError &&
          isAuthApiError(signInError) &&
          signInError.code === "weak_password");

      if (isWeakPassword) {
        setWeakPasswordBlocked(true);
      }

      setFormError(failure.error);
      setFieldErrors({ password: failure.error });
      setLoading(false);
      focusField("password");
      return;
    }

    setPreferredSignInMethod("password");
    await completeAuthenticatedNavigation("/");
  };

  const handleMagicLinkSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    clearErrors();
    setMagicLinkSent(false);
    setOtpCode("");

    const validated = parseAuthFormFields(forgotPasswordSchema, { email });

    if (!validated.ok) {
      setFieldErrors(validated.fieldErrors);
      setFormError(validated.formError ?? null);
      setLoading(false);
      focusField("email");
      return;
    }

    if (settings.security.captchaEnabled && !captchaToken) {
      setFormError("Complete the CAPTCHA before continuing.");
      setLoading(false);
      focusField("email");
      return;
    }

    const emailRedirectTo = buildEmailConfirmRedirect("/");

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: validated.data.email,
      options: {
        emailRedirectTo,
        shouldCreateUser: false,
        ...captchaOptions,
      },
    });

    const failure = fromSupabaseError(otpError);

    if (failure) {
      setFormError(failure.error);
      setFieldErrors({ email: failure.error });
      setLoading(false);
      focusField("email");
      return;
    }

    setMagicLinkSent(true);
    setPreferredSignInMethod("magic-link");
    setLoading(false);
  };

  const handleVerifyEmailOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    clearErrors();

    const validated = parseAuthFormFields(emailOtpSchema, {
      email,
      token: otpCode,
    });

    if (!validated.ok) {
      setFieldErrors(validated.fieldErrors);
      setFormError(validated.formError ?? null);
      setLoading(false);
      if (validated.fieldErrors.token) {
        document.getElementById(otpFieldId)?.focus();
      } else {
        focusField("email");
      }
      return;
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: validated.data.email,
      token: validated.data.token,
      type: "email",
    });

    const failure = fromSupabaseError(verifyError);

    if (failure) {
      setFormError(failure.error);
      setFieldErrors({ token: failure.error });
      setLoading(false);
      document.getElementById(otpFieldId)?.focus();
      return;
    }

    setPreferredSignInMethod("magic-link");
    await completeAuthenticatedNavigation("/");
  };

  const applyDeveloperCredentials = (
    credentials: DeveloperSignInCredentials
  ) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
    clearErrors();
    setMode("password");
    emailInputRef.current?.focus();
  };

  const toggleMode = () => {
    setMode((current) => (current === "password" ? "magic-link" : "password"));
    clearErrors();
    setMagicLinkSent(false);
    setOtpCode("");
  };

  const emailInvalid = Boolean(fieldErrors.email);
  const passwordInvalid = Boolean(fieldErrors.password);
  const otpInvalid = Boolean(fieldErrors.token);

  const submitLabel = getSubmitLabel(mode, magicLinkSent);
  const submitPendingLabel = getSubmitPendingLabel(mode, magicLinkSent);
  let submitHandler = handleMagicLinkSignIn;
  if (magicLinkSent) {
    submitHandler = handleVerifyEmailOtp;
  }
  if (mode === "password") {
    submitHandler = handlePasswordSignIn;
  }
  const otpSlots = Array.from({ length: settings.otp.length }, (_, index) => ({
    id: `sign-in-otp-slot-${index + 1}`,
    index,
  }));

  return (
    <div className={cn("flex flex-col", recipe("sectionGap"))}>
      <AlternativeAuthMethods mode="sign-in" onError={setFormError} />
      {preferredMethod !== "magic-link" ? (
        <p
          className={cn(
            "text-center text-text-secondary",
            recipe("captionText")
          )}
        >
          You usually sign in with {preferredSignInMethodLabel(preferredMethod)}
          .
        </p>
      ) : null}
      <form
        className={cn("flex flex-col", recipe("sectionGap"))}
        method="post"
        noValidate
        onSubmit={submitHandler}
      >
        {magicLinkSent ? (
          <AuthSuccessAlert
            message={`Check your email for a sign-in link or ${settings.otp.length}-digit code. Both expire in about ${Math.round(settings.otp.expSeconds / 60)} minutes.`}
          />
        ) : null}
        {formError &&
        !fieldErrors.email &&
        !fieldErrors.password &&
        !fieldErrors.token ? (
          <AuthErrorAlert id={formErrorId} message={formError} />
        ) : null}
        <Field>
          <FieldLabel htmlFor={emailFieldId}>Email</FieldLabel>
          <Input
            aria-describedby={
              emailInvalid ? `${emailFieldId}-error` : undefined
            }
            aria-invalid={emailInvalid || undefined}
            autoComplete="email"
            id={emailFieldId}
            name="email"
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }
            }}
            placeholder="you@example.com"
            ref={emailInputRef}
            required
            type="email"
            value={email}
          />
          {fieldErrors.email ? (
            <FieldError id={`${emailFieldId}-error`}>
              {fieldErrors.email}
            </FieldError>
          ) : null}
        </Field>
        {mode === "password" ? (
          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor={passwordFieldId}>Password</FieldLabel>
              <Link
                className={cn(authLinkClass, recipe("captionText"))}
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordField
              autoComplete="current-password"
              describedBy={
                passwordInvalid ? `${passwordFieldId}-error` : undefined
              }
              id={passwordFieldId}
              invalid={passwordInvalid}
              label=""
              name="password"
              onChange={(value) => {
                setPassword(value);
                if (fieldErrors.password) {
                  setFieldErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                }
              }}
              value={password}
            />
            {fieldErrors.password ? (
              <FieldError id={`${passwordFieldId}-error`}>
                {fieldErrors.password}
              </FieldError>
            ) : null}
            {weakPasswordBlocked ? (
              <FieldHint id={`${passwordFieldId}-weak-hint`}>
                Your password no longer meets current security requirements (
                {passwordRequirementsSummary(passwordPolicy)}).{" "}
                <Link className={authLinkClass} href="/forgot-password">
                  Reset your password
                </Link>{" "}
                to sign in again.
              </FieldHint>
            ) : null}
          </Field>
        ) : null}
        {mode === "magic-link" && magicLinkSent ? (
          <Field>
            <FieldLabel htmlFor={otpFieldId}>Email code</FieldLabel>
            <InputOTP
              aria-describedby={
                otpInvalid ? `${otpFieldId}-error` : `${otpFieldId}-hint`
              }
              aria-invalid={otpInvalid || undefined}
              id={otpFieldId}
              maxLength={settings.otp.length}
              onChange={(value) => {
                setOtpCode(value);
                if (fieldErrors.token) {
                  setFieldErrors((current) => ({
                    ...current,
                    token: undefined,
                  }));
                }
              }}
              value={otpCode}
            >
              <InputOTPGroup>
                {otpSlots.map((slot) => (
                  <InputOTPSlot index={slot.index} key={slot.id} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldHint id={`${otpFieldId}-hint`}>
              Enter the code from your email if you prefer not to use the link.
            </FieldHint>
            {fieldErrors.token ? (
              <FieldError id={`${otpFieldId}-error`}>
                {fieldErrors.token}
              </FieldError>
            ) : null}
          </Field>
        ) : null}
        {settings.security.captchaEnabled ? (
          <AuthCaptcha onTokenChange={setCaptchaToken} />
        ) : null}
        <AuthPendingButton
          className="w-full"
          pending={loading}
          pendingLabel={submitPendingLabel}
          type="submit"
          variant="primary"
        >
          {submitLabel}
        </AuthPendingButton>
        {settings.email ? (
          <p className={cn("text-center", recipe("captionText"))}>
            <button
              className={authLinkClass}
              onClick={toggleMode}
              type="button"
            >
              {mode === "password"
                ? "Use email link or code instead"
                : "Use password instead"}
            </button>
          </p>
        ) : null}
      </form>
      <p className={cn("text-center", recipe("captionText"))}>
        No account?{" "}
        <Link className={authLinkClass} href="/sign-up">
          Sign up
        </Link>
      </p>
      <DeveloperSignInPanel onApply={applyDeveloperCredentials} />
      <SsoSignInPanel onError={setFormError} />
      <PhoneAuthPanel mode="sign-in" onError={setFormError} />
      <AnonymousSignInButton onError={setFormError} />
    </div>
  );
};
