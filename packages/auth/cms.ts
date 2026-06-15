import "server-only";

import { database } from "@repo/database";
import { organizationMember } from "@repo/database/schema";
import { and, eq } from "drizzle-orm";
import { requireOrg } from "./server";
import type { AuthenticatedContext } from "./types";
import { InsufficientRoleError } from "./types";

export const ORGANIZATION_ROLES = ["owner", "editor", "member"] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export const CMS_EDITOR_ROLES = ["owner", "editor"] as const;

export type CmsEditorRole = (typeof CMS_EDITOR_ROLES)[number];

export const CMS_OWNER_ROLES = ["owner"] as const;

export type CmsOwnerRole = (typeof CMS_OWNER_ROLES)[number];

export const getOrganizationRole = async (
  userId: string,
  orgId: string
): Promise<OrganizationRole | null> => {
  const [membership] = await database
    .select({ role: organizationMember.role })
    .from(organizationMember)
    .where(
      and(
        eq(organizationMember.userId, userId),
        eq(organizationMember.organizationId, orgId)
      )
    )
    .limit(1);

  if (!membership) {
    return null;
  }

  const role = membership.role as OrganizationRole;

  if (!ORGANIZATION_ROLES.includes(role)) {
    return "member";
  }

  return role;
};

export const canEditCms = (role: OrganizationRole | null): role is CmsEditorRole =>
  role !== null && CMS_EDITOR_ROLES.includes(role as CmsEditorRole);

export const canOwnOrg = (role: OrganizationRole | null): role is CmsOwnerRole =>
  role === "owner";

export const requireEditor = async (): Promise<
  AuthenticatedContext & { orgId: string; role: CmsEditorRole }
> => {
  const context = await requireOrg();
  const role = await getOrganizationRole(context.userId, context.orgId);

  if (!canEditCms(role)) {
    throw new InsufficientRoleError();
  }

  return { ...context, role };
};

export const requireOwner = async (): Promise<
  AuthenticatedContext & { orgId: string; role: CmsOwnerRole }
> => {
  const context = await requireOrg();
  const role = await getOrganizationRole(context.userId, context.orgId);

  if (!canOwnOrg(role)) {
    throw new InsufficientRoleError();
  }

  return { ...context, role };
};
