import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { database, orbitCaseActivity } from "@repo/database";

export const recordOrbitCaseActivity = async (input: {
  organizationId: string;
  caseId: string;
  actorId: string;
  action: string;
  payload: Record<string, unknown>;
}): Promise<void> => {
  await database.insert(orbitCaseActivity).values({
    id: createId(),
    caseId: input.caseId,
    organizationId: input.organizationId,
    actorId: input.actorId,
    action: input.action,
    payload: input.payload,
    createdAt: new Date(),
  });
};
