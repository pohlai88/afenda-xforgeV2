/** Client-safe relative redirect guard (mirrors confirm-link resolveSafeRedirect). */
export const resolveSafeRedirectPath = (
  next: string | null | undefined
): string => (next?.startsWith("/") ? next : "/");
