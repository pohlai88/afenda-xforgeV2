import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { orbitBudgetRequest } from "@repo/database/schema";
import { ORBIT_BUDGET_REQUEST_TARGET_TYPE } from "../../../contract/morph-target-types";
import type { ExecutePushInput } from "../../../contract/push.schema";
import type { ExecutePushContext, PushHandlerMeta } from "../push-types";

export const executeBudgetRequestPush = async (
  context: ExecutePushContext,
  input: ExecutePushInput,
  meta: PushHandlerMeta
): Promise<{ targetId: string; targetType: string }> => {
  const title =
    typeof input.fieldValues.title === "string" && input.fieldValues.title
      ? input.fieldValues.title
      : meta.orbitCase.title;
  const amount =
    typeof input.fieldValues.amount === "string"
      ? input.fieldValues.amount
      : null;

  const budgetId = createId();
  const now = new Date();

  await database.insert(orbitBudgetRequest).values({
    amount,
    createdAt: now,
    createdBy: context.actorId,
    id: budgetId,
    organizationId: context.organizationId,
    originCaseId: input.caseId,
    title,
  });

  return {
    targetId: budgetId,
    targetType: ORBIT_BUDGET_REQUEST_TARGET_TYPE,
  };
};
