"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Field,
  FieldError,
  FieldLabel,
  Input,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { PENDING_CONFIRMATION_EMAIL_KEY } from "../auth-ui-settings";
import { buildEmailConfirmRedirect } from "../email-redirect";
import { createClient } from "../client";

type ResendConfirmationFormProperties = {
  initialEmail?: string;
};

export const ResendConfirmationForm = ({
  initialEmail = "",
}: ResendConfirmationFormProperties) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (initialEmail) {
      return;
    }

    const storedEmail = sessionStorage.getItem(PENDING_CONFIRMATION_EMAIL_KEY);

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [initialEmail]);

  const handleResend = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter the email address you used to sign up.");
      setLoading(false);
      document.getElementById("resend-confirmation-email")?.focus();
      return;
    }

    const emailRedirectTo = buildEmailConfirmRedirect("/");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: trimmedEmail,
      options: { emailRedirectTo },
    });

    const failure = fromSupabaseError(resendError);

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
      <Alert role="status" tone="positive">
        <AlertTitle>Email sent</AlertTitle>
        <AlertDescription className={recipe("captionText")}>
          If an account exists for that address, a new confirmation link is on
          its way.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      className={cn("flex flex-col", recipe("sectionGap"))}
      noValidate
      onSubmit={handleResend}
    >
      <Field>
        <FieldLabel htmlFor="resend-confirmation-email">Email</FieldLabel>
        <Input
          aria-describedby={
            error ? "resend-confirmation-email-error" : undefined
          }
          aria-invalid={error ? true : undefined}
          autoComplete="email"
          id="resend-confirmation-email"
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
        {error ? (
          <FieldError id="resend-confirmation-email-error">{error}</FieldError>
        ) : null}
      </Field>
      <Button
        className="w-full"
        disabled={loading}
        type="submit"
        variant="secondary"
      >
        {loading ? "Sending…" : "Resend confirmation email"}
      </Button>
      <p className={cn("text-center", recipe("captionText"))}>
        <Link className="underline underline-offset-4" href="/sign-in">
          Back to sign in
        </Link>
      </p>
    </form>
  );
};
