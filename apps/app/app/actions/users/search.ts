"use server";

import { withOrg } from "@repo/auth/guards";
import { getUserDisplayName } from "@repo/auth/metadata";
import { getOrganizationMembers } from "@repo/auth/organizations";
import { createAdminClient } from "@repo/auth/server";
import type { AuthActionResult } from "@repo/auth/types";
import Fuse from "fuse.js";

export interface OrgMemberOption {
  id: string;
  name: string;
}

const loadOrgMemberOptions = async (orgId: string): Promise<OrgMemberOption[]> => {
  const members = await getOrganizationMembers(orgId);
  const admin = createAdminClient();

  return Promise.all(
    members.map(async (member) => {
      const { data, error } = await admin.auth.admin.getUserById(member.userId);

      if (error || !data.user) {
        return {
          id: member.userId,
          name: member.userId,
        };
      }

      const user = data.user;

      return {
        id: member.userId,
        name: getUserDisplayName(user.user_metadata) ?? user.email ?? member.userId,
      };
    })
  );
};

export const searchOrgMemberOptions = async (
  query: string
): Promise<AuthActionResult<OrgMemberOption[]>> =>
  withOrg(async ({ orgId }) => {
    const users = await loadOrgMemberOptions(orgId);

    if (!query.trim()) {
      return users.slice(0, 20);
    }

    const fuse = new Fuse(users, {
      keys: ["name", "id"],
      minMatchCharLength: 1,
      threshold: 0.3,
    });

    return fuse.search(query).map((result) => result.item).slice(0, 20);
  });

export const getOrgMemberOption = async (
  userId: string
): Promise<AuthActionResult<OrgMemberOption | null>> =>
  withOrg(async ({ orgId }) => {
    const users = await loadOrgMemberOptions(orgId);
    return users.find((member) => member.id === userId) ?? null;
  });

export const searchUsers = async (
  query: string
): Promise<AuthActionResult<string[]>> =>
  withOrg(async ({ orgId }) => {
    const users = await loadOrgMemberOptions(orgId);

    if (!query.trim()) {
      return users.slice(0, 20).map((member) => member.id);
    }

    const fuse = new Fuse(users, {
      keys: ["name", "id"],
      minMatchCharLength: 1,
      threshold: 0.3,
    });

    return fuse.search(query).map((result) => result.item.id).slice(0, 20);
  });
