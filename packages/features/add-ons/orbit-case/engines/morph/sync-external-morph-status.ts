import "server-only";

import { database, orbitApprovalRequest, orbitBudgetRequest, orbitPurchaseRequest } from "@repo/database";
import { and, eq } from "drizzle-orm";
import type { SyncMorphExternalStatusInput } from "../../contract/morph-sync.schema";
import type { OrbitMorphStatus } from "../../contract/morph-status";
import { recordMorphPilotActivity } from "../morph/record-morph-pilot-activity";

const PILOT_TABLES = {
  approval: orbitApprovalRequest,
  budget: orbitBudgetRequest,
  purchase: orbitPurchaseRequest,
} as const;

export const syncMorphExternalStatus = async (
  organizationId: string,
  actorId: string,
  input: SyncMorphExternalStatusInput
): Promise<{ originCaseId: string; requestId: string; status: OrbitMorphStatus } | null> => {
  const table = PILOT_TABLES[input.segment];

  const [row] = await database
    .select({ id: table.id, originCaseId: table.originCaseId })
    .from(table)
    .where(
      and(
        eq(table.organizationId, organizationId),
        eq(table.externalRefId, input.externalRefId)
      )
    )
    .limit(1);

  if (!row) {
    return null;
  }

  const now = new Date();

  await database
    .update(table)
    .set({
      status: input.status,
      updatedAt: now,
    })
    .where(
      and(eq(table.id, row.id), eq(table.organizationId, organizationId))
    );

  await recordMorphPilotActivity({
    activitySegment: input.segment,
    actorId,
    organizationId,
    originCaseId: row.originCaseId,
    payload: {
      externalRefId: input.externalRefId,
      status: input.status,
      source: "external-sync",
    },
    requestId: row.id,
  });

  return {
    originCaseId: row.originCaseId,
    requestId: row.id,
    status: input.status,
  };
};
