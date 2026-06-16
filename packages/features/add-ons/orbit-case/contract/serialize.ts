import type {
  OrbitCaseBoardColumnDto,
  OrbitCaseBoardDto,
  OrbitCaseBoardResult,
  OrbitCaseCommentDto,
  OrbitCaseCommentRecord,
  OrbitCaseDto,
  OrbitCaseRecord,
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

export const toJsonSafeActivityPayload = (
  payload: object
): Record<string, unknown> =>
  JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
