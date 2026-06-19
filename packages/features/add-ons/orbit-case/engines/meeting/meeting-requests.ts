import "server-only";

import { database, orbitMeetingRequest } from "@repo/database";
import { and, desc, eq } from "drizzle-orm";
import type { ListMorphLifecycleFilter } from "../../contract/morph-lifecycle.schema";
import type { OrbitMeetingRequestRecord } from "../../contract/orbit-case.types";
import type { OrbitMorphStatus } from "../../contract/morph-status";
import {
  applyMorphLifecyclePatch,
  readMorphLifecycleCoreFields,
} from "../morph/read-morph-lifecycle-row";
import { recordMorphPilotActivity } from "../morph/record-morph-pilot-activity";

export interface OrbitMeetingRequestUpdatePatch {
  assigneeId?: string | null;
  location?: string | null;
  scheduledAt?: string | null;
  status?: OrbitMorphStatus;
  title?: string;
}

const mapMeetingRequestRow = (
  row: typeof orbitMeetingRequest.$inferSelect
): OrbitMeetingRequestRecord | null => {
  const core = readMorphLifecycleCoreFields(row);

  if (!core) {
    return null;
  }

  return {
    ...core,
    location: row.location,
    scheduledAt: row.scheduledAt,
  };
};

export const getMeetingRequestById = async (
  organizationId: string,
  meetingId: string
) => {
  const [row] = await database
    .select()
    .from(orbitMeetingRequest)
    .where(
      and(
        eq(orbitMeetingRequest.organizationId, organizationId),
        eq(orbitMeetingRequest.id, meetingId)
      )
    )
    .limit(1);

  return row ? mapMeetingRequestRow(row) : null;
};

export const listMeetingRequestsForOrg = async (
  organizationId: string,
  filters: ListMorphLifecycleFilter = {}
) => {
  const conditions = [eq(orbitMeetingRequest.organizationId, organizationId)];

  if (filters.status) {
    conditions.push(eq(orbitMeetingRequest.status, filters.status));
  }

  if (filters.assigneeId) {
    conditions.push(eq(orbitMeetingRequest.assigneeId, filters.assigneeId));
  }

  const rows = await database
    .select()
    .from(orbitMeetingRequest)
    .where(and(...conditions))
    .orderBy(desc(orbitMeetingRequest.updatedAt))
    .limit(filters.limit ?? 200);

  return rows
    .map((row) => mapMeetingRequestRow(row))
    .filter((record): record is NonNullable<ReturnType<typeof mapMeetingRequestRow>> => record !== null);
};

export const updateMeetingRequestFields = async (
  organizationId: string,
  actorId: string,
  meetingId: string,
  patch: OrbitMeetingRequestUpdatePatch
) => {
  const existing = await getMeetingRequestById(organizationId, meetingId);

  if (!existing) {
    return null;
  }

  const now = new Date();
  const updates: Partial<typeof orbitMeetingRequest.$inferInsert> = {
    updatedAt: now,
  };

  applyMorphLifecyclePatch(updates, patch);

  if (patch.scheduledAt !== undefined) {
    updates.scheduledAt = patch.scheduledAt;
  }

  if (patch.location !== undefined) {
    updates.location = patch.location;
  }

  await database
    .update(orbitMeetingRequest)
    .set(updates)
    .where(
      and(
        eq(orbitMeetingRequest.id, meetingId),
        eq(orbitMeetingRequest.organizationId, organizationId)
      )
    );

  await recordMorphPilotActivity({
    activitySegment: "meeting",
    actorId,
    organizationId,
    originCaseId: existing.originCaseId,
    payload: patch,
    requestId: meetingId,
  });

  return getMeetingRequestById(organizationId, meetingId);
};
