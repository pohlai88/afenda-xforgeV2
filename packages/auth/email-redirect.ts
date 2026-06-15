/** Email / magic-link confirm URL — must match Supabase redirect allow list. */
export const buildEmailConfirmRedirect = (next = "/") => {
  const safeNext = next.startsWith("/") ? next : "/";
  const encoded = encodeURIComponent(safeNext);

  if (typeof window === "undefined") {
    return `/auth/confirm?next=${encoded}`;
  }

  return `${window.location.origin}/auth/confirm?next=${encoded}`;
};
