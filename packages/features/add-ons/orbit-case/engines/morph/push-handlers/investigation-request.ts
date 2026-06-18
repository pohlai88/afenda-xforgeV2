import { database, orbitInvestigationRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeInvestigationRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["subject", "priority"],
  targetType: "investigation-request",
  insertRow: async (row) => {
    await database.insert(orbitInvestigationRequest).values({
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      priority: row.fieldB,
      subject: row.fieldA,
      title: row.title,
    });
  },
});
