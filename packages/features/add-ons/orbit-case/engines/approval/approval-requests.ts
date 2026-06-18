import "server-only";

import { database } from "@repo/database";
import { orbitApprovalRequest } from "@repo/database/schema";
import { and, desc, eq } from "drizzle-orm";
import type { OrbitApprovalRequestRecord } from "../../contract/orbit-case.types";

const mapApprovalRequestRow = (
  row: typeof orbitApprovalRequest.$inferSelect
): OrbitApprovalRequestRecord => ({
  amount: row.amount,
  approver: row.approver,
  createdAt: row.createdAt,
  createdBy: row.createdBy,
  id: row.id,
  organizationId: row.organizationId,
  originCaseId: row.originCaseId,
  title: row.title,
});

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
  limit = 200
): Promise<OrbitApprovalRequestRecord[]> => {
  const rows = await database
    .select()
    .from(orbitApprovalRequest)
    .where(eq(orbitApprovalRequest.organizationId, organizationId))
    .orderBy(desc(orbitApprovalRequest.createdAt))
    .limit(limit);

  return rows.map(mapApprovalRequestRow);
};
