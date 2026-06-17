import { z } from "zod";

export const ORBIT_CASE_BLOB_ACCESS = ["public", "private"] as const;

export type OrbitCaseBlobAccess = (typeof ORBIT_CASE_BLOB_ACCESS)[number];

export const orbitCaseBlobAccessSchema = z.enum(ORBIT_CASE_BLOB_ACCESS);

export const parseOrbitCaseBlobAccess = (
  value: string | null | undefined
): OrbitCaseBlobAccess => {
  const parsed = orbitCaseBlobAccessSchema.safeParse(value);
  return parsed.success ? parsed.data : "public";
};

export const isOrbitCasePrivateBlobAccess = (
  access: OrbitCaseBlobAccess
): boolean => access === "private";
