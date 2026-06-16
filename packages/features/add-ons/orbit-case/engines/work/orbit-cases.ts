import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import {
  orbitCase,
  orbitCaseActivity,
  orbitCaseTag,
  orbitCaseWatcher,
} from "@repo/database/schema";
import { log } from "@repo/observability/log";
import { and, desc, eq, gte, inArray, isNull, lte } from "drizzle-orm";
import type {
  CreateOrbitCaseInput,
  ListOrbitCasesFilter,
} from "../../contract/orbit-case.schema";
import type {
  OrbitCaseActivityRecord,
  OrbitCaseRecord,
  OrbitCaseUpdatePatch,
} from "../../contract/orbit-case.types";
import {
  parseOrbitCasePriority,
  parseOrbitCaseStatus,
} from "../../contract/parse";
import { toJsonSafeActivityPayload } from "../../contract/serialize";
import { ORBIT_CASE_ACTIVE_STATUSES } from "../../contract/status";
import { recordOrbitCaseActivity } from "../activity/record-activity";

const loadTagsForCases = async (
  organizationId: string,
  caseIds: string[]
): Promise<Map<string, string[]>> => {
  if (caseIds.length === 0) {
    return new Map();
  }

  const rows = await database
    .select()
    .from(orbitCaseTag)
    .where(
      and(
        eq(orbitCaseTag.organizationId, organizationId),
        inArray(orbitCaseTag.caseId, caseIds)
      )
    );

  const tagMap = new Map<string, string[]>();

  for (const row of rows) {
    const existing = tagMap.get(row.caseId) ?? [];
    existing.push(row.tag);
    tagMap.set(row.caseId, existing);
  }

  return tagMap;
};

const toOrbitCaseRecord = (
  row: typeof orbitCase.$inferSelect,
  tags: string[]
): OrbitCaseRecord | null => {
  const status = parseOrbitCaseStatus(row.status);
  const priority = parseOrbitCasePriority(row.priority);

  if (!(status && priority)) {
    return null;
  }

  return {
    id: row.id,
    organizationId: row.organizationId,
    title: row.title,
    description: row.description,
    status,
    priority,
    ownerId: row.ownerId,
    assigneeId: row.assigneeId,
    dueAt: row.dueAt,
    createdBy: row.createdBy,
    softDeletedAt: row.softDeletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    tags,
  };
};

export const getOrbitCaseById = async (
  organizationId: string,
  caseId: string
): Promise<OrbitCaseRecord | null> => {
  const [row] = await database
    .select()
    .from(orbitCase)
    .where(
      and(
        eq(orbitCase.id, caseId),
        eq(orbitCase.organizationId, organizationId),
        isNull(orbitCase.softDeletedAt)
      )
    )
    .limit(1);

  if (!row) {
    return null;
  }

  const tagMap = await loadTagsForCases(organizationId, [caseId]);
  return toOrbitCaseRecord(row, tagMap.get(caseId) ?? []);
};

export const createOrbitCase = async (
  organizationId: string,
  actorId: string,
  input: CreateOrbitCaseInput
): Promise<OrbitCaseRecord> => {
  const id = createId();
  const now = new Date();
  const tags = input.tags ?? [];

  await database.insert(orbitCase).values({
    id,
    organizationId,
    title: input.title,
    description: input.description ?? null,
    status: input.status,
    priority: input.priority,
    ownerId: input.ownerId ?? actorId,
    assigneeId: input.assigneeId ?? null,
    dueAt: input.dueAt ?? null,
    createdBy: actorId,
    createdAt: now,
    updatedAt: now,
  });

  if (tags.length > 0) {
    await database.insert(orbitCaseTag).values(
      tags.map((tag) => ({
        id: createId(),
        caseId: id,
        organizationId,
        tag,
      }))
    );
  }

  await recordOrbitCaseActivity({
    organizationId,
    caseId: id,
    actorId,
    action: "case.created",
    payload: { title: input.title, status: input.status },
  });

  log.info("orbit.case.created", { organizationId, caseId: id, actorId });

  const created = await getOrbitCaseById(organizationId, id);

  if (!created) {
    throw new Error("Failed to load created Orbit Case");
  }

  return created;
};

export const listOrbitCases = async (
  organizationId: string,
  filters: ListOrbitCasesFilter = {}
): Promise<OrbitCaseRecord[]> => {
  const limit = filters.limit ?? 200;

  const rows = await database
    .select()
    .from(orbitCase)
    .where(
      and(
        eq(orbitCase.organizationId, organizationId),
        isNull(orbitCase.softDeletedAt),
        filters.status ? eq(orbitCase.status, filters.status) : undefined,
        filters.assigneeId
          ? eq(orbitCase.assigneeId, filters.assigneeId)
          : undefined,
        filters.dueFrom ? gte(orbitCase.dueAt, filters.dueFrom) : undefined,
        filters.dueTo ? lte(orbitCase.dueAt, filters.dueTo) : undefined,
        filters.includeCancelled
          ? undefined
          : inArray(orbitCase.status, [...ORBIT_CASE_ACTIVE_STATUSES])
      )
    )
    .orderBy(desc(orbitCase.updatedAt))
    .limit(limit);

  const caseIds = rows.map((row) => row.id);
  const tagMap = await loadTagsForCases(organizationId, caseIds);

  let records = rows
    .map((row) => toOrbitCaseRecord(row, tagMap.get(row.id) ?? []))
    .filter((record): record is OrbitCaseRecord => record !== null);

  const tagFilter = filters.tag;
  if (tagFilter) {
    records = records.filter((record) => record.tags.includes(tagFilter));
  }

  return records;
};

