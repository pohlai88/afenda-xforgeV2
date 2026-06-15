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
import { isAuthApiError } from "@supabase/supabase-js";
import { useMemo, useState } from "react";
import {
  type AuthFieldErrors,
  fromSupabaseError,
  parseAuthFormFields,
} from "../auth-result";
import {
  type ChangePasswordVariant,
  changePassword,
  requestPasswordChangeReauthentication,
} from "../change-password";
import { createClient } from "../client";
import { completeAuthNavigation } from "../client-navigation";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { createUpdatePasswordSchema } from "../schemas";
import { AuthErrorAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { PasswordField } from "./password-field";

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

const focusField = (field: keyof AuthFieldErrors) => {
  const ids: Record<string, string> = {
    currentPassword: currentPasswordFieldId,
    nonce: nonceFieldId,
    password: passwordFieldId,
    confirmPassword: confirmFieldId,
  };
  document.getElementById(ids[field] ?? passwordFieldId)?.focus();
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
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const supabase = createClient();
  const { settings, passwordPolicy } = useAuthUiConfig();

  const isAccountChange = variant === "account";
  const requireCurrentPassword =
    isAccountChange && settings.security.requireCurrentPasswordOnChange;
  const requireReauthentication =
    isAccountChange && settings.security.requireReauthenticationOnChange;
  const showReauthField =
    requireReauthentication && (needsReauth || reauthSent);

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

  const clearErrors = () => {
    setFormError(null);
    setFieldErrors({});
  };

  const handleRequestReauth = async () => {
    setReauthLoading(true);
    clearErrors();

    const { error: reauthError } =
      await requestPasswordChangeReauthentication(supabase);

    const failure = fromSupabaseError(reauthError);

    if (failure) {
      setFormError(failure.error);
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
    clearErrors();

    const validated = parseAuthFormFields(updatePasswordSchema, {
      currentPassword,
      nonce,
      password,
      confirmPassword,
    });

    if (!validated.ok) {
      setFieldErrors(validated.fieldErrors);
      setFormError(validated.formError ?? null);
      setLoading(false);
      const firstField =
        validated.fieldErrors.currentPassword
          ? "currentPassword"
          : validated.fieldErrors.nonce
            ? "nonce"
            : validated.fieldErrors.password
              ? "password"
              : validated.fieldErrors.confirmPassword
                ? "confirmPassword"
                : "password";
      focusField(firstField);
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

      setFormError(failure.error);
      setLoading(false);
      focusField("password");
      return;
    }

    if (onSuccess) {
      onSuccess();
      setLoading(false);
      return;
    }

    completeAuthNavigation(redirectTo);
  };

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return (
    <form
      className={cn("flex flex-col", recipe("sectionGap"))}
      noValidate
      onSubmit={handleSubmit}
    >
      {formError && !hasFieldErrors ? (
        <AuthErrorAlert id={formErrorId} message={formError} />
      ) : null}
      {requireCurrentPassword ? (
        <Field>
          <PasswordField
            autoComplete="current-password"
            describedBy={
              fieldErrors.currentPassword
                ? `${currentPasswordFieldId}-error`
                : undefined
            }
            id={currentPasswordFieldId}
            invalid={Boolean(fieldErrors.currentPassword)}
            label="Current password"
            name="currentPassword"
            onChange={(value) => {
              setCurrentPassword(value);
              if (fieldErrors.currentPassword) {
                setFieldErrors((current) => ({
                  ...current,
                  currentPassword: undefined,
                }));
              }
            }}
            value={currentPassword}
          />
          {fieldErrors.currentPassword ? (
            <FieldError id={`${currentPasswordFieldId}-error`}>
              {fieldErrors.currentPassword}
            </FieldError>
          ) : null}
        </Field>
      ) : null}
      {showReauthField ? (
        <Field>
          <FieldLabel htmlFor={nonceFieldId}>Confirmation code</FieldLabel>
          <Input
            aria-describedby={
              fieldErrors.nonce
                ? `${nonceFieldId}-error`
                : `${nonceFieldId}-hint`
            }
            aria-invalid={fieldErrors.nonce ? true : undefined}
            autoComplete="one-time-code"
            id={nonceFieldId}
            inputMode="numeric"
            name="nonce"
            onChange={(event) => {
              setNonce(event.target.value);
              if (fieldErrors.nonce) {
                setFieldErrors((current) => ({ ...current, nonce: undefined }));
              }
            }}
            placeholder="Code from your email"
            value={nonce}
          />
          <FieldHint id={`${nonceFieldId}-hint`}>
            {reauthSent
              ? "Enter the code we sent to your email to confirm this change."
              : "Confirm your identity before changing your password."}
          </FieldHint>
          {fieldErrors.nonce ? (
            <FieldError id={`${nonceFieldId}-error`}>
              {fieldErrors.nonce}
            </FieldError>
          ) : null}
        </Field>
      ) : null}
      {requireReauthentication && needsReauth && !reauthSent ? (
        <AuthPendingButton
          className="w-full"
          onClick={() => void handleRequestReauth()}
          pending={reauthLoading}
          pendingLabel="Sending…"
          type="button"
          variant="secondary"
        >
          Send confirmation code
        </AuthPendingButton>
      ) : null}
      <Field>
        <PasswordField
          autoComplete="new-password"
          describedBy={
            fieldErrors.password ? `${passwordFieldId}-error` : undefined
          }
          id={passwordFieldId}
          invalid={Boolean(fieldErrors.password)}
          label="New password"
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
            fieldErrors.confirmPassword ? `${confirmFieldId}-error` : undefined
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
        pendingLabel="Updating…"
        type="submit"
        variant="primary"
      >
        Update password
      </AuthPendingButton>
    </form>
  );
};
