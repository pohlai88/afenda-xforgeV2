import { database, orbitContractReviewRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";
import { morphLifecycleInsertDefaults } from "../morph-lifecycle-insert";

export const executeContractReviewRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["counterparty", "expiryDate"],
  targetType: "contract-review-request",
  insertRow: async (row) => {
    await database.insert(orbitContractReviewRequest).values({
      ...morphLifecycleInsertDefaults(row.createdAt),
      counterparty: row.fieldA,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      expiryDate: row.fieldB,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
    });
  },
});
