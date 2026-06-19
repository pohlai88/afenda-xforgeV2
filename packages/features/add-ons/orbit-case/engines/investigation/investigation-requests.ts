import "server-only";

import { orbitInvestigationRequest } from "@repo/database";
import { createTwoFieldMorphLifecycleEngine } from "../morph/create-two-field-morph-lifecycle-engine";

const engine = createTwoFieldMorphLifecycleEngine({
  activitySegment: "investigation",
  fieldAKey: "subject",
  fieldBKey: "priority",
  table: orbitInvestigationRequest,
});

export const getInvestigationRequestById = engine.getById;
export const listInvestigationRequestsForOrg = engine.listForOrg;
export const updateInvestigationRequestFields = engine.updateFields;
