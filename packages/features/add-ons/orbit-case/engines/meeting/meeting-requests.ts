import "server-only";

import { database } from "@repo/database";
import { orbitMeetingRequest } from "@repo/database/schema";
import { and, desc, eq } from "drizzle-orm";
import type { OrbitMeetingRequestRecord } from "../../contract/orbit-case.types";

const mapMeetingRequestRow = (
  row: typeof orbitMeetingRequest.$inferSelect
): OrbitMeetingRequestRecord => ({
  createdAt: row.createdAt,
  createdBy: row.createdBy,
  id: row.id,
  location: row.location,
  organizationId: row.organizationId,
  originCaseId: row.originCaseId,
  scheduledAt: row.scheduledAt,
  title: row.title,
});

export const getMeetingRequestById = async (
  organizationId: string,
  meetingId: string
): Promise<OrbitMeetingRequestRecord | null> => {
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
  limit = 200
): Promise<OrbitMeetingRequestRecord[]> => {
  const rows = await database
    .select()
    .from(orbitMeetingRequest)
    .where(eq(orbitMeetingRequest.organizationId, organizationId))
    .orderBy(desc(orbitMeetingRequest.createdAt))
    .limit(limit);

  return rows.map(mapMeetingRequestRow);
};
