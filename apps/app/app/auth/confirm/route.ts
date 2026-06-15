import { confirmAuthLink } from "@repo/auth/confirm-link";
import { NextResponse } from "next/server";

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
    return NextResponse.redirect(result.redirectTo);
  }

  return NextResponse.redirect(
    `${origin}/sign-in?error=${encodeURIComponent(result.error)}`
  );
};
