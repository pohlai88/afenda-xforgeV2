import type { OrbitMorphSegment } from "@repo/orbit-case";

export type { OrbitMorphSegment };

export type OrbitMorphListPageSearchParams = Promise<{
  assigneeId?: string;
  caseId?: string;
  status?: string;
}>;

export type OrbitMorphListPageProps = {
  searchParams: OrbitMorphListPageSearchParams;
};

export type OrbitBudgetListPageProps = {
  searchParams: OrbitMorphListPageSearchParams;
};

export type OrbitMorphRequestDetailPageParams = Promise<{ requestId: string }>;

export type OrbitMorphRequestDetailPageProps = {
  params: OrbitMorphRequestDetailPageParams;
};

export type OrbitBudgetDetailPageParams = Promise<{ budgetId: string }>;

export type OrbitBudgetDetailPageProps = {
  params: OrbitBudgetDetailPageParams;
};

export type OrbitMeetingDetailPageParams = Promise<{ meetingId: string }>;

export type OrbitMeetingDetailPageProps = {
  params: OrbitMeetingDetailPageParams;
};

export type OrbitApprovalDetailPageParams = Promise<{ approvalId: string }>;

export type OrbitApprovalDetailPageProps = {
  params: OrbitApprovalDetailPageParams;
};

/** Compile-time complete list of routed morph URL segments. */
export const ORBIT_MORPH_SEGMENTS = [
  "approval",
  "budget",
  "capa",
  "complaint",
  "contract-review",
  "investigation",
  "lead",
  "meeting",
  "project",
  "purchase",
  "risk",
] as const satisfies readonly OrbitMorphSegment[];

export const isOrbitMorphSegment = (value: string): value is OrbitMorphSegment =>
  ORBIT_MORPH_SEGMENTS.includes(value as OrbitMorphSegment);
