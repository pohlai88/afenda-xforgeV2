import type { OrbitCaseBlobAccess } from "./blob-access";
import type { OrbitCasePriority, OrbitCaseStatus } from "./status";

/** Server-side row mapped from Drizzle (non-serializable Date fields). */
export interface OrbitCaseRecord {
  assigneeId: string | null;
  createdAt: Date;
  createdBy: string;
  description: string | null;
  dueAt: Date | null;
  id: string;
  organizationId: string;
  ownerId: string | null;
  priority: OrbitCasePriority;
  softDeletedAt: Date | null;
  status: OrbitCaseStatus;
  tags: string[];
  title: string;
  updatedAt: Date;
}

/** Boundary-safe contract for Server Actions, RSC props, and client state. */
export interface OrbitCaseDto {
  assigneeId: string | null;
  createdAt: string;
  createdBy: string;
  description: string | null;
  dueAt: string | null;
  id: string;
  organizationId: string;
  ownerId: string | null;
  priority: OrbitCasePriority;
  softDeletedAt: string | null;
  status: OrbitCaseStatus;
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface OrbitCaseCommentRecord {
  authorId: string;
  body: string;
  caseId: string;
  createdAt: Date;
  id: string;
  organizationId: string;
}

export type OrbitCaseCommentDto = Omit<OrbitCaseCommentRecord, "createdAt"> & {
  createdAt: string;
};

export interface OrbitCaseAttachmentRecord {
  blobAccess: OrbitCaseBlobAccess;
  blobPathname: string;
  blobUrl: string;
  caseId: string;
  contentType: string;
  createdAt: Date;
  fileName: string;
  id: string;
  organizationId: string;
  sizeBytes: number;
  uploadedBy: string;
}

export type OrbitCaseAttachmentDto = Omit<
  OrbitCaseAttachmentRecord,
  "createdAt"
> & {
  createdAt: string;
};

export interface OrbitCaseActivityRecord {
  action: string;
  actorId: string;
  caseId: string;
  createdAt: Date;
  id: string;
  organizationId: string;
  payload: Record<string, unknown>;
}

export type OrbitCaseActivityDto = Omit<OrbitCaseActivityRecord, "createdAt"> & {
  createdAt: string;
  summary: string;
};

export interface OrbitObjectLinkRecord {
  createdAt: Date;
  id: string;
  organizationId: string;
  originCaseId: string;
  payload: Record<string, unknown>;
  pushEventId: string;
  targetId: string;
  targetType: string;
}

export type OrbitObjectLinkDto = Omit<OrbitObjectLinkRecord, "createdAt"> & {
  createdAt: string;
};

export interface OrbitObjectLinkProjectionDto {
  createdAt: string;
  href: string | null;
  id: string;
  label: string;
  targetId: string;
  targetType: string;
}

export interface OrbitBudgetRequestRecord {
  amount: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  title: string;
}

export type OrbitBudgetRequestDto = Omit<OrbitBudgetRequestRecord, "createdAt"> & {
  createdAt: string;
};

export interface OrbitMeetingRequestRecord {
  createdAt: Date;
  createdBy: string;
  id: string;
  location: string | null;
  organizationId: string;
  originCaseId: string;
  scheduledAt: string | null;
  title: string;
}

export type OrbitMeetingRequestDto = Omit<
  OrbitMeetingRequestRecord,
  "createdAt"
> & {
  createdAt: string;
};

export interface OrbitApprovalRequestRecord {
  amount: string | null;
  approver: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  title: string;
}

export type OrbitApprovalRequestDto = Omit<
  OrbitApprovalRequestRecord,
  "createdAt"
> & {
  createdAt: string;
};

export interface OrbitPurchaseRequestRecord {
  amount: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  title: string;
  vendor: string | null;
}

export type OrbitPurchaseRequestDto = Omit<
  OrbitPurchaseRequestRecord,
  "createdAt"
> & {
  createdAt: string;
};

export interface OrbitLeadRequestRecord {
  company: string | null;
  contact: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  title: string;
}

export type OrbitLeadRequestDto = Omit<OrbitLeadRequestRecord, "createdAt"> & {
  createdAt: string;
};

export interface OrbitComplaintRequestRecord {
  category: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  severity: string | null;
  title: string;
}

export type OrbitComplaintRequestDto = Omit<
  OrbitComplaintRequestRecord,
  "createdAt"
> & {
  createdAt: string;
};

export interface OrbitRiskRequestRecord {
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  owner: string | null;
  riskLevel: string | null;
  title: string;
}

export type OrbitRiskRequestDto = Omit<OrbitRiskRequestRecord, "createdAt"> & {
  createdAt: string;
};

export interface OrbitProjectRequestRecord {
  budget: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  startDate: string | null;
  title: string;
}

export type OrbitProjectRequestDto = Omit<
  OrbitProjectRequestRecord,
  "createdAt"
> & {
  createdAt: string;
};

export interface OrbitInvestigationRequestRecord {
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  priority: string | null;
  subject: string | null;
  title: string;
}

export type OrbitInvestigationRequestDto = Omit<
  OrbitInvestigationRequestRecord,
  "createdAt"
> & {
  createdAt: string;
};

export interface OrbitCapaRequestRecord {
  createdAt: Date;
  createdBy: string;
  dueDate: string | null;
  id: string;
  organizationId: string;
  originCaseId: string;
  rootCause: string | null;
  title: string;
}

export type OrbitCapaRequestDto = Omit<OrbitCapaRequestRecord, "createdAt"> & {
  createdAt: string;
};

export interface OrbitContractReviewRequestRecord {
  counterparty: string | null;
  createdAt: Date;
  createdBy: string;
  expiryDate: string | null;
  id: string;
  organizationId: string;
  originCaseId: string;
  title: string;
}

export type OrbitContractReviewRequestDto = Omit<
  OrbitContractReviewRequestRecord,
  "createdAt"
> & {
  createdAt: string;
};

export interface OrbitCaseBoardColumn {
  cases: OrbitCaseRecord[];
  status: OrbitCaseStatus;
}

export interface OrbitCaseBoardResult {
  columns: OrbitCaseBoardColumn[];
}

export interface OrbitCaseBoardColumnDto {
  cases: OrbitCaseDto[];
  status: OrbitCaseStatus;
}

export interface OrbitCaseBoardDto {
  columns: OrbitCaseBoardColumnDto[];
}

export interface OrbitCaseCalendarDay {
  cases: OrbitCaseRecord[];
  date: string;
}

export interface OrbitCaseCalendarResult {
  days: OrbitCaseCalendarDay[];
  month: string;
}

export interface OrbitCaseCalendarDayDto {
  cases: OrbitCaseDto[];
  date: string;
}

export interface OrbitCaseCalendarDto {
  days: OrbitCaseCalendarDayDto[];
  month: string;
}

export type OrbitCaseTimelineBucket =
  | "later"
  | "no_due_date"
  | "overdue"
  | "this_week"
  | "today";

export interface OrbitCaseTimelineGroup {
  bucket: OrbitCaseTimelineBucket;
  cases: OrbitCaseRecord[];
  label: string;
}

export interface OrbitCaseTimelineResult {
  groups: OrbitCaseTimelineGroup[];
}

export interface OrbitCaseTimelineGroupDto {
  bucket: OrbitCaseTimelineBucket;
  cases: OrbitCaseDto[];
  label: string;
}

export interface OrbitCaseTimelineDto {
  groups: OrbitCaseTimelineGroupDto[];
}

export interface OrbitCaseUpdatePatch {
  assigneeId?: string | null;
  description?: string | null;
  dueAt?: Date | null;
  ownerId?: string | null;
  priority?: OrbitCasePriority;
  status?: OrbitCaseStatus;
  tags?: string[];
  title?: string;
}
