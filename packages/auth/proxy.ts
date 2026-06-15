import { createServerClient } from "@supabase/ssr";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { applyAuthResponseCacheHeaders } from "./auth-cache";
import { getSupabasePublishableKey, getSupabaseUrl } from "./keys";

type AuthMiddlewareHandler = (
  request: NextRequest,
  event: NextFetchEvent
) => Response | Promise<Response | void | undefined>;

/** Copy refreshed session cookies and cache headers onto another response. */
export const applySupabaseSessionToResponse = (
  sessionResponse: NextResponse,
  response: NextResponse
): NextResponse => {
  for (const cookie of sessionResponse.cookies.getAll()) {
    response.cookies.set(cookie);
  }

  for (const header of ["cache-control", "expires", "pragma"] as const) {
    const value = sessionResponse.headers.get(header);
    if (value) {
      response.headers.set(header, value);
    }
  }

  return response;
};

/**
 * Refreshes the Supabase Auth session for a request.
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client
 */
export const updateSession = async (request: NextRequest): Promise<NextResponse> => {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          supabaseResponse = NextResponse.next({ request });

          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }

          for (const [key, value] of Object.entries(headers)) {
            supabaseResponse.headers.set(key, value);
          }
        },
      },
    }
  );

  // Do not run code between createServerClient and getClaims().
  await supabase.auth.getClaims();

  return applyAuthResponseCacheHeaders(supabaseResponse);
};

export const authMiddleware =
  (handler: AuthMiddlewareHandler) =>
  async (request: NextRequest, event: NextFetchEvent) => {
    const sessionResponse = await updateSession(request);
    const handlerResponse = await handler(request, event);

    if (!handlerResponse) {
      return sessionResponse;
    }

    if (handlerResponse instanceof NextResponse) {
      return applySupabaseSessionToResponse(sessionResponse, handlerResponse);
    }

    const wrapped = new NextResponse(handlerResponse.body, handlerResponse);
    return applySupabaseSessionToResponse(sessionResponse, wrapped);
  };
