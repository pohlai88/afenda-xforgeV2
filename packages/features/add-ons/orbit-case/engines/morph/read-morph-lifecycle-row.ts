import type { OrbitMorphStatus } from "../../contract/morph-status";
import { parseOrbitMorphStatus } from "../../contract/morph-status";

export interface MorphLifecycleRowShape {
  assigneeId: unknown;
  createdAt: unknown;
  createdBy: unknown;
  id: unknown;
  organizationId: unknown;
  originCaseId: unknown;
  status: unknown;
  title: unknown;
  updatedAt: unknown;
}

export interface MorphLifecycleCoreFields {
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

export const readMorphLifecycleCoreFields = (
  row: MorphLifecycleRowShape
): MorphLifecycleCoreFields | null => {
  const status = parseOrbitMorphStatus(row.status);

  if (
    !(
      status &&
      row.createdAt instanceof Date &&
      row.updatedAt instanceof Date &&
      typeof row.createdBy === "string" &&
      typeof row.id === "string" &&
      typeof row.organizationId === "string" &&
      typeof row.originCaseId === "string" &&
      typeof row.title === "string"
    )
  ) {
    return null;
  }

  return {
    assigneeId: typeof row.assigneeId === "string" ? row.assigneeId : null,
    createdAt: row.createdAt,
    createdBy: row.createdBy,
    id: row.id,
    organizationId: row.organizationId,
    originCaseId: row.originCaseId,
    status,
    title: row.title,
    updatedAt: row.updatedAt,
  };
};

export const applyMorphLifecyclePatch = (
  updates: Record<string, unknown>,
  patch: {
    assigneeId?: string | null;
    status?: OrbitMorphStatus;
    title?: string;
  }
): void => {
  if (patch.title !== undefined) {
    updates.title = patch.title;
  }

  if (patch.status !== undefined) {
    updates.status = patch.status;
  }

  if (patch.assigneeId !== undefined) {
    updates.assigneeId = patch.assigneeId;
  }
};
