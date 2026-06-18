import type { PushDestinationHandler } from "../push-types";
import { executeApprovalRequestPush } from "./approval-request";
import { executeBudgetRequestPush } from "./budget-request";
import { executeCapaRequestPush } from "./capa-request";
import { executeComplaintRequestPush } from "./complaint-request";
import { executeContractReviewRequestPush } from "./contract-review-request";
import { executeInvestigationRequestPush } from "./investigation-request";
import { executeLeadRequestPush } from "./lead-request";
import { executeMeetingRequestPush } from "./meeting-request";
import { executeProjectRequestPush } from "./project-request";
import { executePurchaseRequestPush } from "./purchase-request";
import { executeRiskRequestPush } from "./risk-request";

const pushDestinationHandlers: Readonly<Record<string, PushDestinationHandler>> =
  {
    "approval-request": executeApprovalRequestPush,
    "budget-request": executeBudgetRequestPush,
    "capa-request": executeCapaRequestPush,
    "complaint-request": executeComplaintRequestPush,
    "contract-review-request": executeContractReviewRequestPush,
    "investigation-request": executeInvestigationRequestPush,
    "lead-request": executeLeadRequestPush,
    "meeting-request": executeMeetingRequestPush,
    "project-request": executeProjectRequestPush,
    "purchase-request": executePurchaseRequestPush,
    "risk-request": executeRiskRequestPush,
  };

export const resolvePushDestinationHandler = (
  destinationId: string
): PushDestinationHandler | null =>
  pushDestinationHandlers[destinationId] ?? null;
