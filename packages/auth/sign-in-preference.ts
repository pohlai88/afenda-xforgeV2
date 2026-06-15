/** Last successful sign-in method — stored client-side for returning users. */
export type SignInMethod = "magic-link" | "password" | "google";

const STORAGE_KEY = "afenda.auth.preferredSignInMethod";

/** First-time visitors default to passwordless email (magic link / OTP). */
export const getPreferredSignInMethod = (): SignInMethod => {
  if (typeof window === "undefined") {
    return "magic-link";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === "password" || stored === "google" || stored === "magic-link") {
    return stored;
  }

  return "magic-link";
};

export const setPreferredSignInMethod = (method: SignInMethod) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, method);
};

export const preferredSignInMethodLabel = (method: SignInMethod): string => {
  switch (method) {
    case "google":
      return "Google";
    case "password":
      return "password";
    default:
      return "email link or code";
  }
};
