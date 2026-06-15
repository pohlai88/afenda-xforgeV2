import { createServerClient } from "@supabase/ssr";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "./keys";

type AuthMiddlewareHandler = (
  request: NextRequest,
  event: NextFetchEvent
) => Response | Promise<Response | void | undefined>;

export const authMiddleware =
  (handler: AuthMiddlewareHandler) =>
  async (request: NextRequest, event: NextFetchEvent) => {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value);
            }

            supabaseResponse = NextResponse.next({ request });

            for (const { name, value, options } of cookiesToSet) {
              supabaseResponse.cookies.set(name, value, options);
            }
          },
        },
      }
    );

    await supabase.auth.getUser();

    const handlerResponse = await handler(request, event);

    return handlerResponse ?? supabaseResponse;
  };
