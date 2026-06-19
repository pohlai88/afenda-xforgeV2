import "server-only";

import { orbitCapaRequest } from "@repo/database";
import { createTwoFieldMorphLifecycleEngine } from "../morph/create-two-field-morph-lifecycle-engine";

const engine = createTwoFieldMorphLifecycleEngine({
  activitySegment: "capa",
  fieldAKey: "rootCause",
  fieldBKey: "dueDate",
  table: orbitCapaRequest,
});

export const getCapaRequestById = engine.getById;
export const listCapaRequestsForOrg = engine.listForOrg;
export const updateCapaRequestFields = engine.updateFields;
