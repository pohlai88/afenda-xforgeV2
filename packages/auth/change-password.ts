import type { SupabaseClient } from "@supabase/supabase-js";

export type ChangePasswordVariant = "recovery" | "account";

export interface ChangePasswordInput {
  currentPassword?: string;
  nonce?: string;
  password: string;
}

export interface ChangePasswordSecurity {
  requireCurrentPassword: boolean;
  requireReauthentication: boolean;
}

/** Update password with project security settings (current password + reauth nonce). */
export const changePassword = async (
  supabase: SupabaseClient,
  input: ChangePasswordInput,
  security: ChangePasswordSecurity,
  variant: ChangePasswordVariant = "account"
) => {
  if (
    variant === "account" &&
    security.requireCurrentPassword &&
    input.currentPassword
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const email = user?.email;

    if (!email) {
      return {
        data: { user: null },
        error: { message: "Sign in again to change your password." },
      };
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: input.currentPassword,
    });

    if (verifyError) {
      return { data: { user: null }, error: verifyError };
    }
  }

  const attributes: {
    password: string;
    currentPassword?: string;
    nonce?: string;
  } = {
    password: input.password,
  };

  if (variant === "account") {
    if (security.requireCurrentPassword && input.currentPassword) {
      attributes.currentPassword = input.currentPassword;
    }

    if (security.requireReauthentication && input.nonce) {
      attributes.nonce = input.nonce;
    }
  }

  return supabase.auth.updateUser(attributes);
};

export const requestPasswordChangeReauthentication = async (
  supabase: SupabaseClient
) => supabase.auth.reauthenticate();
