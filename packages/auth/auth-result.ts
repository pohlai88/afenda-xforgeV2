import type { AuthError } from "@supabase/supabase-js";
import type { z } from "zod";
import {
  humanizeAuthError,
  humanizeUnknownAuthError,
} from "./auth-form-messages";
import type { AuthActionResult } from "./types";

export type AuthFieldErrors = Partial<Record<string, string>>;

export interface AuthFormFailure {
  fieldErrors: AuthFieldErrors;
  formError?: string;
  ok: false;
}

export type AuthFormResult<TInput> =
  | { ok: true; data: TInput }
  | AuthFormFailure;

export const authSuccess = <TData>(data: TData): AuthActionResult<TData> => ({
  ok: true,
  data,
});

export const authFailure = (
  error: string
): Extract<AuthActionResult<never>, { ok: false }> => ({
  ok: false,
  error,
});

export const parseAuthFormFields = <TInput>(
  schema: z.ZodType<TInput>,
  input: unknown
): AuthFormResult<TInput> => {
  const parsed = schema.safeParse(input);

  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }

  const fieldErrors: AuthFieldErrors = {};

  for (const issue of parsed.error.issues) {
    const key = issue.path[0];

    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  const firstMessage = parsed.error.issues[0]?.message;

  return {
    ok: false,
    fieldErrors,
    formError: Object.keys(fieldErrors).length === 0 ? firstMessage : undefined,
  };
};

type AuthFailureSource = AuthError | { message: string } | null;

export const fromSupabaseError = (
  error: AuthFailureSource
): Extract<AuthActionResult<never>, { ok: false }> | null => {
  if (!error) {
    return null;
  }

  return authFailure(humanizeAuthError(error));
};

export const mapAuthError = (error: unknown): AuthActionResult<never> => {
  return authFailure(humanizeUnknownAuthError(error));
};

export const isAuthSuccess = <TData>(
  result: AuthActionResult<TData>
): result is { ok: true; data: TData } => result.ok;

export const isAuthFailure = <TData>(
  result: AuthActionResult<TData>
): result is { ok: false; error: string } => !result.ok;
