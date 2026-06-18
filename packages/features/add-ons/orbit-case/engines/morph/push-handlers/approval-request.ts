import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { orbitApprovalRequest } from "@repo/database/schema";
import { ORBIT_APPROVAL_REQUEST_TARGET_TYPE } from "../../../contract/morph-target-types";
import type { ExecutePushInput } from "../../../contract/push.schema";
import type { ExecutePushContext, PushHandlerMeta } from "../push-types";

const readOptionalString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

export const executeApprovalRequestPush = async (
  context: ExecutePushContext,
  input: ExecutePushInput,
  meta: PushHandlerMeta
): Promise<{ targetId: string; targetType: string }> => {
  const title =
    typeof input.fieldValues.title === "string" && input.fieldValues.title
      ? input.fieldValues.title
      : meta.orbitCase.title;
  const approver = readOptionalString(input.fieldValues.approver);
  const amount = readOptionalString(input.fieldValues.amount);

  const approvalId = createId();
  const now = new Date();

  await database.insert(orbitApprovalRequest).values({
    amount,
    approver,
    createdAt: now,
    createdBy: context.actorId,
    id: approvalId,
    organizationId: context.organizationId,
    originCaseId: input.caseId,
    title,
  });

  return {
    targetId: approvalId,
    targetType: ORBIT_APPROVAL_REQUEST_TARGET_TYPE,
  };
};
