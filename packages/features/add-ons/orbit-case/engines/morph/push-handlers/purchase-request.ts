import { database, orbitPurchaseRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executePurchaseRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["vendor", "amount"],
  targetType: "purchase-request",
  insertRow: async (row) => {
    await database.insert(orbitPurchaseRequest).values({
      amount: row.fieldB,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
      vendor: row.fieldA,
    });
  },
});
