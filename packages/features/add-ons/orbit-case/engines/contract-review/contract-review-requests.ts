import "server-only";

import { orbitContractReviewRequest } from "@repo/database";
import { createTwoFieldMorphLifecycleEngine } from "../morph/create-two-field-morph-lifecycle-engine";

const engine = createTwoFieldMorphLifecycleEngine({
  activitySegment: "contract-review",
  fieldAKey: "counterparty",
  fieldBKey: "expiryDate",
  table: orbitContractReviewRequest,
});

export const getContractReviewRequestById = engine.getById;
export const listContractReviewRequestsForOrg = engine.listForOrg;
export const updateContractReviewRequestFields = engine.updateFields;
