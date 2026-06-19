import "server-only";

import { orbitLeadRequest } from "@repo/database";
import { createTwoFieldMorphLifecycleEngine } from "../morph/create-two-field-morph-lifecycle-engine";

const engine = createTwoFieldMorphLifecycleEngine({
  activitySegment: "lead",
  fieldAKey: "contact",
  fieldBKey: "company",
  table: orbitLeadRequest,
});

export const getLeadRequestById = engine.getById;
export const listLeadRequestsForOrg = engine.listForOrg;
export const updateLeadRequestFields = engine.updateFields;
