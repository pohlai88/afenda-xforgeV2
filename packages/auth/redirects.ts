const AUTH_REDIRECT_PATHS = {
  callback: "/api/auth/callback",
  confirm: "/auth/confirm",
} as const;

type AuthRedirectTarget = keyof typeof AUTH_REDIRECT_PATHS;

const buildAuthRedirect = (target: AuthRedirectTarget, next = "/") => {
  const safeNext = next.startsWith("/") ? next : "/";
  const encoded = encodeURIComponent(safeNext);
  const path = `${AUTH_REDIRECT_PATHS[target]}?next=${encoded}`;

  if (typeof window === "undefined") {
    return path;
  }

  return `${window.location.origin}${path}`;
};

/** OAuth / identity-link callback — must match Supabase redirect allow list. */
export const buildAuthCallbackRedirect = (next = "/") =>
  buildAuthRedirect("callback", next);

/** Email / magic-link confirm URL — must match Supabase redirect allow list. */
export const buildEmailConfirmRedirect = (next = "/") =>
  buildAuthRedirect("confirm", next);
