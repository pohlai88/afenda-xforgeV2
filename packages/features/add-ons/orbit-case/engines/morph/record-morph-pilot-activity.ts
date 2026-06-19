import "server-only";

import { toJsonSafeActivityPayload } from "../../contract/serialize";
import type { MorphLifecycleSegment } from "../../contract/morph-lifecycle.types";
import { recordOrbitCaseActivity } from "../activity/record-activity";

export const recordMorphPilotActivity = async (input: {
  activitySegment: MorphLifecycleSegment;
  actorId: string;
  organizationId: string;
  originCaseId: string;
  payload: object;
  requestId: string;
}): Promise<void> => {
  await recordOrbitCaseActivity({
    organizationId: input.organizationId,
    caseId: input.originCaseId,
    actorId: input.actorId,
    action: `morph.${input.activitySegment}.updated`,
    payload: toJsonSafeActivityPayload({
      [`${input.activitySegment}Id`]: input.requestId,
      requestId: input.requestId,
      ...input.payload,
    }),
  });
};
