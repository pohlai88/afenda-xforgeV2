import { database, orbitPurchaseRequest } from "@repo/database";
import { createMorphFieldPushHandler } from "../create-morph-field-push-handler";
import { morphLifecycleInsertDefaults } from "../morph-lifecycle-insert";

export const executePurchaseRequestPush = createMorphFieldPushHandler({
  fieldKeys: ["vendor", "amount", "poReference"],
  targetType: "purchase-request",
  insertRow: async (row) => {
    await database.insert(orbitPurchaseRequest).values({
      ...morphLifecycleInsertDefaults(row.createdAt),
      amount: row.fieldValues.amount,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      poReference: row.fieldValues.poReference,
      title: row.title,
      vendor: row.fieldValues.vendor,
    });
  },
});
