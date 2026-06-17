import { formatOrbitCaseActivitySummary } from "./activity-format";
import type {
  OrbitBudgetRequestDto,
  OrbitBudgetRequestRecord,
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
  OrbitObjectLinkDto,
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

export const toOrbitBudgetRequestDto = (
  record: OrbitBudgetRequestRecord
): OrbitBudgetRequestDto => ({
  amount: record.amount,
  createdAt: record.createdAt.toISOString(),
  createdBy: record.createdBy,
  id: record.id,
  organizationId: record.organizationId,
  originCaseId: record.originCaseId,
  title: record.title,
});

export { toOrbitObjectLinkProjectionDto } from "./link-projection";

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

export const toJsonSafeActivityPayload = (
  payload: object
): Record<string, unknown> =>
  JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
