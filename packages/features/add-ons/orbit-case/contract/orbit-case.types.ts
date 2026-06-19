import type { OrbitCaseBlobAccess } from "./blob-access";
import type { OrbitMorphStatus } from "./morph-status";
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
  assigneeId: string | null;
  costCenter: string | null;
  createdAt: Date;
  createdBy: string;
  currency: string | null;
  externalRefId: string | null;
  id: string;
  justification: string | null;
  organizationId: string;
  originCaseId: string;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitBudgetRequestDto = Omit<
  OrbitBudgetRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitMeetingRequestRecord {
  assigneeId: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  location: string | null;
  organizationId: string;
  originCaseId: string;
  scheduledAt: string | null;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitMeetingRequestDto = Omit<
  OrbitMeetingRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitApprovalRequestRecord {
  amount: string | null;
  approver: string | null;
  assigneeId: string | null;
  createdAt: Date;
  createdBy: string;
  decisionNotes: string | null;
  dueDate: string | null;
  externalRefId: string | null;
  id: string;
  organizationId: string;
  originCaseId: string;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitApprovalRequestDto = Omit<
  OrbitApprovalRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitPurchaseRequestRecord {
  amount: string | null;
  assigneeId: string | null;
  createdAt: Date;
  createdBy: string;
  externalRefId: string | null;
  id: string;
  organizationId: string;
  originCaseId: string;
  poReference: string | null;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
  vendor: string | null;
}

export type OrbitPurchaseRequestDto = Omit<
  OrbitPurchaseRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitLeadRequestRecord {
  assigneeId: string | null;
  company: string | null;
  contact: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitLeadRequestDto = Omit<
  OrbitLeadRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitComplaintRequestRecord {
  assigneeId: string | null;
  category: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  severity: string | null;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitComplaintRequestDto = Omit<
  OrbitComplaintRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitRiskRequestRecord {
  assigneeId: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  owner: string | null;
  riskLevel: string | null;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitRiskRequestDto = Omit<
  OrbitRiskRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitProjectRequestRecord {
  assigneeId: string | null;
  budget: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  startDate: string | null;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitProjectRequestDto = Omit<
  OrbitProjectRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitInvestigationRequestRecord {
  assigneeId: string | null;
  createdAt: Date;
  createdBy: string;
  id: string;
  organizationId: string;
  originCaseId: string;
  priority: string | null;
  status: OrbitMorphStatus;
  subject: string | null;
  title: string;
  updatedAt: Date;
}

export type OrbitInvestigationRequestDto = Omit<
  OrbitInvestigationRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitCapaRequestRecord {
  assigneeId: string | null;
  createdAt: Date;
  createdBy: string;
  dueDate: string | null;
  id: string;
  organizationId: string;
  originCaseId: string;
  rootCause: string | null;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitCapaRequestDto = Omit<
  OrbitCapaRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export interface OrbitContractReviewRequestRecord {
  assigneeId: string | null;
  counterparty: string | null;
  createdAt: Date;
  createdBy: string;
  expiryDate: string | null;
  id: string;
  organizationId: string;
  originCaseId: string;
  status: OrbitMorphStatus;
  title: string;
  updatedAt: Date;
}

export type OrbitContractReviewRequestDto = Omit<
  OrbitContractReviewRequestRecord,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
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
