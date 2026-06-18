import { database, orbitBudgetRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeBudgetRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["amount"],
  targetType: "budget-request",
  insertRow: async (row) => {
    await database.insert(orbitBudgetRequest).values({
      amount: row.fieldA,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
    });
  },
});
