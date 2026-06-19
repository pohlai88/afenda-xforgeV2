import { z } from "zod";

/** Idempotent ERP inbound sync contract (Phase 5E). */
export const syncMorphExternalStatusSchema = z.object({
  externalRefId: z.string().trim().min(1),
  segment: z.enum(["approval", "budget", "purchase"]),
  status: z.enum([
    "submitted",
    "in_review",
    "approved",
    "rejected",
    "cancelled",
  ]),
});

export type SyncMorphExternalStatusInput = z.infer<
  typeof syncMorphExternalStatusSchema
>;
