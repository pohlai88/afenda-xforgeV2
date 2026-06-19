import { database, orbitComplaintRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";
import { morphLifecycleInsertDefaults } from "../morph-lifecycle-insert";

export const executeComplaintRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["category", "severity"],
  targetType: "complaint-request",
  insertRow: async (row) => {
    await database.insert(orbitComplaintRequest).values({
      ...morphLifecycleInsertDefaults(row.createdAt),
      category: row.fieldA,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      severity: row.fieldB,
      title: row.title,
    });
  },
});
