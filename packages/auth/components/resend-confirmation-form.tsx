"use client";

import {
  cn,
  Field,
  FieldError,
  FieldHint,
  FieldLabel,
  Input,
  recipe,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { useState } from "react";
import { fromSupabaseError, parseAuthFormFields } from "../auth-result";
import { PENDING_CONFIRMATION_EMAIL_KEY } from "../auth-ui-settings";
import { createClient } from "../client";
import { buildEmailConfirmRedirect } from "../redirects";
import { resendConfirmationSchema } from "../schemas";
import { AuthSuccessAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { authLinkClass } from "./auth-section";

const emailFieldId = "resend-confirmation-email";
const emailErrorId = "resend-confirmation-email-error";
const emailHintId = "resend-confirmation-email-hint";

interface ResendConfirmationFormProperties {
  readonly initialEmail?: string;
}

const readStoredEmail = (propEmail: string) => {
  if (propEmail) {
    return propEmail;
  }

  if (typeof sessionStorage === "undefined") {
    return "";
  }

  return sessionStorage.getItem(PENDING_CONFIRMATION_EMAIL_KEY) ?? "";
};

export const ResendConfirmationForm = ({
  initialEmail = "",
}: ResendConfirmationFormProperties) => {
  const [email, setEmail] = useState(() => readStoredEmail(initialEmail));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleResend = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const validated = parseAuthFormFields(resendConfirmationSchema, { email });

    if (!validated.ok) {
      setError(validated.fieldErrors.email ?? validated.formError ?? null);
      setLoading(false);
      document.getElementById(emailFieldId)?.focus();
      return;
    }

    const emailRedirectTo = buildEmailConfirmRedirect("/");

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: validated.data.email,
      options: { emailRedirectTo },
    });

    const failure = fromSupabaseError(resendError);

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
      <AuthSuccessAlert
        message="If an account exists for that address, a new confirmation link is on its way."
        title="Email sent"
      />
    );
  }

  return (
    <form
      className={cn("flex flex-col", recipe("sectionGap"))}
      noValidate
      onSubmit={handleResend}
    >
      <Field>
        <FieldLabel htmlFor={emailFieldId}>Email</FieldLabel>
        <Input
          aria-describedby={
            error ? `${emailErrorId} ${emailHintId}` : emailHintId
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
        <FieldHint id={emailHintId}>
          Enter the address you used to sign up.
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
        Resend confirmation email
      </AuthPendingButton>
      <p className={cn("text-center", recipe("captionText"))}>
        <Link className={authLinkClass} href="/sign-in">
          Back to sign in
        </Link>
      </p>
    </form>
  );
};
