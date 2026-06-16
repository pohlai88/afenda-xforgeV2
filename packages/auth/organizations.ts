import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { organization, organizationMember } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { canOwnOrg, getOrganizationRole } from "./cms";
import { withActiveOrganizationId } from "./metadata";
import { isOrganizationMember } from "./organization-context";
import {
  ORGANIZATION_ROLES,
  type OrganizationRole,
  parseOrganizationRole,
} from "./organization-roles";
import { createAdminClient, createClient } from "./server";
import {
  InsufficientRoleError,
  UnauthenticatedError,
  UnauthorizedOrganizationError,
} from "./types";

const INVITE_ORGANIZATION_ID_KEY = "inviteOrganizationId";
const INVITE_ORGANIZATION_ROLE_KEY = "inviteOrganizationRole";

export interface OrganizationMemberRecord {
  displayName: string | null;
  email: string | null;
  id: string;
  organizationId: string;
  role: OrganizationRole;
  userId: string;
}

export type InviteMemberResult =
  | { kind: "added"; userId: string }
  | { kind: "invited"; email: string };

export const hasPendingOrganizationInvite = (
  metadata: Record<string, unknown> | undefined
): boolean =>
  typeof metadata?.[INVITE_ORGANIZATION_ID_KEY] === "string" &&
  metadata[INVITE_ORGANIZATION_ID_KEY].length > 0;

const assertOwner = async (userId: string, organizationId: string) => {
  const role = await getOrganizationRole(userId, organizationId);

  if (!canOwnOrg(role)) {
    throw new InsufficientRoleError(
      "Only organization owners can manage members."
    );
  }
};

const findUserIdByEmail = async (email: string): Promise<string | null> => {
  const admin = createAdminClient();
  const normalized = email.trim().toLowerCase();
  let page = 1;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error || data.users.length === 0) {
      return null;
    }

    const match = data.users.find(
      (user) => user.email?.trim().toLowerCase() === normalized
    );

    if (match) {
      return match.id;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }

  return null;
};

const addMemberRecord = async (
  organizationId: string,
  userId: string,
  role: OrganizationRole
) => {
  const now = new Date();

  await database.insert(organizationMember).values({
    id: createId(),
    userId,
    organizationId,
    role,
    createdAt: now,
    updatedAt: now,
  });
};

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

  if (!user) {
    throw new UnauthenticatedError();
  }

  if (!(await isOrganizationMember(user.id, organizationId))) {
    throw new UnauthorizedOrganizationError();
  }

  await supabase.auth.updateUser({
    data: withActiveOrganizationId(user.user_metadata, organizationId),
  });
};

export const getOrganizationMembers = async (organizationId: string) =>
  database
    .select()
    .from(organizationMember)
    .where(eq(organizationMember.organizationId, organizationId));

export const getOrganizationMembersDetailed = async (
  organizationId: string
): Promise<OrganizationMemberRecord[]> => {
  const members = await getOrganizationMembers(organizationId);
  const admin = createAdminClient();
  const records: OrganizationMemberRecord[] = [];

  for (const member of members) {
    const { data, error } = await admin.auth.admin.getUserById(member.userId);

    records.push({
      id: member.id,
      userId: member.userId,
      organizationId: member.organizationId,
      role: parseOrganizationRole(member.role) ?? "member",
      email: error ? null : (data.user.email ?? null),
      displayName: error
        ? null
        : ((data.user.user_metadata?.name as string | undefined) ?? null),
    });
  }

  return records;
};

export const updateOrganizationName = async (
  organizationId: string,
  name: string,
  actorUserId: string
) => {
  await assertOwner(actorUserId, organizationId);

  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error("Organization name is required.");
  }

  const [updated] = await database
    .update(organization)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(eq(organization.id, organizationId))
    .returning();

  return updated;
};

export const addOrganizationMember = async (
  organizationId: string,
  email: string,
  role: OrganizationRole,
  actorUserId: string
): Promise<InviteMemberResult> => {
  await assertOwner(actorUserId, organizationId);

  if (!ORGANIZATION_ROLES.includes(role)) {
    throw new Error("Invalid organization role.");
  }

  const userId = await findUserIdByEmail(email);

  if (!userId) {
    return inviteOrganizationMember(organizationId, email, role, actorUserId);
  }

  if (await isOrganizationMember(userId, organizationId)) {
    throw new Error("This user is already a member of the organization.");
  }

  await addMemberRecord(organizationId, userId, role);

  return { kind: "added", userId };
};

export const inviteOrganizationMember = async (
  organizationId: string,
  email: string,
  role: OrganizationRole,
  actorUserId: string
): Promise<InviteMemberResult> => {
  await assertOwner(actorUserId, organizationId);

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  const admin = createAdminClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\.supabase\.co$/, "") ??
    "http://localhost:3000";

  const { error } = await admin.auth.admin.inviteUserByEmail(normalizedEmail, {
    data: {
      [INVITE_ORGANIZATION_ID_KEY]: organizationId,
      [INVITE_ORGANIZATION_ROLE_KEY]: role,
    },
    redirectTo: `${siteUrl.replace(/\/$/, "")}/auth/confirm`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { kind: "invited", email: normalizedEmail };
};
