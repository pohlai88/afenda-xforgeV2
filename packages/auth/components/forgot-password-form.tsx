"use client";

import {
  Button,
  cn,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  recipe,
} from "@repo/design-system";
import Link from "next/link";
import { useState } from "react";
import { fromSupabaseError, parseAuthFormFields } from "../auth-result";
import { createClient } from "../client";
import { buildEmailConfirmRedirect } from "../redirects";
import { forgotPasswordSchema } from "../schemas";
import { AuthSuccessAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { authLinkClass } from "./auth-section";

const emailFieldId = "forgot-password-email";
const emailErrorId = "forgot-password-email-error";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const validated = parseAuthFormFields(forgotPasswordSchema, { email });

    if (!validated.ok) {
      setError(validated.fieldErrors.email ?? validated.formError ?? null);
      setLoading(false);
      document.getElementById(emailFieldId)?.focus();
      return;
    }

    const redirectTo = buildEmailConfirmRedirect("/update-password");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      validated.data.email,
      { redirectTo }
    );

    const failure = fromSupabaseError(resetError);

    if (failure) {
      setError(failure.error);
      setLoading(false);
      document.getElementById(emailFieldId)?.focus();
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className={cn("flex flex-col", recipe("sectionGap"))}>
        <AuthSuccessAlert
          message="If an account exists for that address, you will receive a password reset link shortly."
          title="Check your email"
        />
        <Button asChild className="w-full" variant="primary">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col", recipe("sectionGap"))}
      noValidate
      onSubmit={handleSubmit}
    >
      <Field>
        <FieldLabel htmlFor={emailFieldId}>Email</FieldLabel>
        <Input
          aria-describedby={
            error
              ? `${emailErrorId} forgot-password-hint`
              : "forgot-password-hint"
          }
          aria-invalid={error ? true : undefined}
          autoComplete="email"
          id={emailFieldId}
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        <FieldHint id="forgot-password-hint">
          We will email you a reset link.
        </FieldHint>
        {error ? <FieldError id={emailErrorId}>{error}</FieldError> : null}
      </Field>
      <AuthPendingButton
        className="w-full"
        pending={loading}
        pendingLabel="Sending…"
        type="submit"
        variant="primary"
      >
        Send reset link
      </AuthPendingButton>
      <p className={cn("text-center", recipe("captionText"))}>
        <Link className={authLinkClass} href="/sign-in">
          Back to sign in
        </Link>
      </p>
    </form>
  );
};
