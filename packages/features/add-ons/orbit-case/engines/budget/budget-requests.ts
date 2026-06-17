import "server-only";

import { database } from "@repo/database";
import { orbitBudgetRequest } from "@repo/database/schema";
import { and, desc, eq } from "drizzle-orm";
import type { OrbitBudgetRequestRecord } from "../../contract/orbit-case.types";

const mapBudgetRequestRow = (
  row: typeof orbitBudgetRequest.$inferSelect
): OrbitBudgetRequestRecord => ({
  amount: row.amount,
  createdAt: row.createdAt,
  createdBy: row.createdBy,
  id: row.id,
  organizationId: row.organizationId,
  originCaseId: row.originCaseId,
  title: row.title,
});

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
  limit = 200
): Promise<OrbitBudgetRequestRecord[]> => {
  const rows = await database
    .select()
    .from(orbitBudgetRequest)
    .where(eq(orbitBudgetRequest.organizationId, organizationId))
    .orderBy(desc(orbitBudgetRequest.createdAt))
    .limit(limit);

  return rows.map(mapBudgetRequestRow);
};
