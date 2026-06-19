import "server-only";

import { orbitComplaintRequest } from "@repo/database";
import { createTwoFieldMorphLifecycleEngine } from "../morph/create-two-field-morph-lifecycle-engine";

const engine = createTwoFieldMorphLifecycleEngine({
  activitySegment: "complaint",
  fieldAKey: "category",
  fieldBKey: "severity",
  table: orbitComplaintRequest,
});

export const getComplaintRequestById = engine.getById;
export const listComplaintRequestsForOrg = engine.listForOrg;
export const updateComplaintRequestFields = engine.updateFields;
