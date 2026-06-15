"use client";

import {
  Button,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { useState } from "react";
import { fromSupabaseError, isAuthFailure, parseAuthForm } from "../auth-result";
import { buildEmailConfirmRedirect } from "../email-redirect";
import { createClient } from "../client";
import { forgotPasswordSchema } from "../schemas";

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

    const validated = parseAuthForm(forgotPasswordSchema, { email });

    if (isAuthFailure(validated)) {
      setError(validated.error);
      setLoading(false);
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
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div
        className={cn("flex flex-col", recipe("sectionGap"))}
        role="status"
      >
        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-text-primary">Check your email</p>
          <p className={cn("text-text-secondary", recipe("captionText"))}>
            If an account exists for that address, you will receive a password
            reset link shortly.
          </p>
        </div>
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
            error ? `${emailErrorId} forgot-password-hint` : "forgot-password-hint"
          }
          aria-invalid={error ? true : undefined}
          autoComplete="email"
          id={emailFieldId}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
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
      <Button className="w-full" disabled={loading} type="submit" variant="primary">
        {loading ? "Sending…" : "Send reset link"}
      </Button>
      <p className={cn("text-center", recipe("captionText"))}>
        <Link
          className="underline underline-offset-4"
          href="/sign-in"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
};
