import { database, orbitCapaRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";
import { morphLifecycleInsertDefaults } from "../morph-lifecycle-insert";

export const executeCapaRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["rootCause", "dueDate"],
  targetType: "capa-request",
  insertRow: async (row) => {
    await database.insert(orbitCapaRequest).values({
      ...morphLifecycleInsertDefaults(row.createdAt),
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      dueDate: row.fieldB,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      rootCause: row.fieldA,
      title: row.title,
    });
  },
});
