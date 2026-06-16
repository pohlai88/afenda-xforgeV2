const STANDALONE_AUTHENTICATED_ROUTES = ["/dashboard"] as const;

export function isStandaloneAuthenticatedRoute(pathname: string): boolean {
  return STANDALONE_AUTHENTICATED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
