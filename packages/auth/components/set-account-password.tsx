"use client";

import {
  Alert,
  AlertDescription,
  Button,
  Field,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import { useMemo, useState } from "react";
import { fromSupabaseError, isAuthFailure, parseAuthForm } from "../auth-result";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { createUpdatePasswordSchema } from "../schemas";
import { PasswordField } from "./password-field";
import { PasswordSecurityTips } from "./password-security-tips";

const passwordFieldId = "set-account-password";
const confirmFieldId = "set-account-password-confirm";

type SetAccountPasswordProperties = {
  onSuccess?: () => void;
};

/** Adds email/password sign-in to OAuth-only accounts (Supabase updateUser password). */
export const SetAccountPassword = ({ onSuccess }: SetAccountPasswordProperties) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();
  const { passwordPolicy } = useAuthUiConfig();
  const schema = useMemo(
    () => createUpdatePasswordSchema(passwordPolicy),
    [passwordPolicy]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const validated = parseAuthForm(schema, { password, confirmPassword });

    if (isAuthFailure(validated)) {
      setError(validated.error);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: validated.data.password,
    });

    const failure = fromSupabaseError(updateError);

    if (failure) {
      setError(failure.error);
      setLoading(false);
      return;
    }

    setMessage("Password set. You can now sign in with email and password.");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
    onSuccess?.();
  };

  return (
    <section className={cn("flex flex-col", recipe("sectionGap"))}>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-text-primary">Email & password</h2>
        <p className={recipe("captionText")}>
          Add a password to sign in with email if you originally registered with
          Google or another provider.
        </p>
      </div>
      {error ? (
        <Alert tone="critical">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {message ? (
        <Alert role="status" tone="positive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      <form
        className={cn("flex flex-col", recipe("sectionGap"))}
        noValidate
        onSubmit={handleSubmit}
      >
        <Field>
          <PasswordField
            autoComplete="new-password"
            id={passwordFieldId}
            invalid={Boolean(error)}
            label="Password"
            name="password"
            onChange={setPassword}
            policy={passwordPolicy}
            showRequirements
            value={password}
          />
        </Field>
        <Field>
          <PasswordField
            autoComplete="new-password"
            id={confirmFieldId}
            invalid={Boolean(error)}
            label="Confirm password"
            name="confirmPassword"
            onChange={setConfirmPassword}
            policy={passwordPolicy}
            value={confirmPassword}
          />
        </Field>
        <PasswordSecurityTips />
        <Button
          className="w-fit"
          disabled={loading}
          type="submit"
          variant="secondary"
        >
          {loading ? "Saving…" : "Set password"}
        </Button>
      </form>
    </section>
  );
};
