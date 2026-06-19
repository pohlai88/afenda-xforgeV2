import { z } from "zod";

export const ORBIT_MORPH_STATUSES = [
  "submitted",
  "in_review",
  "approved",
  "rejected",
  "cancelled",
] as const;

export type OrbitMorphStatus = (typeof ORBIT_MORPH_STATUSES)[number];

export const ORBIT_MORPH_DEFAULT_STATUS: OrbitMorphStatus = "submitted";

export const orbitMorphStatusSchema = z.enum(ORBIT_MORPH_STATUSES);

export const parseOrbitMorphStatus = (
  value: unknown
): OrbitMorphStatus | null => {
  const parsed = orbitMorphStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
};
