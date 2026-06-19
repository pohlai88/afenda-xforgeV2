import type {
  MorphLifecycleCoreRecord,
  OrbitMorphLifecycleRequestDto,
} from "./morph-lifecycle.types";

export const toOrbitMorphLifecycleRequestDto = (
  record: MorphLifecycleCoreRecord,
  values: Record<string, string | null>
): OrbitMorphLifecycleRequestDto => ({
  assigneeId: record.assigneeId,
  createdAt: record.createdAt.toISOString(),
  createdBy: record.createdBy,
  id: record.id,
  organizationId: record.organizationId,
  originCaseId: record.originCaseId,
  status: record.status,
  title: record.title,
  updatedAt: record.updatedAt.toISOString(),
  values,
});
