"use client";

import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldHint,
  FieldLabel,
  Input,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import { useMemo, useState } from "react";
import { isAuthApiError } from "@supabase/supabase-js";
import {
  changePassword,
  requestPasswordChangeReauthentication,
  type ChangePasswordVariant,
} from "../change-password";
import { fromSupabaseError, isAuthFailure, parseAuthForm } from "../auth-result";
import { completeAuthNavigation } from "../client-navigation";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { createUpdatePasswordSchema } from "../schemas";
import { PasswordField } from "./password-field";
import { PasswordSecurityTips } from "./password-security-tips";

const currentPasswordFieldId = "update-password-current";
const nonceFieldId = "update-password-nonce";
const passwordFieldId = "update-password-new";
const confirmFieldId = "update-password-confirm";
const formErrorId = "update-password-error";

type UpdatePasswordFormProperties = {
  /** Recovery (email link) skips current-password and reauth requirements. */
  variant?: ChangePasswordVariant;
  onSuccess?: () => void;
  redirectTo?: string;
};

export const UpdatePasswordForm = ({
  variant = "recovery",
  onSuccess,
  redirectTo = "/",
}: UpdatePasswordFormProperties) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nonce, setNonce] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [reauthLoading, setReauthLoading] = useState(false);
  const [reauthSent, setReauthSent] = useState(false);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const { settings, passwordPolicy } = useAuthUiConfig();

  const isAccountChange = variant === "account";
  const requireCurrentPassword =
    isAccountChange && settings.security.requireCurrentPasswordOnChange;
  const requireReauthentication =
    isAccountChange && settings.security.requireReauthenticationOnChange;
  const showReauthField = requireReauthentication && (needsReauth || reauthSent);

  const updatePasswordSchema = useMemo(
    () =>
      createUpdatePasswordSchema(passwordPolicy, {
        requireCurrentPassword,
        requireReauthenticationNonce:
          requireReauthentication && (needsReauth || reauthSent),
      }),
    [
      passwordPolicy,
      requireCurrentPassword,
      requireReauthentication,
      needsReauth,
      reauthSent,
    ]
  );

  const handleRequestReauth = async () => {
    setReauthLoading(true);
    setError(null);

    const { error: reauthError } =
      await requestPasswordChangeReauthentication(supabase);

    const failure = fromSupabaseError(reauthError);

    if (failure) {
      setError(failure.error);
      setReauthLoading(false);
      return;
    }

    setReauthSent(true);
    setNeedsReauth(true);
    setReauthLoading(false);
    document.getElementById(nonceFieldId)?.focus();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const validated = parseAuthForm(updatePasswordSchema, {
      currentPassword,
      nonce,
      password,
      confirmPassword,
    });

    if (isAuthFailure(validated)) {
      setError(validated.error);
      setLoading(false);
      return;
    }

    const { error: updateError } = await changePassword(
      supabase,
      {
        password: validated.data.password,
        currentPassword: validated.data.currentPassword,
        nonce: validated.data.nonce,
      },
      {
        requireCurrentPassword,
        requireReauthentication,
      },
      variant
    );

    const failure = fromSupabaseError(updateError);

    if (failure) {
      if (
        requireReauthentication &&
        updateError &&
        isAuthApiError(updateError) &&
        updateError.code === "reauthentication_needed"
      ) {
        setNeedsReauth(true);
      }

      setError(failure.error);
      setLoading(false);
      return;
    }

    if (onSuccess) {
      onSuccess();
      setLoading(false);
      return;
    }

    completeAuthNavigation(redirectTo);
  };

  return (
    <form
      className={cn("flex flex-col", recipe("sectionGap"))}
      noValidate
      onSubmit={handleSubmit}
    >
      {error ? (
        <Alert id={formErrorId} tone="critical">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {requireCurrentPassword ? (
        <Field>
          <PasswordField
            autoComplete="current-password"
            describedBy={error ? formErrorId : undefined}
            id={currentPasswordFieldId}
            invalid={Boolean(error)}
            label="Current password"
            name="currentPassword"
            onChange={setCurrentPassword}
            value={currentPassword}
          />
        </Field>
      ) : null}
      {showReauthField ? (
        <Field>
          <FieldLabel htmlFor={nonceFieldId}>Confirmation code</FieldLabel>
          <Input
            autoComplete="one-time-code"
            id={nonceFieldId}
            inputMode="numeric"
            name="nonce"
            onChange={(event) => setNonce(event.target.value)}
            placeholder="Code from your email"
            value={nonce}
          />
          <FieldHint>
            {reauthSent
              ? "Enter the code we sent to your email to confirm this change."
              : "Confirm your identity before changing your password."}
          </FieldHint>
        </Field>
      ) : null}
      {requireReauthentication && needsReauth && !reauthSent ? (
        <Button
          className="w-full"
          disabled={reauthLoading}
          onClick={() => void handleRequestReauth()}
          type="button"
          variant="secondary"
        >
          {reauthLoading ? "Sending…" : "Send confirmation code"}
        </Button>
      ) : null}
      <Field>
        <PasswordField
          autoComplete="new-password"
          describedBy={error ? formErrorId : undefined}
          id={passwordFieldId}
          invalid={Boolean(error)}
          label="New password"
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
          describedBy={error ? formErrorId : undefined}
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
        className="w-full"
        disabled={loading}
        type="submit"
        variant="primary"
      >
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
};
