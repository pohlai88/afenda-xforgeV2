"use client";

import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldError,
  FieldLabel,
  Input,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  fromSupabaseError,
  parseAuthFormFields,
  type AuthFieldErrors,
} from "../auth-result";
import { PENDING_CONFIRMATION_EMAIL_KEY } from "../auth-ui-settings";
import { buildEmailConfirmRedirect } from "../email-redirect";
import { completeAuthNavigation } from "../client-navigation";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { createSignUpSchema } from "../schemas";
import {
  AlternativeAuthMethods,
  SignUpDisabledNotice,
} from "./alternative-auth-methods";
import { AuthLegalLine } from "./auth-legal-line";
import { PasswordField } from "./password-field";
import { PasswordSecurityTips } from "./password-security-tips";

const nameFieldId = "sign-up-name";
const emailFieldId = "sign-up-email";
const passwordFieldId = "sign-up-password";

const focusField = (field: keyof AuthFieldErrors) => {
  const id =
    field === "name"
      ? nameFieldId
      : field === "email"
        ? emailFieldId
        : passwordFieldId;
  document.getElementById(id)?.focus();
};

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
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

    const validated = parseAuthFormFields(signUpSchema, { email, password, name });

    if (!validated.ok) {
      setFieldErrors(validated.fieldErrors);
      setFormError(validated.formError ?? null);
      setLoading(false);
      const firstField = validated.fieldErrors.name
        ? "name"
        : validated.fieldErrors.email
          ? "email"
          : "password";
      focusField(firstField);
      return;
    }

    const emailRedirectTo = buildEmailConfirmRedirect("/");

    const { error: signUpError } = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        data: { name: validated.data.name },
        emailRedirectTo,
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

    router.push("/sign-up-success");
  };

  if (settings.disableSignup) {
    return (
      <div className={cn("flex flex-col", recipe("sectionGap"))}>
        <SignUpDisabledNotice />
        <p className={cn("text-center", recipe("captionText"))}>
          Already have an account?{" "}
          <Link className="underline underline-offset-4" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col", recipe("sectionGap"))}
      noValidate
      onSubmit={handleSignUp}
    >
      <AlternativeAuthMethods mode="sign-up" onError={setFormError} />
      {formError && Object.keys(fieldErrors).length === 0 ? (
        <Alert tone="critical">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
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
          <FieldError id={`${nameFieldId}-error`}>{fieldErrors.name}</FieldError>
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
          <FieldError id={`${emailFieldId}-error`}>{fieldErrors.email}</FieldError>
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
        <PasswordSecurityTips />
      </Field>
      <Button
        className="w-full"
        disabled={loading}
        type="submit"
        variant="primary"
      >
        {loading ? "Creating account…" : "Create account"}
      </Button>
      {!settings.mailerAutoconfirm ? (
        <p className={cn("text-center text-text-secondary", recipe("captionText"))}>
          We will email a verification link to confirm your account.
        </p>
      ) : null}
      <AuthLegalLine />
      <p className={cn("text-center", recipe("captionText"))}>
        Already have an account?{" "}
        <Link className="underline underline-offset-4" href="/sign-in">
          Sign in
        </Link>
      </p>
    </form>
  );
};
