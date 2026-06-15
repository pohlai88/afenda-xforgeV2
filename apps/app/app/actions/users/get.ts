"use server";

import { withOrg } from "@repo/auth/guards";
import { getUserAvatarUrl, getUserDisplayName } from "@repo/auth/metadata";
import { getOrganizationMembers } from "@repo/auth/organizations";
import { createAdminClient } from "@repo/auth/server";
import type { AuthActionResult } from "@repo/auth/types";

const colors = [
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

export const getUsers = async (
  userIds: string[]
): Promise<AuthActionResult<Liveblocks["UserMeta"]["info"][]>> =>
  withOrg(async ({ orgId }) => {
    const members = await getOrganizationMembers(orgId);
    const memberIds = members
      .map((member) => member.userId)
      .filter((userId) => userIds.includes(userId));

    const admin = createAdminClient();
    const users: Liveblocks["UserMeta"]["info"][] = [];

    for (const userId of memberIds) {
      const { data: userResponse, error } =
        await admin.auth.admin.getUserById(userId);

      if (error || !userResponse.user) {
        continue;
      }

      const user = userResponse.user;
      const name =
        getUserDisplayName(user.user_metadata) ?? user.email ?? "Unknown user";
      const picture = getUserAvatarUrl(user.user_metadata) ?? "";

      users.push({
        name,
        avatar: picture,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    return users;
  });
