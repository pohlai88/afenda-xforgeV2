import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { orbitObjectLink } from "@repo/database/schema";
import { and, desc, eq } from "drizzle-orm";
import type { OrbitObjectLinkRecord } from "../../contract/orbit-case.types";

export interface CreateObjectLinkInput {
  organizationId: string;
  originCaseId: string;
  pushEventId: string;
  targetType: string;
  targetId: string;
  payload: Record<string, unknown>;
}

export const createObjectLink = async (
  input: CreateObjectLinkInput
): Promise<OrbitObjectLinkRecord> => {
  const id = createId();
  const now = new Date();

  await database.insert(orbitObjectLink).values({
    id,
    organizationId: input.organizationId,
    originCaseId: input.originCaseId,
    pushEventId: input.pushEventId,
    targetType: input.targetType,
    targetId: input.targetId,
    payload: input.payload,
    createdAt: now,
  });

  return {
    id,
    organizationId: input.organizationId,
    originCaseId: input.originCaseId,
    pushEventId: input.pushEventId,
    targetType: input.targetType,
    targetId: input.targetId,
    payload: input.payload,
    createdAt: now,
  };
};

export const listObjectLinksForCase = async (
  organizationId: string,
  caseId: string
): Promise<OrbitObjectLinkRecord[]> => {
  const rows = await database
    .select()
    .from(orbitObjectLink)
    .where(
      and(
        eq(orbitObjectLink.organizationId, organizationId),
        eq(orbitObjectLink.originCaseId, caseId)
      )
    )
    .orderBy(desc(orbitObjectLink.createdAt));

  return rows.map((row) => ({
    id: row.id,
    organizationId: row.organizationId,
    originCaseId: row.originCaseId,
    pushEventId: row.pushEventId,
    targetType: row.targetType,
    targetId: row.targetId,
    payload: (row.payload ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt,
  }));
};
