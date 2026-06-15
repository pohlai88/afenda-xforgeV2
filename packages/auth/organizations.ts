import "server-only";

import { database } from "@repo/database";
import {
  organization,
  organizationMember,
} from "@repo/database/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { createClient } from "./server";
import { withActiveOrganizationId } from "./metadata";

export const createOrganization = async (name: string, userId: string) => {
  const now = new Date();
  const organizationId = createId();

  const [created] = await database
    .insert(organization)
    .values({
      id: organizationId,
      name,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  await database.insert(organizationMember).values({
    id: createId(),
    userId,
    organizationId,
    role: "owner",
    createdAt: now,
    updatedAt: now,
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.updateUser({
    data: withActiveOrganizationId(user?.user_metadata, organizationId),
  });

  return created;
};

export const getOrganizations = async (userId: string) => {
  const memberships = await database
    .select({ organizationId: organizationMember.organizationId })
    .from(organizationMember)
    .where(eq(organizationMember.userId, userId));

  const organizationIds = memberships.map((member) => member.organizationId);

  if (organizationIds.length === 0) {
    return [];
  }

  return database.query.organization.findMany({
    where: (organizations, { inArray: inArrayOp }) =>
      inArrayOp(organizations.id, organizationIds),
    with: {
      members: true,
    },
  });
};

export const switchOrganization = async (organizationId: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.updateUser({
    data: withActiveOrganizationId(user?.user_metadata, organizationId),
  });
};

export const getOrganizationMembers = async (organizationId: string) =>
  database
    .select()
    .from(organizationMember)
    .where(eq(organizationMember.organizationId, organizationId));
