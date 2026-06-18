import { database } from "@repo/database";
import { orbitProjectRequest } from "@repo/database/schema";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeProjectRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["startDate", "budget"],
  targetType: "project-request",
  insertRow: async (row) => {
    await database.insert(orbitProjectRequest).values({
      budget: row.fieldB,
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      startDate: row.fieldA,
      title: row.title,
    });
  },
});
