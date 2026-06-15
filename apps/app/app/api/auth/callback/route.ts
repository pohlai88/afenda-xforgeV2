import { resolveSafeRedirect } from "@repo/api";
import { authRedirect } from "@repo/auth/auth-cache";
import { createClient } from "@repo/auth/server";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = resolveSafeRedirect(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return authRedirect(`${origin}${next}`);
    }
  }

  return authRedirect(`${origin}/sign-in`);
};
