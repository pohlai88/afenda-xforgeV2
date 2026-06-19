import { formatOrbitCaseActivitySummary } from "./activity-format";
import {
  readOrbitObjectLinkLabel,
  resolveOrbitMorphLinkHref,
} from "./link-projection-registry";
import type {
  OrbitCaseActivityDto,
  OrbitCaseActivityRecord,
  OrbitCaseAttachmentDto,
  OrbitCaseAttachmentRecord,
  OrbitCaseBoardColumnDto,
  OrbitCaseBoardDto,
  OrbitCaseBoardResult,
  OrbitCaseCalendarDto,
  OrbitCaseCalendarResult,
  OrbitCaseCommentDto,
  OrbitCaseCommentRecord,
  OrbitCaseDto,
  OrbitCaseRecord,
  OrbitCaseTimelineDto,
  OrbitCaseTimelineResult,
  OrbitBudgetRequestDto,
  OrbitBudgetRequestRecord,
  OrbitApprovalRequestDto,
  OrbitApprovalRequestRecord,
  OrbitPurchaseRequestDto,
  OrbitPurchaseRequestRecord,
  OrbitObjectLinkDto,
  OrbitObjectLinkProjectionDto,
  OrbitObjectLinkRecord,
} from "./orbit-case.types";

const toIso = (value: Date | null): string | null =>
  value === null ? null : value.toISOString();

export const toOrbitCaseDto = (record: OrbitCaseRecord): OrbitCaseDto => ({
  id: record.id,
  organizationId: record.organizationId,
  title: record.title,
  description: record.description,
  status: record.status,
  priority: record.priority,
  ownerId: record.ownerId,
  assigneeId: record.assigneeId,
  dueAt: toIso(record.dueAt),
  createdBy: record.createdBy,
  softDeletedAt: toIso(record.softDeletedAt),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  tags: record.tags,
});

export const toOrbitCaseCommentDto = (
  record: OrbitCaseCommentRecord
): OrbitCaseCommentDto => ({
  id: record.id,
  caseId: record.caseId,
  organizationId: record.organizationId,
  authorId: record.authorId,
  body: record.body,
  createdAt: record.createdAt.toISOString(),
});

export const toOrbitCaseAttachmentDto = (
  record: OrbitCaseAttachmentRecord
): OrbitCaseAttachmentDto => ({
  id: record.id,
  caseId: record.caseId,
  organizationId: record.organizationId,
  uploadedBy: record.uploadedBy,
  fileName: record.fileName,
  contentType: record.contentType,
  sizeBytes: record.sizeBytes,
  blobUrl: record.blobUrl,
  blobPathname: record.blobPathname,
  blobAccess: record.blobAccess,
  createdAt: record.createdAt.toISOString(),
});

export const toOrbitCaseActivityDto = (
  record: OrbitCaseActivityRecord
): OrbitCaseActivityDto => ({
  id: record.id,
  caseId: record.caseId,
  organizationId: record.organizationId,
  actorId: record.actorId,
  action: record.action,
  payload: record.payload,
  createdAt: record.createdAt.toISOString(),
  summary: formatOrbitCaseActivitySummary(record.action, record.payload),
});

export const toOrbitObjectLinkDto = (
  record: OrbitObjectLinkRecord
): OrbitObjectLinkDto => ({
  id: record.id,
  organizationId: record.organizationId,
  originCaseId: record.originCaseId,
  pushEventId: record.pushEventId,
  targetType: record.targetType,
  targetId: record.targetId,
  payload: record.payload,
  createdAt: record.createdAt.toISOString(),
});

export const toOrbitObjectLinkProjectionDto = (
  link: OrbitObjectLinkDto
): OrbitObjectLinkProjectionDto => ({
  createdAt: link.createdAt,
  href: resolveOrbitMorphLinkHref(link.targetType, link.targetId),
  id: link.id,
  label: readOrbitObjectLinkLabel(link),
  targetId: link.targetId,
  targetType: link.targetType,
});

export const toOrbitCaseBoardDto = (
  board: OrbitCaseBoardResult
): OrbitCaseBoardDto => ({
  columns: board.columns.map(
    (column): OrbitCaseBoardColumnDto => ({
      status: column.status,
      cases: column.cases.map(toOrbitCaseDto),
    })
  ),
});

export const toOrbitCaseCalendarDto = (
  calendar: OrbitCaseCalendarResult
): OrbitCaseCalendarDto => ({
  month: calendar.month,
  days: calendar.days.map((day) => ({
    date: day.date,
    cases: day.cases.map(toOrbitCaseDto),
  })),
});

export const toOrbitCaseTimelineDto = (
  timeline: OrbitCaseTimelineResult
): OrbitCaseTimelineDto => ({
  groups: timeline.groups.map((group) => ({
    bucket: group.bucket,
    label: group.label,
    cases: group.cases.map(toOrbitCaseDto),
  })),
});

export const toOrbitBudgetRequestDto = (
  record: OrbitBudgetRequestRecord
): OrbitBudgetRequestDto => ({
  id: record.id,
  organizationId: record.organizationId,
  originCaseId: record.originCaseId,
  title: record.title,
  amount: record.amount,
  costCenter: record.costCenter,
  currency: record.currency,
  externalRefId: record.externalRefId,
  justification: record.justification,
  status: record.status,
  assigneeId: record.assigneeId,
  createdBy: record.createdBy,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export const toOrbitApprovalRequestDto = (
  record: OrbitApprovalRequestRecord
): OrbitApprovalRequestDto => ({
  id: record.id,
  organizationId: record.organizationId,
  originCaseId: record.originCaseId,
  title: record.title,
  approver: record.approver,
  amount: record.amount,
  decisionNotes: record.decisionNotes,
  dueDate: record.dueDate,
  externalRefId: record.externalRefId,
  status: record.status,
  assigneeId: record.assigneeId,
  createdBy: record.createdBy,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export const toOrbitPurchaseRequestDto = (
  record: OrbitPurchaseRequestRecord
): OrbitPurchaseRequestDto => ({
  id: record.id,
  organizationId: record.organizationId,
  originCaseId: record.originCaseId,
  title: record.title,
  vendor: record.vendor,
  amount: record.amount,
  externalRefId: record.externalRefId,
  poReference: record.poReference,
  status: record.status,
  assigneeId: record.assigneeId,
  createdBy: record.createdBy,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const toJsonSafeActivityPayload = (
  payload: object
): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(JSON.stringify(payload));
  return isPlainRecord(parsed) ? parsed : {};
};
