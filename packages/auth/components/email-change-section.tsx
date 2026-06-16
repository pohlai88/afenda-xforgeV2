"use client";

import {
  cn,
  Field,
  FieldHint,
  FieldLabel,
  Input,
  recipe,
} from "@repo/design-system/design-system";
import { useEffect, useId, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { AuthErrorAlert, AuthSuccessAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { AuthSection, AuthSectionHeader } from "./auth-section";

export const EmailChangeSection = () => {
  const supabase = createClient();
  const { settings } = useAuthUiConfig();
  const titleId = useId();
  const emailFieldId = useId();
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const { data, error: userError } = await supabase.auth.getUser();
      const failure = fromSupabaseError(userError);

      if (failure) {
        setError(failure.error);
        setCurrentEmail(null);
        setLoading(false);
        return;
      }

      setCurrentEmail(data.user?.email ?? null);
      setLoading(false);
    };

    loadUser().catch(() => undefined);
  }, [supabase.auth]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const trimmed = newEmail.trim().toLowerCase();

    if (!trimmed) {
      setError("Enter a new email address.");
      setSubmitting(false);
      return;
    }

    if (trimmed === currentEmail?.toLowerCase()) {
      setError("That is already your current email address.");
      setSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      email: trimmed,
    });

    const failure = fromSupabaseError(updateError);

    if (failure) {
      setError(failure.error);
      setSubmitting(false);
      return;
    }

    setMessage(
      settings.security.requireReauthenticationOnChange
        ? "Confirmation links were sent to your current and new email addresses. Open both to finish the change."
        : "A confirmation link was sent to your new email address."
    );
    setNewEmail("");
    setSubmitting(false);
  };

  return (
    <AuthSection aria-busy={loading || submitting} aria-labelledby={titleId}>
      <AuthSectionHeader
        description="Update the email you use to sign in. Confirmation links are sent for security."
        title="Email address"
        titleId={titleId}
      />

      {error ? <AuthErrorAlert message={error} /> : null}
      {message ? <AuthSuccessAlert message={message} /> : null}

      {loading ? (
        <p className={recipe("captionText")}>Loading account email…</p>
      ) : (
        <form
          className={cn("flex flex-col", recipe("sectionGap"))}
          noValidate
          onSubmit={handleSubmit}
        >
          <Field>
            <FieldLabel htmlFor={`${titleId}-current`}>
              Current email
            </FieldLabel>
            <Input
              disabled
              id={`${titleId}-current`}
              readOnly
              value={currentEmail ?? "Unknown"}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={emailFieldId}>New email</FieldLabel>
            <Input
              autoComplete="email"
              id={emailFieldId}
              onChange={(event) => setNewEmail(event.target.value)}
              placeholder="you@company.com"
              required
              type="email"
              value={newEmail}
            />
            <FieldHint>
              You may need to confirm from both inboxes when secure email change
              is enabled.
            </FieldHint>
          </Field>
          <AuthPendingButton
            className="w-fit"
            pending={submitting}
            pendingLabel="Sending confirmation…"
            type="submit"
            variant="secondary"
          >
            Request email change
          </AuthPendingButton>
        </form>
      )}
    </AuthSection>
  );
};
