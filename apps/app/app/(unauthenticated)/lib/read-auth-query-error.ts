import { humanizeAuthError } from "@repo/auth/auth-form-messages";

export const readAuthQueryError = (
  error: string | string[] | undefined
): string | null => {
  if (!error) {
    return null;
  }

  const value = Array.isArray(error) ? error[0] : error;

  if (!value) {
    return null;
  }

  try {
    return humanizeAuthError(decodeURIComponent(value));
  } catch {
    return humanizeAuthError(value);
  }
};
