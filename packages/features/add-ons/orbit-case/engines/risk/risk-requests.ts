import "server-only";

import { orbitRiskRequest } from "@repo/database";
import { createTwoFieldMorphLifecycleEngine } from "../morph/create-two-field-morph-lifecycle-engine";

const engine = createTwoFieldMorphLifecycleEngine({
  activitySegment: "risk",
  fieldAKey: "riskLevel",
  fieldBKey: "owner",
  table: orbitRiskRequest,
});

export const getRiskRequestById = engine.getById;
export const listRiskRequestsForOrg = engine.listForOrg;
export const updateRiskRequestFields = engine.updateFields;
