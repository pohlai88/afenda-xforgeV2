/**
 * Full document navigation after client-side sign-in so the server receives
 * refreshed auth cookies before SSR (avoids Next.js prefetch race).
 * @see https://supabase.com/docs/guides/auth/server-side/advanced-guide
 */
export const completeAuthNavigation = (href = "/") => {
  const safeHref = href.startsWith("/") ? href : "/";
  window.location.assign(safeHref);
};
