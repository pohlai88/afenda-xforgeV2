import { database, orbitMeetingRequest } from "@repo/database";
import { createTwoFieldMorphPushHandler } from "../create-two-field-morph-push-handler";

export const executeMeetingRequestPush = createTwoFieldMorphPushHandler({
  fieldKeys: ["scheduledAt", "location"],
  targetType: "meeting-request",
  insertRow: async (row) => {
    await database.insert(orbitMeetingRequest).values({
      createdAt: row.createdAt,
      createdBy: row.createdBy,
      id: row.id,
      location: row.fieldB,
      organizationId: row.organizationId,
      originCaseId: row.originCaseId,
      scheduledAt: row.fieldA,
      title: row.title,
    });
  },
});
