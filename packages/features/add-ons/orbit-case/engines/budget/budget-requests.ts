import "server-only";

import { database, orbitBudgetRequest } from "@repo/database";
import { and, desc, eq } from "drizzle-orm";
import type { ListMorphLifecycleFilter } from "../../contract/morph-lifecycle.schema";
import type { OrbitBudgetRequestRecord } from "../../contract/orbit-case.types";
import type { OrbitMorphStatus } from "../../contract/morph-status";
import {
  applyMorphLifecyclePatch,
  readMorphLifecycleCoreFields,
} from "../morph/read-morph-lifecycle-row";
import { recordMorphPilotActivity } from "../morph/record-morph-pilot-activity";

export interface OrbitBudgetRequestUpdatePatch {
  amount?: string | null;
  assigneeId?: string | null;
  costCenter?: string | null;
  currency?: string | null;
  externalRefId?: string | null;
  justification?: string | null;
  status?: OrbitMorphStatus;
  title?: string;
}

const mapBudgetRequestRow = (
  row: typeof orbitBudgetRequest.$inferSelect
): OrbitBudgetRequestRecord | null => {
  const core = readMorphLifecycleCoreFields(row);

  if (!core) {
    return null;
  }

  return {
    ...core,
    amount: row.amount,
    costCenter: row.costCenter,
    currency: row.currency,
    externalRefId: row.externalRefId,
    justification: row.justification,
  };
};

export const getBudgetRequestById = async (
  organizationId: string,
  budgetId: string
): Promise<OrbitBudgetRequestRecord | null> => {
  const [row] = await database
    .select()
    .from(orbitBudgetRequest)
    .where(
      and(
        eq(orbitBudgetRequest.organizationId, organizationId),
        eq(orbitBudgetRequest.id, budgetId)
      )
    )
    .limit(1);

  return row ? mapBudgetRequestRow(row) : null;
};

export const listBudgetRequestsForOrg = async (
  organizationId: string,
  filters: ListMorphLifecycleFilter = {}
): Promise<OrbitBudgetRequestRecord[]> => {
  const conditions = [eq(orbitBudgetRequest.organizationId, organizationId)];

  if (filters.status) {
    conditions.push(eq(orbitBudgetRequest.status, filters.status));
  }

  if (filters.assigneeId) {
    conditions.push(eq(orbitBudgetRequest.assigneeId, filters.assigneeId));
  }

  const rows = await database
    .select()
    .from(orbitBudgetRequest)
    .where(and(...conditions))
    .orderBy(desc(orbitBudgetRequest.updatedAt))
    .limit(filters.limit ?? 200);

  return rows
    .map((row) => mapBudgetRequestRow(row))
    .filter((record): record is OrbitBudgetRequestRecord => record !== null);
};

const applyBudgetFieldPatch = (
  updates: Partial<typeof orbitBudgetRequest.$inferInsert>,
  patch: OrbitBudgetRequestUpdatePatch
) => {
  if (patch.amount !== undefined) {
    updates.amount = patch.amount;
  }

  if (patch.currency !== undefined) {
    updates.currency = patch.currency;
  }

  if (patch.costCenter !== undefined) {
    updates.costCenter = patch.costCenter;
  }

  if (patch.justification !== undefined) {
    updates.justification = patch.justification;
  }

  if (patch.externalRefId !== undefined) {
    updates.externalRefId = patch.externalRefId;
  }
};

export const updateBudgetRequestFields = async (
  organizationId: string,
  actorId: string,
  budgetId: string,
  patch: OrbitBudgetRequestUpdatePatch
): Promise<OrbitBudgetRequestRecord | null> => {
  const existing = await getBudgetRequestById(organizationId, budgetId);

  if (!existing) {
    return null;
  }

  const now = new Date();
  const updates: Partial<typeof orbitBudgetRequest.$inferInsert> = {
    updatedAt: now,
  };

  applyMorphLifecyclePatch(updates, patch);
  applyBudgetFieldPatch(updates, patch);

  await database
    .update(orbitBudgetRequest)
    .set(updates)
    .where(
      and(
        eq(orbitBudgetRequest.id, budgetId),
        eq(orbitBudgetRequest.organizationId, organizationId)
      )
    );

  await recordMorphPilotActivity({
    activitySegment: "budget",
    actorId,
    organizationId,
    originCaseId: existing.originCaseId,
    payload: patch,
    requestId: budgetId,
  });

  return getBudgetRequestById(organizationId, budgetId);
};