export const updateOrbitCaseFields = async (
  organizationId: string,
  actorId: string,
  caseId: string,
  patch: OrbitCaseUpdatePatch
): Promise<OrbitCaseRecord | null> => {
  const existing = await getOrbitCaseById(organizationId, caseId);

  if (!existing) {
    return null;
  }

  const now = new Date();
  const updates: Partial<typeof orbitCase.$inferInsert> = { updatedAt: now };

  if (patch.title !== undefined) {
    updates.title = patch.title;
  }
  if (patch.description !== undefined) {
    updates.description = patch.description;
  }
  if (patch.status !== undefined) {
    updates.status = patch.status;
  }
  if (patch.priority !== undefined) {
    updates.priority = patch.priority;
  }
  if (patch.ownerId !== undefined) {
    updates.ownerId = patch.ownerId;
  }
  if (patch.assigneeId !== undefined) {
    updates.assigneeId = patch.assigneeId;
  }
  if (patch.dueAt !== undefined) {
    updates.dueAt = patch.dueAt;
  }

  await database
    .update(orbitCase)
    .set(updates)
    .where(
      and(
        eq(orbitCase.id, caseId),
        eq(orbitCase.organizationId, organizationId)
      )
    );

  if (patch.tags) {
    await database
      .delete(orbitCaseTag)
      .where(
        and(
          eq(orbitCaseTag.caseId, caseId),
          eq(orbitCaseTag.organizationId, organizationId)
        )
      );

    if (patch.tags.length > 0) {
      await database.insert(orbitCaseTag).values(
        patch.tags.map((tag) => ({
          id: createId(),
          caseId,
          organizationId,
          tag,
        }))
      );
    }
  }

  await recordOrbitCaseActivity({
    organizationId,
    caseId,
    actorId,
    action: "case.updated",
    payload: toJsonSafeActivityPayload(patch),
  });

  return getOrbitCaseById(organizationId, caseId);
};

export const softDeleteOrbitCase = async (
  organizationId: string,
  actorId: string,
  caseId: string
): Promise<boolean> => {
  const now = new Date();
  const deleted = await database
    .update(orbitCase)
    .set({ softDeletedAt: now, updatedAt: now, status: "cancelled" })
    .where(
      and(
        eq(orbitCase.id, caseId),
        eq(orbitCase.organizationId, organizationId),
        isNull(orbitCase.softDeletedAt)
      )
    )
    .returning({ id: orbitCase.id });

  if (deleted.length === 0) {
    return false;
  }

  await recordOrbitCaseActivity({
    organizationId,
    caseId,
    actorId,
    action: "case.soft_deleted",
    payload: {},
  });

  return true;
};

export const hardDeleteOrbitCase = async (
  organizationId: string,
  caseId: string
): Promise<boolean> => {
  const deleted = await database
    .delete(orbitCase)
    .where(
      and(
        eq(orbitCase.id, caseId),
        eq(orbitCase.organizationId, organizationId)
      )
    )
    .returning({ id: orbitCase.id });

  return deleted.length > 0;
};

export const setOrbitCaseWatcher = async (
  organizationId: string,
  caseId: string,
  userId: string,
  watching: boolean
): Promise<void> => {
  if (watching) {
    await database
      .insert(orbitCaseWatcher)
      .values({
        id: createId(),
        caseId,
        organizationId,
        userId,
      })
      .onConflictDoNothing();
    return;
  }

  await database
    .delete(orbitCaseWatcher)
    .where(
      and(
        eq(orbitCaseWatcher.caseId, caseId),
        eq(orbitCaseWatcher.organizationId, organizationId),
        eq(orbitCaseWatcher.userId, userId)
      )
    );
};

export const isOrbitCaseWatcher = async (
  organizationId: string,
  caseId: string,
  userId: string
): Promise<boolean> => {
  const [row] = await database
    .select({ id: orbitCaseWatcher.id })
    .from(orbitCaseWatcher)
    .where(
      and(
        eq(orbitCaseWatcher.caseId, caseId),
        eq(orbitCaseWatcher.organizationId, organizationId),
        eq(orbitCaseWatcher.userId, userId)
      )
    )
    .limit(1);

  return row !== undefined;
};

export const listOrbitCaseActivity = async (
  organizationId: string,
  caseId: string
): Promise<OrbitCaseActivityRecord[]> => {
  const rows = await database
    .select()
    .from(orbitCaseActivity)
    .where(
      and(
        eq(orbitCaseActivity.caseId, caseId),
        eq(orbitCaseActivity.organizationId, organizationId)
      )
    )
    .orderBy(desc(orbitCaseActivity.createdAt));

  return rows.map((row) => ({
    id: row.id,
    caseId: row.caseId,
    organizationId: row.organizationId,
    actorId: row.actorId,
    action: row.action,
    payload: (row.payload ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt,
  }));
};
