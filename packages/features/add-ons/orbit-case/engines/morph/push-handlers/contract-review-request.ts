import { database } from "@repo/database";
import { orbitContractReviewRequest } from "@repo/database/schema";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeContractReviewRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["counterparty", "expiryDate"],
  targetType: "contract-review-request",
  insertRow: async (row) => {
    await database.insert(orbitContractReviewRequest).values({
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
