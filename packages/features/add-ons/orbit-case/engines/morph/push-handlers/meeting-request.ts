import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { orbitMeetingRequest } from "@repo/database/schema";
import { ORBIT_MEETING_REQUEST_TARGET_TYPE } from "../../../contract/morph-target-types";
import type { ExecutePushInput } from "../../../contract/push.schema";
import type { ExecutePushContext, PushHandlerMeta } from "../push-types";

const readOptionalString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

export const executeMeetingRequestPush = async (
  context: ExecutePushContext,
  input: ExecutePushInput,
  meta: PushHandlerMeta
): Promise<{ targetId: string; targetType: string }> => {
  const title =
    typeof input.fieldValues.title === "string" && input.fieldValues.title
      ? input.fieldValues.title
      : meta.orbitCase.title;
  const scheduledAt = readOptionalString(input.fieldValues.scheduledAt);
  const location = readOptionalString(input.fieldValues.location);

  const meetingId = createId();
  const now = new Date();

  await database.insert(orbitMeetingRequest).values({
    createdAt: now,
    createdBy: context.actorId,
    id: meetingId,
    location,
    organizationId: context.organizationId,
    originCaseId: input.caseId,
    scheduledAt,
    title,
  });

  return {
    targetId: meetingId,
    targetType: ORBIT_MEETING_REQUEST_TARGET_TYPE,
  };
};
