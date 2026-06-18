"use client";

import {
  cn,
  Field,
  FieldError,
  FieldLabel,
  Input,
  recipe,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import {
  type AuthFieldErrors,
  fromSupabaseError,
  parseAuthFormFields,
} from "../auth-result";
import { PENDING_CONFIRMATION_EMAIL_KEY } from "../auth-ui-settings";
import { createClient } from "../client";
import { completeAuthNavigation } from "../client-navigation";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { buildEmailConfirmRedirect } from "../redirects";
import { createSignUpSchema } from "../schemas";
import {
  AlternativeAuthMethods,
  SignUpDisabledNotice,
} from "./alternative-auth-methods";
import { AnonymousSignInButton } from "./anonymous-sign-in-button";
import { AuthCaptcha, useCaptchaOptions } from "./auth-captcha";
import { AuthErrorAlert } from "./auth-feedback";
import { AuthLegalLine } from "./auth-legal-line";
import { AuthPendingButton } from "./auth-pending-button";
import { authLinkClass } from "./auth-section";
import { PasswordField } from "./password-field";
import { PhoneAuthPanel } from "./phone-auth-panel";
import { SsoSignInPanel } from "./sso-sign-in-panel";

const nameFieldId = "sign-up-name";
const emailFieldId = "sign-up-email";
const passwordFieldId = "sign-up-password";

const focusField = (field: keyof AuthFieldErrors) => {
  let id = passwordFieldId;
  if (field === "email") {
    id = emailFieldId;
  }
  if (field === "name") {
    id = nameFieldId;
  }
  document.getElementById(id)?.focus();
};

const getFirstSignUpErrorField = (
  errors: AuthFieldErrors
): keyof AuthFieldErrors => {
  if (errors.name) {
    return "name";
  }

  if (errors.email) {
    return "email";
  }

  return "password";
};

export const SignUp = () => {
  const formErrorId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaOptions = useCaptchaOptions(captchaToken);
  const router = useRouter();
  const supabase = createClient();
  const { settings, passwordPolicy } = useAuthUiConfig();
  const signUpSchema = useMemo(
    () => createSignUpSchema(passwordPolicy),
    [passwordPolicy]
  );

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (settings.disableSignup) {
      setFormError("New account registration is currently closed.");
      return;
    }

    setLoading(true);
    setFormError(null);
    setFieldErrors({});

    const validated = parseAuthFormFields(signUpSchema, {
      email,
      password,
      name,
    });

    if (!validated.ok) {
      setFieldErrors(validated.fieldErrors);
      setFormError(validated.formError ?? null);
      setLoading(false);
      focusField(getFirstSignUpErrorField(validated.fieldErrors));
      return;
    }

    if (settings.security.captchaEnabled && !captchaToken) {
      setFormError("Complete the CAPTCHA before creating an account.");
      setLoading(false);
      return;
    }

    const emailRedirectTo = buildEmailConfirmRedirect("/");

    const { error: signUpError } = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        data: { name: validated.data.name },
        emailRedirectTo,
        ...captchaOptions,
      },
    });

    const failure = fromSupabaseError(signUpError);

    if (failure) {
      setFormError(failure.error);
      setFieldErrors({ email: failure.error });
      setLoading(false);
      focusField("email");
      return;
    }

    sessionStorage.setItem(
      PENDING_CONFIRMATION_EMAIL_KEY,
      validated.data.email
    );

    if (settings.mailerAutoconfirm) {
      completeAuthNavigation("/");
      return;
    }

    router.push(
      `/sign-up-success?email=${encodeURIComponent(validated.data.email)}`
    );
  };

  if (settings.disableSignup) {
    return (
      <div className={cn("flex flex-col", recipe("sectionGap"))}>
        <SignUpDisabledNotice />
        <p className={cn("text-center", recipe("captionText"))}>
          Already have an account?{" "}
          <Link className={authLinkClass} href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", recipe("sectionGap"))}>
      <AlternativeAuthMethods mode="sign-up" onError={setFormError} />
      <form
        className={cn("flex flex-col", recipe("sectionGap"))}
        method="post"
        noValidate
        onSubmit={handleSignUp}
      >
        {formError && Object.keys(fieldErrors).length === 0 ? (
          <AuthErrorAlert id={formErrorId} message={formError} />
        ) : null}
        <Field>
          <FieldLabel htmlFor={nameFieldId}>Name</FieldLabel>
          <Input
            aria-describedby={
              fieldErrors.name ? `${nameFieldId}-error` : undefined
            }
            aria-invalid={fieldErrors.name ? true : undefined}
            autoComplete="name"
            id={nameFieldId}
            name="name"
            onChange={(event) => {
              setName(event.target.value);
              if (fieldErrors.name) {
                setFieldErrors((current) => ({ ...current, name: undefined }));
              }
            }}
            placeholder="Your name"
            required
            type="text"
            value={name}
          />
          {fieldErrors.name ? (
            <FieldError id={`${nameFieldId}-error`}>
              {fieldErrors.name}
            </FieldError>
          ) : null}
        </Field>
        <Field>
          <FieldLabel htmlFor={emailFieldId}>Email</FieldLabel>
          <Input
            aria-describedby={
              fieldErrors.email ? `${emailFieldId}-error` : undefined
            }
            aria-invalid={fieldErrors.email ? true : undefined}
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
        <Field>
          <PasswordField
            autoComplete="new-password"
            describedBy={
              fieldErrors.password ? `${passwordFieldId}-error` : undefined
            }
            id={passwordFieldId}
            invalid={Boolean(fieldErrors.password)}
            label="Password"
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
            policy={passwordPolicy}
            showRequirements
            value={password}
          />
          {fieldErrors.password ? (
            <FieldError id={`${passwordFieldId}-error`}>
              {fieldErrors.password}
            </FieldError>
          ) : null}
        </Field>
        {settings.security.captchaEnabled ? (
          <AuthCaptcha onTokenChange={setCaptchaToken} />
        ) : null}
        <AuthPendingButton
          className="w-full"
          pending={loading}
          pendingLabel="Creating account…"
          type="submit"
          variant="primary"
        >
          Create account
        </AuthPendingButton>
        {settings.mailerAutoconfirm ? null : (
          <p
            className={cn(
              "text-center text-text-secondary",
              recipe("captionText")
            )}
          >
            We will email a verification link to confirm your account.
          </p>
        )}
        <AuthLegalLine />
      </form>
      <p className={cn("text-center", recipe("captionText"))}>
        Already have an account?{" "}
        <Link className={authLinkClass} href="/sign-in">
          Sign in
        </Link>
      </p>
      <SsoSignInPanel onError={setFormError} />
      <PhoneAuthPanel mode="sign-up" onError={setFormError} />
      <AnonymousSignInButton onError={setFormError} />
    </div>
  );
};
