import { database, orbitLeadRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeLeadRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["contact", "company"],
  targetType: "lead-request",
  insertRow: async (row) => {
    await database.insert(orbitLeadRequest).values({
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
