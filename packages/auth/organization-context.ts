import "server-only";

import { database } from "@repo/database";
import { organizationMember } from "@repo/database/schema";
import { and, eq } from "drizzle-orm";
import { getActiveOrganizationId } from "./metadata";

export const getUserOrganizationIds = async (
  userId: string
): Promise<string[]> => {
  const memberships = await database
    .select({ organizationId: organizationMember.organizationId })
    .from(organizationMember)
    .where(eq(organizationMember.userId, userId));

  return memberships.map((member) => member.organizationId);
};

export const isOrganizationMember = async (
  userId: string,
  organizationId: string
): Promise<boolean> => {
  const [membership] = await database
    .select({ organizationId: organizationMember.organizationId })
    .from(organizationMember)
    .where(
      and(
        eq(organizationMember.userId, userId),
        eq(organizationMember.organizationId, organizationId)
      )
    )
    .limit(1);

  return Boolean(membership);
};

/**
 * Resolves the active organization for a user.
 * `user_metadata.activeOrganizationId` is a UX preference only — membership is
 * always verified against the database (Supabase: do not trust user_metadata
 * for authorization).
 */
export const resolveActiveOrganizationId = async (
  userId: string,
  metadata: Record<string, unknown> | undefined
): Promise<string | null> => {
  const memberOrgIds = await getUserOrganizationIds(userId);

  if (memberOrgIds.length === 0) {
    return null;
  }

  const preferred = getActiveOrganizationId(metadata);

  if (preferred && memberOrgIds.includes(preferred)) {
    return preferred;
  }

  return memberOrgIds[0] ?? null;
};
