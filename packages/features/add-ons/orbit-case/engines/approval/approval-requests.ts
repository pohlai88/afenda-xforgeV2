import "server-only";

import { database, orbitApprovalRequest } from "@repo/database";
import { and, desc, eq } from "drizzle-orm";
import type { ListMorphLifecycleFilter } from "../../contract/morph-lifecycle.schema";
import type { OrbitApprovalRequestRecord } from "../../contract/orbit-case.types";
import type { OrbitMorphStatus } from "../../contract/morph-status";
import {
  applyMorphLifecyclePatch,
  readMorphLifecycleCoreFields,
} from "../morph/read-morph-lifecycle-row";
import { recordMorphPilotActivity } from "../morph/record-morph-pilot-activity";

export interface OrbitApprovalRequestUpdatePatch {
  amount?: string | null;
  approver?: string | null;
  assigneeId?: string | null;
  decisionNotes?: string | null;
  dueDate?: string | null;
  externalRefId?: string | null;
  status?: OrbitMorphStatus;
  title?: string;
}

const mapApprovalRequestRow = (
  row: typeof orbitApprovalRequest.$inferSelect
): OrbitApprovalRequestRecord | null => {
  const core = readMorphLifecycleCoreFields(row);

  if (!core) {
    return null;
  }

  return {
    ...core,
    amount: row.amount,
    approver: row.approver,
    decisionNotes: row.decisionNotes,
    dueDate: row.dueDate,
    externalRefId: row.externalRefId,
  };
};

export const getApprovalRequestById = async (
  organizationId: string,
  approvalId: string
): Promise<OrbitApprovalRequestRecord | null> => {
  const [row] = await database
    .select()
    .from(orbitApprovalRequest)
    .where(
      and(
        eq(orbitApprovalRequest.organizationId, organizationId),
        eq(orbitApprovalRequest.id, approvalId)
      )
    )
    .limit(1);

  return row ? mapApprovalRequestRow(row) : null;
};

export const listApprovalRequestsForOrg = async (
  organizationId: string,
  filters: ListMorphLifecycleFilter = {}
): Promise<OrbitApprovalRequestRecord[]> => {
  const conditions = [eq(orbitApprovalRequest.organizationId, organizationId)];

  if (filters.status) {
    conditions.push(eq(orbitApprovalRequest.status, filters.status));
  }

  if (filters.assigneeId) {
    conditions.push(eq(orbitApprovalRequest.assigneeId, filters.assigneeId));
  }

  const rows = await database
    .select()
    .from(orbitApprovalRequest)
    .where(and(...conditions))
    .orderBy(desc(orbitApprovalRequest.updatedAt))
    .limit(filters.limit ?? 200);

  return rows
    .map((row) => mapApprovalRequestRow(row))
    .filter((record): record is OrbitApprovalRequestRecord => record !== null);
};

export const updateApprovalRequestFields = async (
  organizationId: string,
  actorId: string,
  approvalId: string,
  patch: OrbitApprovalRequestUpdatePatch
): Promise<OrbitApprovalRequestRecord | null> => {
  const existing = await getApprovalRequestById(organizationId, approvalId);

  if (!existing) {
    return null;
  }

  const now = new Date();
  const updates: Partial<typeof orbitApprovalRequest.$inferInsert> = {
    updatedAt: now,
  };

  applyMorphLifecyclePatch(updates, patch);

  if (patch.amount !== undefined) {
    updates.amount = patch.amount;
  }

  if (patch.approver !== undefined) {
    updates.approver = patch.approver;
  }

  if (patch.dueDate !== undefined) {
    updates.dueDate = patch.dueDate;
  }

  if (patch.decisionNotes !== undefined) {
    updates.decisionNotes = patch.decisionNotes;
  }

  if (patch.externalRefId !== undefined) {
    updates.externalRefId = patch.externalRefId;
  }

  await database
    .update(orbitApprovalRequest)
    .set(updates)
    .where(
      and(
        eq(orbitApprovalRequest.id, approvalId),
        eq(orbitApprovalRequest.organizationId, organizationId)
      )
    );

  await recordMorphPilotActivity({
    activitySegment: "approval",
    actorId,
    organizationId,
    originCaseId: existing.originCaseId,
    payload: patch,
    requestId: approvalId,
  });

  return getApprovalRequestById(organizationId, approvalId);
};
