import type { PushDestinationHandler } from "../push-types";
import { executeBudgetRequestPush } from "./budget-request";

const pushDestinationHandlers: Readonly<Record<string, PushDestinationHandler>> =
  {
    "budget-request": executeBudgetRequestPush,
  };

export const resolvePushDestinationHandler = (
  destinationId: string
): PushDestinationHandler | null =>
  pushDestinationHandlers[destinationId] ?? null;
