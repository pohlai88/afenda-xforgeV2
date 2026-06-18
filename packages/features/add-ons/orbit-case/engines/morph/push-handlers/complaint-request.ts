import { database, orbitComplaintRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeComplaintRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["category", "severity"],
  targetType: "complaint-request",
  insertRow: async (row) => {
    await database.insert(orbitComplaintRequest).values({
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
