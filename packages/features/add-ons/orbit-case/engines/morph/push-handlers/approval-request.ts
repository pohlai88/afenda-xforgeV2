import { database, orbitApprovalRequest } from "@repo/database";
import { createMorphFieldPushHandler } from "../create-morph-field-push-handler";
import { morphLifecycleInsertDefaults } from "../morph-lifecycle-insert";

export const executeApprovalRequestPush = createMorphFieldPushHandler({
  fieldKeys: ["approver", "amount", "dueDate", "decisionNotes"],
  targetType: "approval-request",
  insertRow: async (row) => {
    await database.insert(orbitApprovalRequest).values({
      ...morphLifecycleInsertDefaults(row.createdAt),
      amount: row.fieldValues.amount,
      approver: row.fieldValues.approver,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      decisionNotes: row.fieldValues.decisionNotes,
      dueDate: row.fieldValues.dueDate,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
    });
  },
});
