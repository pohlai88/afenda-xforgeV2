import type { OrbitMorphSegment } from "./morph-destination-manifest";
import type { OrbitMorphStatus } from "./morph-status";

export interface MorphLifecycleCoreRecord {
  assigneeId: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitMorphLifecycleRequestDto = Omit<
  MorphLifecycleCoreRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  values: Record<string, string | null>;
};

export const MORPH_LIFECYCLE_DETAIL_PARAM_KEYS = {
  approval: "approvalId",
  budget: "budgetId",
  capa: "requestId",
  complaint: "requestId",
  "contract-review": "requestId",
  investigation: "requestId",
  lead: "requestId",
  meeting: "meetingId",
  project: "requestId",
  purchase: "requestId",
  risk: "requestId",
} as const satisfies Record<OrbitMorphSegment, string>;

export type MorphLifecycleSegment = OrbitMorphSegment;
