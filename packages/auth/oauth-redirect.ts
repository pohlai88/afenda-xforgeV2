/** OAuth / identity-link callback — must match Supabase redirect allow list. */
export const buildAuthCallbackRedirect = (next = "/") => {
  const safeNext = next.startsWith("/") ? next : "/";
  const encoded = encodeURIComponent(safeNext);

  if (typeof window === "undefined") {
    return `/api/auth/callback?next=${encoded}`;
  }

  return `${window.location.origin}/api/auth/callback?next=${encoded}`;
};
