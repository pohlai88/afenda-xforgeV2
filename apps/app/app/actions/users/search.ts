"use server";

import { withOrg } from "@repo/auth/guards";
import { getUserAvatarUrl, getUserDisplayName } from "@repo/auth/metadata";
import { getOrganizationMembers } from "@repo/auth/organizations";
import { createAdminClient } from "@repo/auth/server";
import type { AuthActionResult } from "@repo/auth/types";
import Fuse from "fuse.js";

export const searchUsers = async (
  query: string
): Promise<AuthActionResult<string[]>> =>
  withOrg(async ({ orgId }) => {
    const members = await getOrganizationMembers(orgId);
    const admin = createAdminClient();

    const users = await Promise.all(
      members.map(async (member) => {
        const { data, error } = await admin.auth.admin.getUserById(
          member.userId
        );

        if (error || !data.user) {
          return {
            id: member.userId,
            name: member.userId,
          };
        }

        const user = data.user;

        return {
          id: member.userId,
          name: getUserDisplayName(user.user_metadata) ?? user.email,
          imageUrl: getUserAvatarUrl(user.user_metadata) ?? undefined,
        };
      })
    );

    const fuse = new Fuse(users, {
      keys: ["name"],
      minMatchCharLength: 1,
      threshold: 0.3,
    });

    return fuse.search(query).map((result) => result.item.id);
  });
