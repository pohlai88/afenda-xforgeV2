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

export type PushResultDto =
  | {
      ok: true;
      pushEventId: string;
      targetType: string;
      targetId: string;
      linkId: string;
      cached: boolean;
    }
  | {
      ok: false;
      code: "destination_not_registered" | "missing_fields" | "forbidden";
      missingFields?: string[];
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
