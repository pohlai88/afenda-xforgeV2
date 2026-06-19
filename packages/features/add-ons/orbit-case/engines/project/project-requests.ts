import "server-only";

import { orbitProjectRequest } from "@repo/database";
import { createTwoFieldMorphLifecycleEngine } from "../morph/create-two-field-morph-lifecycle-engine";

const engine = createTwoFieldMorphLifecycleEngine({
  activitySegment: "project",
  fieldAKey: "startDate",
  fieldBKey: "budget",
  table: orbitProjectRequest,
});

export const getProjectRequestById = engine.getById;
export const listProjectRequestsForOrg = engine.listForOrg;
export const updateProjectRequestFields = engine.updateFields;
