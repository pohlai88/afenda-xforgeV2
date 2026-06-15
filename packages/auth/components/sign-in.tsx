"use client";

import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { isAuthApiError, isAuthWeakPasswordError } from "@supabase/supabase-js";
import { humanizeAuthError } from "../auth-form-messages";
import {
  fromSupabaseError,
  parseAuthFormFields,
  type AuthFieldErrors,
} from "../auth-result";
import { buildEmailConfirmRedirect } from "../email-redirect";
import { completeAuthNavigation } from "../client-navigation";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { createEmailOtpVerifySchema, createSignInSchema, forgotPasswordSchema } from "../schemas";
import {
  getPreferredSignInMethod,
  preferredSignInMethodLabel,
  setPreferredSignInMethod,
  type SignInMethod,
} from "../sign-in-preference";
import { AlternativeAuthMethods } from "./alternative-auth-methods";
import {
  DEVELOPER_SIGN_IN_CREDENTIALS,
  type DeveloperSignInCredentials,
  DeveloperSignInPanel,
} from "./developer-sign-in-panel";
import { PasswordField } from "./password-field";
import { passwordRequirementsSummary } from "./password-requirements";

const emailFieldId = "sign-in-email";
const passwordFieldId = "sign-in-password";
const otpFieldId = "sign-in-otp";
const formErrorId = "sign-in-error";

type SignInMode = "password" | "magic-link";

type SignInProperties = {
  initialError?: string | null;
};

const focusField = (field: keyof AuthFieldErrors) => {
  const id = field === "email" ? emailFieldId : passwordFieldId;
  document.getElementById(id)?.focus();
};

export const SignIn = ({ initialError = null }: SignInProperties) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<SignInMode>("magic-link");
  const [preferredMethod, setPreferredMethod] = useState<SignInMethod>("magic-link");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(initialError);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [weakPasswordBlocked, setWeakPasswordBlocked] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { settings, passwordPolicy } = useAuthUiConfig();
  const signInSchema = useMemo(() => createSignInSchema(), []);
  const emailOtpSchema = useMemo(
    () => createEmailOtpVerifySchema(settings.otp.length),
    [settings.otp.length]
  );
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const preferred = getPreferredSignInMethod();
    setPreferredMethod(preferred);

    if (preferred === "password") {
      setMode("password");
    } else {
      setMode("magic-link");
    }
  }, []);

  useEffect(() => {
    const queryError = searchParams.get("error");

    if (queryError) {
      setFormError(humanizeAuthError(decodeURIComponent(queryError)));
    }
  }, [searchParams]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    setEmail(DEVELOPER_SIGN_IN_CREDENTIALS.email);
    setPassword(DEVELOPER_SIGN_IN_CREDENTIALS.password);
    setMode("password");
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
      focusField(
        validated.fieldErrors.email
          ? "email"
          : validated.fieldErrors.password
            ? "password"
            : "email"
      );
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword(
      validated.data
    );

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
    completeAuthNavigation("/");
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

    const emailRedirectTo = buildEmailConfirmRedirect("/");

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: validated.data.email,
      options: {
        emailRedirectTo,
        shouldCreateUser: false,
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
    completeAuthNavigation("/");
  };

  const applyDeveloperCredentials = (credentials: DeveloperSignInCredentials) => {
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

  return (
    <form
      className={cn("flex flex-col", recipe("sectionGap"))}
      noValidate
      onSubmit={
        mode === "password"
          ? handlePasswordSignIn
          : magicLinkSent
            ? handleVerifyEmailOtp
            : handleMagicLinkSignIn
      }
    >
      <AlternativeAuthMethods mode="sign-in" onError={setFormError} />
      {preferredMethod !== "magic-link" ? (
        <p className={cn("text-center text-text-secondary", recipe("captionText"))}>
          You usually sign in with {preferredSignInMethodLabel(preferredMethod)}.
        </p>
      ) : null}
      {magicLinkSent ? (
        <Alert role="status" tone="positive">
          <AlertDescription>
            Check your email for a sign-in link or {settings.otp.length}-digit
            code. Both expire in about {Math.round(settings.otp.expSeconds / 60)}{" "}
            minutes.
          </AlertDescription>
        </Alert>
      ) : null}
      {formError &&
      !fieldErrors.email &&
      !fieldErrors.password &&
      !fieldErrors.token ? (
        <Alert id={formErrorId} tone="critical">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}
      <Field>
        <FieldLabel htmlFor={emailFieldId}>Email</FieldLabel>
        <Input
          aria-describedby={emailInvalid ? `${emailFieldId}-error` : undefined}
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
          <FieldError id={`${emailFieldId}-error`}>{fieldErrors.email}</FieldError>
        ) : null}
      </Field>
      {mode === "password" ? (
        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor={passwordFieldId}>Password</FieldLabel>
            <Link
              className={cn(
                "underline underline-offset-4",
                recipe("captionText")
              )}
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
              <Link
                className="underline underline-offset-4"
                href="/forgot-password"
              >
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
                setFieldErrors((current) => ({ ...current, token: undefined }));
              }
            }}
            value={otpCode}
          >
            <InputOTPGroup>
              {Array.from({ length: settings.otp.length }, (_, index) => (
                <InputOTPSlot index={index} key={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FieldHint id={`${otpFieldId}-hint`}>
            Enter the code from your email if you prefer not to use the link.
          </FieldHint>
          {fieldErrors.token ? (
            <FieldError id={`${otpFieldId}-error`}>{fieldErrors.token}</FieldError>
          ) : null}
        </Field>
      ) : null}
      <Button
        className="w-full"
        disabled={
          loading ||
          (mode === "magic-link" &&
            magicLinkSent &&
            otpCode.length < settings.otp.length)
        }
        type="submit"
        variant="primary"
      >
        {loading
          ? mode === "password"
            ? "Signing in…"
            : magicLinkSent
              ? "Verifying code…"
              : "Sending email…"
          : mode === "password"
            ? "Sign in"
            : magicLinkSent
              ? "Verify code"
              : "Send sign-in email"}
      </Button>
      {settings.email ? (
        <p className={cn("text-center", recipe("captionText"))}>
          <button
            className="underline underline-offset-4"
            onClick={toggleMode}
            type="button"
          >
            {mode === "password"
              ? "Use email link or code instead"
              : "Use password instead"}
          </button>
        </p>
      ) : null}
      <p className={cn("text-center", recipe("captionText"))}>
        No account?{" "}
        <Link className="underline underline-offset-4" href="/sign-up">
          Sign up
        </Link>
      </p>
      <DeveloperSignInPanel onApply={applyDeveloperCredentials} />
    </form>
  );
};
