/** Phase 3 morph destinations — hrefs only when `hasAppRoute` is true. */
export {
  ORBIT_APPROVAL_REQUEST_TARGET_TYPE,
  ORBIT_BUDGET_REQUEST_TARGET_TYPE,
  ORBIT_MEETING_REQUEST_TARGET_TYPE,
  ORBIT_MORPH_DESTINATIONS,
  ORBIT_MORPH_ROUTED_DESTINATIONS,
  resolveMorphSliceByDestinationId,
  resolveMorphSliceByTargetType,
} from "./morph-destination-manifest";
export type {
  OrbitMorphManifestSlice,
  OrbitMorphSegment,
  OrbitMorphTargetType,
} from "./morph-destination-manifest";
