import type { AuthError } from "@supabase/supabase-js";
import type { z } from "zod";
import type { AuthActionResult } from "./types";

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

export const parseAuthForm = <TInput>(
  schema: z.ZodType<TInput>,
  input: unknown
): AuthActionResult<TInput> => {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return authFailure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  return authSuccess(parsed.data);
};

export const fromSupabaseError = (
  error: AuthError | null
): Extract<AuthActionResult<never>, { ok: false }> | null => {
  if (!error) {
    return null;
  }

  return authFailure(error.message);
};

export const mapAuthError = (error: unknown): AuthActionResult<never> => {
  if (error instanceof Error) {
    return authFailure(error.message);
  }

  return authFailure("Unknown error");
};

export const isAuthSuccess = <TData>(
  result: AuthActionResult<TData>
): result is { ok: true; data: TData } => result.ok;

export const isAuthFailure = <TData>(
  result: AuthActionResult<TData>
): result is { ok: false; error: string } => !result.ok;
