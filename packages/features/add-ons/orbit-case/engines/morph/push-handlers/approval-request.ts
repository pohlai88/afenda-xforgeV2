import { database, orbitApprovalRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeApprovalRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["approver", "amount"],
  targetType: "approval-request",
  insertRow: async (row) => {
    await database.insert(orbitApprovalRequest).values({
      amount: row.fieldB,
      approver: row.fieldA,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
    });
  },
});
