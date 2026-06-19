import { z } from "zod";
import { orbitMorphStatusSchema } from "./morph-status";

/** JSON-safe morph handoff payload for webhooks and ERP consumers (Phase 5E). */
export const orbitMorphTargetSummarySchema = z.object({
  externalRefId: z.string().min(1).nullable().optional(),
  segment: z.string().min(1),
  status: orbitMorphStatusSchema,
  targetId: z.string().min(1),
  targetType: z.string().min(1),
  title: z.string().min(1),
  values: z.record(z.string(), z.string().nullable()),
});

export type OrbitMorphTargetSummary = z.infer<
  typeof orbitMorphTargetSummarySchema
>;

export const buildOrbitMorphTargetSummary = (
  input: OrbitMorphTargetSummary
): OrbitMorphTargetSummary => orbitMorphTargetSummarySchema.parse(input);
