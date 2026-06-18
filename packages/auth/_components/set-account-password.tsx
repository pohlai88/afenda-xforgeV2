"use client";

import {
  cn,
  Field,
  FieldError,
  recipe,
} from "@repo/design-system";
import { useId, useMemo, useState } from "react";
import {
  type AuthFieldErrors,
  fromSupabaseError,
  parseAuthFormFields,
} from "../auth-result";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { createUpdatePasswordSchema } from "../schemas";
import { AuthErrorAlert, AuthSuccessAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { AuthSection, AuthSectionHeader } from "./auth-section";
import { PasswordField } from "./password-field";

const passwordFieldId = "set-account-password";
const confirmFieldId = "set-account-password-confirm";

interface SetAccountPasswordProperties {
  onSuccess?: () => void;
}

const focusField = (field: keyof AuthFieldErrors) => {
  const id = field === "password" ? passwordFieldId : confirmFieldId;
  document.getElementById(id)?.focus();
};

const getFirstSetPasswordErrorField = (
  errors: AuthFieldErrors
): keyof AuthFieldErrors => {
  if (errors.password) {
    return "password";
  }

  if (errors.confirmPassword) {
    return "confirmPassword";
  }

  return "password";
};

/** Adds email/password sign-in to OAuth-only accounts (Supabase updateUser password). */
export const SetAccountPassword = ({
  onSuccess,
}: SetAccountPasswordProperties) => {
  const titleId = useId();
  const formErrorId = useId();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
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
    setFormError(null);
    setFieldErrors({});
    setMessage(null);

    const validated = parseAuthFormFields(schema, {
      password,
      confirmPassword,
    });

    if (!validated.ok) {
      setFieldErrors(validated.fieldErrors);
      setFormError(validated.formError ?? null);
      setLoading(false);
      focusField(getFirstSetPasswordErrorField(validated.fieldErrors));
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: validated.data.password,
    });

    const failure = fromSupabaseError(updateError);

    if (failure) {
      setFormError(failure.error);
      setLoading(false);
      focusField("password");
      return;
    }

    setMessage("Password set. You can now sign in with email and password.");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
    onSuccess?.();
  };

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return (
    <AuthSection aria-busy={loading} aria-labelledby={titleId}>
      <AuthSectionHeader
        description="Add a password to sign in with email if you originally registered with Google or another provider."
        title="Email & password"
        titleId={titleId}
      />
      {formError && !hasFieldErrors ? (
        <AuthErrorAlert id={formErrorId} message={formError} />
      ) : null}
      {message ? <AuthSuccessAlert message={message} /> : null}
      <form
        className={cn("flex flex-col", recipe("sectionGap"))}
        noValidate
        onSubmit={handleSubmit}
      >
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
        <Field>
          <PasswordField
            autoComplete="new-password"
            describedBy={
              fieldErrors.confirmPassword
                ? `${confirmFieldId}-error`
                : undefined
            }
            id={confirmFieldId}
            invalid={Boolean(fieldErrors.confirmPassword)}
            label="Confirm password"
            name="confirmPassword"
            onChange={(value) => {
              setConfirmPassword(value);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((current) => ({
                  ...current,
                  confirmPassword: undefined,
                }));
              }
            }}
            policy={passwordPolicy}
            value={confirmPassword}
          />
          {fieldErrors.confirmPassword ? (
            <FieldError id={`${confirmFieldId}-error`}>
              {fieldErrors.confirmPassword}
            </FieldError>
          ) : null}
        </Field>
        <AuthPendingButton
          className="w-full"
          pending={loading}
          pendingLabel="Saving…"
          type="submit"
          variant="primary"
        >
          Set password
        </AuthPendingButton>
      </form>
    </AuthSection>
  );
};
