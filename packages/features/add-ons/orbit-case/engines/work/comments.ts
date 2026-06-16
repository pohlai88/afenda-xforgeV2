import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { orbitCaseComment } from "@repo/database/schema";
import { and, desc, eq } from "drizzle-orm";
import type { OrbitCaseCommentRecord } from "../../contract/orbit-case.types";
import { recordOrbitCaseActivity } from "../activity/record-activity";

export const createOrbitCaseComment = async (
  organizationId: string,
  actorId: string,
  caseId: string,
  body: string
): Promise<OrbitCaseCommentRecord> => {
  const id = createId();
  const now = new Date();

  await database.insert(orbitCaseComment).values({
    id,
    caseId,
    organizationId,
    authorId: actorId,
    body,
    createdAt: now,
  });

  await recordOrbitCaseActivity({
    organizationId,
    caseId,
    actorId,
    action: "comment.created",
    payload: { commentId: id },
  });

  return {
    id,
    caseId,
    organizationId,
    authorId: actorId,
    body,
    createdAt: now,
  };
};

export const listOrbitCaseComments = async (
  organizationId: string,
  caseId: string
): Promise<OrbitCaseCommentRecord[]> => {
  const rows = await database
    .select()
    .from(orbitCaseComment)
    .where(
      and(
        eq(orbitCaseComment.caseId, caseId),
        eq(orbitCaseComment.organizationId, organizationId)
      )
    )
    .orderBy(desc(orbitCaseComment.createdAt));

  return rows.map((row) => ({
    id: row.id,
    caseId: row.caseId,
    organizationId: row.organizationId,
    authorId: row.authorId,
    body: row.body,
    createdAt: row.createdAt,
  }));
};
