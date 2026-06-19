import { database, orbitBudgetRequest } from "@repo/database";
import { createMorphFieldPushHandler } from "../create-morph-field-push-handler";
import { morphLifecycleInsertDefaults } from "../morph-lifecycle-insert";

export const executeBudgetRequestPush = createMorphFieldPushHandler({
  fieldKeys: ["amount", "currency", "costCenter", "justification"],
  targetType: "budget-request",
  insertRow: async (row) => {
    await database.insert(orbitBudgetRequest).values({
      ...morphLifecycleInsertDefaults(row.createdAt),
      amount: row.fieldValues.amount,
      costCenter: row.fieldValues.costCenter,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      currency: row.fieldValues.currency,
      id: row.id,
      justification: row.fieldValues.justification,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
    });
  },
});
