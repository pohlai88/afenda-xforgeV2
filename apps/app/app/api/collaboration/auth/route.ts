import { apiError, methodNotAllowed, withApiRoute } from "@repo/api";
import { getUserAvatarUrl, getUserDisplayName } from "@repo/auth/metadata";
import { getAuthSession } from "@repo/auth/server";
import { authenticate } from "@repo/collaboration/auth";

const COLORS = [
  "var(--color-red-500)",
  "var(--color-orange-500)",
  "var(--color-amber-500)",
  "var(--color-yellow-500)",
  "var(--color-lime-500)",
  "var(--color-green-500)",
  "var(--color-emerald-500)",
  "var(--color-teal-500)",
  "var(--color-cyan-500)",
  "var(--color-sky-500)",
  "var(--color-blue-500)",
  "var(--color-indigo-500)",
  "var(--color-violet-500)",
  "var(--color-purple-500)",
  "var(--color-fuchsia-500)",
  "var(--color-pink-500)",
  "var(--color-rose-500)",
];

export const POST = withApiRoute(async () => {
  const session = await getAuthSession();

  if (!session?.orgId) {
    return apiError("unauthorized", "Unauthorized", 401);
  }

  const { user, orgId } = session;
  const name =
    getUserDisplayName(user.user_metadata) ?? user.email ?? undefined;
  const avatar = getUserAvatarUrl(user.user_metadata) ?? undefined;

  return authenticate({
    userId: user.id,
    orgId,
    userInfo: {
      name,
      avatar,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    },
  });
});

export const GET = (): Response => methodNotAllowed(["POST"]);
