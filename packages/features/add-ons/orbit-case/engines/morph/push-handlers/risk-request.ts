import { database } from "@repo/database";
import { orbitRiskRequest } from "@repo/database/schema";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeRiskRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["riskLevel", "owner"],
  targetType: "risk-request",
  insertRow: async (row) => {
    await database.insert(orbitRiskRequest).values({
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      owner: row.fieldB,
      riskLevel: row.fieldA,
      title: row.title,
    });
  },
});
