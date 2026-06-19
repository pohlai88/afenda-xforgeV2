import { database, orbitLeadRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";
import { morphLifecycleInsertDefaults } from "../morph-lifecycle-insert";

export const executeLeadRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["contact", "company"],
  targetType: "lead-request",
  insertRow: async (row) => {
    await database.insert(orbitLeadRequest).values({
      ...morphLifecycleInsertDefaults(row.createdAt),
      company: row.fieldB,
      contact: row.fieldA,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      title: row.title,
    });
  },
});
