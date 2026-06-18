import { ORBIT_MORPH_DESTINATION_MANIFEST } from "./morph-destination-manifest";
import type { OrbitMorphManifestSlice } from "./morph-destination-manifest";

export interface OrbitMorphRequestRecord {
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  title: string;
  values: Record<string, string | null>;
}

export type OrbitMorphRequestDto = Omit<OrbitMorphRequestRecord, "createdAt"> & {
  createdAt: string;
};

export const listRoutedMorphSlices = (): OrbitMorphManifestSlice[] =>
  ORBIT_MORPH_DESTINATION_MANIFEST.filter((slice) => slice.hasAppRoute);

export const resolveRoutedMorphSliceBySegment = (
  segment: string
): OrbitMorphManifestSlice | null =>
  ORBIT_MORPH_DESTINATION_MANIFEST.find(
    (slice) => slice.hasAppRoute && slice.segment === segment
  ) ?? null;

export const toOrbitMorphRequestDto = (
  record: OrbitMorphRequestRecord
): OrbitMorphRequestDto => ({
  ...record,
  createdAt: record.createdAt.toISOString(),
});

export const readMorphRequestFieldValue = (
  dto: OrbitMorphRequestDto,
  key: string
): string | null => {
  const value = dto.values[key];
  return typeof value === "string" && value.length > 0 ? value : null;
};
