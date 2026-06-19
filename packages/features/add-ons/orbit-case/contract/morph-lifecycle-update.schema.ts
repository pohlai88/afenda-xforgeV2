import { z } from "zod";
import { ORBIT_MORPH_ROUTED_SLICES } from "./morph-destination-manifest";
import {
  listMorphLifecycleFilterSchema,
  morphLifecyclePatchSchema,
} from "./morph-lifecycle.schema";

const morphLifecycleSegmentSchema = z.enum(
  ORBIT_MORPH_ROUTED_SLICES.map((slice) => slice.segment) as [
    (typeof ORBIT_MORPH_ROUTED_SLICES)[number]["segment"],
    ...(typeof ORBIT_MORPH_ROUTED_SLICES)[number]["segment"][],
  ]
);

export const updateMorphLifecycleRequestSchema = morphLifecyclePatchSchema.extend({
  requestId: z.string().min(1),
  segment: morphLifecycleSegmentSchema,
  values: z.record(z.string(), z.string().nullable()).optional(),
});

export type UpdateMorphLifecycleRequestInput = z.infer<
  typeof updateMorphLifecycleRequestSchema
>;

export const listMorphLifecycleRequestsFilterSchema =
  listMorphLifecycleFilterSchema;

export type ListMorphLifecycleRequestsFilter = z.infer<
  typeof listMorphLifecycleRequestsFilterSchema
>;

/** @deprecated Use listMorphLifecycleRequestsFilterSchema */
export const listBudgetRequestsFilterSchema = listMorphLifecycleFilterSchema;
export type ListBudgetRequestsFilter = ListMorphLifecycleRequestsFilter;

/** @deprecated Use updateMorphLifecycleRequestSchema */
export const updateBudgetRequestSchema = updateMorphLifecycleRequestSchema;
export type UpdateBudgetRequestInput = UpdateMorphLifecycleRequestInput;

/** @deprecated Use listMorphLifecycleRequestsFilterSchema */
export const listApprovalRequestsFilterSchema = listMorphLifecycleFilterSchema;
export type ListApprovalRequestsFilter = ListMorphLifecycleRequestsFilter;

/** @deprecated Use updateMorphLifecycleRequestSchema */
export const updateApprovalRequestSchema = updateMorphLifecycleRequestSchema;
export type UpdateApprovalRequestInput = UpdateMorphLifecycleRequestInput;

/** @deprecated Use listMorphLifecycleRequestsFilterSchema */
export const listPurchaseRequestsFilterSchema = listMorphLifecycleFilterSchema;
export type ListPurchaseRequestsFilter = ListMorphLifecycleRequestsFilter;

/** @deprecated Use updateMorphLifecycleRequestSchema */
export const updatePurchaseRequestSchema = updateMorphLifecycleRequestSchema;
export type UpdatePurchaseRequestInput = UpdateMorphLifecycleRequestInput;

/** @deprecated Use updateMorphLifecycleRequestSchema */
export const updateMorphPilotRequestSchema = updateMorphLifecycleRequestSchema;
export type UpdateMorphPilotRequestInput = UpdateMorphLifecycleRequestInput;
