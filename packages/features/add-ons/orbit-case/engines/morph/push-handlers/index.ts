import type { PushDestinationHandler } from "../push-types";
import { executeApprovalRequestPush } from "./approval-request";
import { executeBudgetRequestPush } from "./budget-request";
import { executeMeetingRequestPush } from "./meeting-request";
import {
  executeCapaRequestPush,
  executeComplaintRequestPush,
  executeContractReviewRequestPush,
  executeInvestigationRequestPush,
  executeLeadRequestPush,
  executeProjectRequestPush,
  executePurchaseRequestPush,
  executeRiskRequestPush,
} from "../remaining-morph-requests";

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
