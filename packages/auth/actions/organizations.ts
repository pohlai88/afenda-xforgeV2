"use server";

import { withAuth, withOrg, withOwner } from "@repo/auth/guards";
import { getOrganizationRole } from "@repo/auth/cms";
import {
  addOrganizationMember,
  createOrganization,
  getOrganizationMembersDetailed,
  getOrganizations,
  switchOrganization,
  updateOrganizationName,
} from "@repo/auth/organizations";
import type { OrganizationRole } from "@repo/auth/organization-roles";
import { revalidatePath } from "next/cache";

export const getActiveOrganizations = async () => {
  const result = await withAuth(async ({ userId }) => getOrganizations(userId));

  return result.ok ? result.data : [];
};

export const switchActiveOrganization = async (organizationId: string) => {
  await switchOrganization(organizationId);
  revalidatePath("/", "layout");
};

export const createUserOrganization = async (name: string) =>
  withAuth(async ({ userId }) => {
    const organization = await createOrganization(name.trim(), userId);
    revalidatePath("/", "layout");
    revalidatePath("/account/organization");
    return organization;
  });

export const renameOrganization = async (
  organizationId: string,
  name: string
) =>
  withOwner(async ({ userId }) => {
    const organization = await updateOrganizationName(
      organizationId,
      name,
      userId
    );
    revalidatePath("/", "layout");
    revalidatePath("/account/organization");
    return organization;
  });

export const listOrganizationMembers = async (organizationId: string) =>
  withOrg(async ({ orgId, userId }) => {
    if (orgId !== organizationId) {
      throw new Error("Organization access denied.");
    }

    const role = await getOrganizationRole(userId, orgId);

    if (!role) {
      throw new Error("Organization access denied.");
    }

    return getOrganizationMembersDetailed(organizationId);
  });

export const inviteMember = async (
  organizationId: string,
  email: string,
  role: OrganizationRole
) =>
  withOwner(async ({ userId, orgId }) => {
    if (orgId !== organizationId) {
      throw new Error("Switch to this organization before inviting members.");
    }

    const result = await addOrganizationMember(
      organizationId,
      email,
      role,
      userId
    );
    revalidatePath("/account/organization");
    return result;
  });
