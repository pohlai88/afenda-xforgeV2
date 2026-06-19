import "server-only";

import { database, orbitPurchaseRequest } from "@repo/database";
import { and, desc, eq } from "drizzle-orm";
import type { ListMorphLifecycleFilter } from "../../contract/morph-lifecycle.schema";
import type { OrbitPurchaseRequestRecord } from "../../contract/orbit-case.types";
import type { OrbitMorphStatus } from "../../contract/morph-status";
import {
  applyMorphLifecyclePatch,
  readMorphLifecycleCoreFields,
} from "../morph/read-morph-lifecycle-row";
import { recordMorphPilotActivity } from "../morph/record-morph-pilot-activity";

export interface OrbitPurchaseRequestUpdatePatch {
  amount?: string | null;
  assigneeId?: string | null;
  externalRefId?: string | null;
  poReference?: string | null;
  status?: OrbitMorphStatus;
  title?: string;
  vendor?: string | null;
}

const mapPurchaseRequestRow = (
  row: typeof orbitPurchaseRequest.$inferSelect
): OrbitPurchaseRequestRecord | null => {
  const core = readMorphLifecycleCoreFields(row);

  if (!core) {
    return null;
  }

  return {
    ...core,
    amount: row.amount,
    externalRefId: row.externalRefId,
    poReference: row.poReference,
    vendor: row.vendor,
  };
};

export const getPurchaseRequestById = async (
  organizationId: string,
  requestId: string
): Promise<OrbitPurchaseRequestRecord | null> => {
  const [row] = await database
    .select()
    .from(orbitPurchaseRequest)
    .where(
      and(
        eq(orbitPurchaseRequest.organizationId, organizationId),
        eq(orbitPurchaseRequest.id, requestId)
      )
    )
    .limit(1);

  return row ? mapPurchaseRequestRow(row) : null;
};

export const listPurchaseRequestsForOrg = async (
  organizationId: string,
  filters: ListMorphLifecycleFilter = {}
): Promise<OrbitPurchaseRequestRecord[]> => {
  const conditions = [eq(orbitPurchaseRequest.organizationId, organizationId)];

  if (filters.status) {
    conditions.push(eq(orbitPurchaseRequest.status, filters.status));
  }

  if (filters.assigneeId) {
    conditions.push(eq(orbitPurchaseRequest.assigneeId, filters.assigneeId));
  }

  const rows = await database
    .select()
    .from(orbitPurchaseRequest)
    .where(and(...conditions))
    .orderBy(desc(orbitPurchaseRequest.updatedAt))
    .limit(filters.limit ?? 200);

  return rows
    .map((row) => mapPurchaseRequestRow(row))
    .filter((record): record is OrbitPurchaseRequestRecord => record !== null);
};

export const updatePurchaseRequestFields = async (
  organizationId: string,
  actorId: string,
  requestId: string,
  patch: OrbitPurchaseRequestUpdatePatch
): Promise<OrbitPurchaseRequestRecord | null> => {
  const existing = await getPurchaseRequestById(organizationId, requestId);

  if (!existing) {
    return null;
  }

  const now = new Date();
  const updates: Partial<typeof orbitPurchaseRequest.$inferInsert> = {
    updatedAt: now,
  };

  applyMorphLifecyclePatch(updates, patch);

  if (patch.vendor !== undefined) {
    updates.vendor = patch.vendor;
  }

  if (patch.amount !== undefined) {
    updates.amount = patch.amount;
  }

  if (patch.poReference !== undefined) {
    updates.poReference = patch.poReference;
  }

  if (patch.externalRefId !== undefined) {
    updates.externalRefId = patch.externalRefId;
  }

  await database
    .update(orbitPurchaseRequest)
    .set(updates)
    .where(
      and(
        eq(orbitPurchaseRequest.id, requestId),
        eq(orbitPurchaseRequest.organizationId, organizationId)
      )
    );

  await recordMorphPilotActivity({
    activitySegment: "purchase",
    actorId,
    organizationId,
    originCaseId: existing.originCaseId,
    payload: patch,
    requestId,
  });

  return getPurchaseRequestById(organizationId, requestId);
};
