import { z } from "zod";
import { orbitMorphStatusSchema } from "./morph-status";

export const listMorphLifecycleFilterSchema = z.object({
  assigneeId: z.string().min(1).optional(),
  limit: z.number().int().positive().max(200).optional(),
  status: orbitMorphStatusSchema.optional(),
});

export type ListMorphLifecycleFilter = z.infer<
  typeof listMorphLifecycleFilterSchema
>;

export const morphLifecyclePatchSchema = z.object({
  assigneeId: z.string().min(1).nullable().optional(),
  status: orbitMorphStatusSchema.optional(),
  title: z.string().trim().min(1).max(200).optional(),
});

export type MorphLifecyclePatch = z.infer<typeof morphLifecyclePatchSchema>;
