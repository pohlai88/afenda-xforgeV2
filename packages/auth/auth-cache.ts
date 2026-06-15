import { NextResponse } from "next/server";

/** Prevent CDN/ISR from caching responses that may include Set-Cookie. */
export const AUTH_RESPONSE_CACHE_HEADERS = {
  "Cache-Control": "private, no-store",
} as const;

export const applyAuthResponseCacheHeaders = (
  response: NextResponse
): NextResponse => {
  for (const [key, value] of Object.entries(AUTH_RESPONSE_CACHE_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
};

export const authRedirect = (
  url: string | URL,
  init?: number | ResponseInit
): NextResponse => {
  const response = NextResponse.redirect(url, init);
  return applyAuthResponseCacheHeaders(response);
};
