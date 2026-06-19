import type { OrbitMorphStatus } from "./morph-status";

export {
  getMorphLifecycleFieldConfigs,
  resolveMorphLifecycleSegmentConfig,
  resolveMorphPilotSegmentConfig,
} from "./morph-lifecycle-ui";
export type {
  MorphLifecycleFieldConfig,
  MorphLifecycleSegmentConfig,
  MorphPilotSegment,
  MorphPilotSegmentConfig,
} from "./morph-lifecycle-ui";

export const ORBIT_MORPH_STATUS_LABELS: Record<OrbitMorphStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};
