import { database, orbitRiskRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";
import { morphLifecycleInsertDefaults } from "../morph-lifecycle-insert";

export const executeRiskRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["riskLevel", "owner"],
  targetType: "risk-request",
  insertRow: async (row) => {
    await database.insert(orbitRiskRequest).values({
      ...morphLifecycleInsertDefaults(row.createdAt),
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
