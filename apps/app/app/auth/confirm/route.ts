import { authRedirect } from "@repo/auth/auth-cache";
import { confirmAuthLink } from "@repo/auth/confirm-link";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);

  const result = await confirmAuthLink({
    tokenHash: searchParams.get("token_hash"),
    type: searchParams.get("type"),
    code: searchParams.get("code"),
    next: searchParams.get("next"),
    origin,
  });

  if (result.ok) {
    return authRedirect(result.redirectTo);
  }

  return authRedirect(
    `${origin}/sign-in?error=${encodeURIComponent(result.error)}`
  );
};
