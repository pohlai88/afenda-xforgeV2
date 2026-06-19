import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { database, orbitInAppNotification } from "@repo/database";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import {
  createOrbitInAppNotificationInputSchema,
  type CreateOrbitInAppNotificationInput,
  type ListOrbitInAppNotificationsFilter,
  type OrbitInAppNotificationKind,
  type OrbitInAppNotificationPayload,
  type OrbitInAppNotificationRecord,
} from "../../contract/in-app-notification.schema";

const mapNotificationRow = (
  row: typeof orbitInAppNotification.$inferSelect
): OrbitInAppNotificationRecord | null => {
  const kind = row.kind as OrbitInAppNotificationKind;

  if (
    kind !== "orbit.case.assigned" &&
    kind !== "orbit.case.pushed" &&
    kind !== "orbit.morph.assigned"
  ) {
    return null;
  }

  return {
    body: row.body,
    createdAt: row.createdAt,
    href: row.href,
    id: row.id,
    kind,
    organizationId: row.organizationId,
    payload: (row.payload ?? {}) as OrbitInAppNotificationPayload,
    readAt: row.readAt,
    title: row.title,
    userId: row.userId,
  };
};

export const createInAppNotification = async (
  organizationId: string,
  input: CreateOrbitInAppNotificationInput
): Promise<OrbitInAppNotificationRecord> => {
  const parsed = createOrbitInAppNotificationInputSchema.parse(input);
  const now = new Date();
  const id = createId();

  const [row] = await database
    .insert(orbitInAppNotification)
    .values({
      body: parsed.body ?? null,
      createdAt: now,
      href: parsed.href,
      id,
      kind: parsed.kind,
      organizationId,
      payload: parsed.payload ?? {},
      title: parsed.title,
      userId: parsed.userId,
    })
    .returning();

  const mapped = row ? mapNotificationRow(row) : null;

  if (!mapped) {
    throw new Error("Failed to create in-app notification");
  }

  return mapped;
};

export const createInAppNotifications = async (
  organizationId: string,
  inputs: CreateOrbitInAppNotificationInput[]
): Promise<OrbitInAppNotificationRecord[]> => {
  const records: OrbitInAppNotificationRecord[] = [];

  for (const input of inputs) {
    records.push(await createInAppNotification(organizationId, input));
  }

  return records;
};

export const listInAppNotificationsForUser = async (
  organizationId: string,
  userId: string,
  filters: ListOrbitInAppNotificationsFilter = {}
): Promise<OrbitInAppNotificationRecord[]> => {
  const conditions = [
    eq(orbitInAppNotification.organizationId, organizationId),
    eq(orbitInAppNotification.userId, userId),
  ];

  if (filters.unreadOnly) {
    conditions.push(isNull(orbitInAppNotification.readAt));
  }

  const rows = await database
    .select()
    .from(orbitInAppNotification)
    .where(and(...conditions))
    .orderBy(desc(orbitInAppNotification.createdAt))
    .limit(filters.limit ?? 50);

  return rows
    .map((row) => mapNotificationRow(row))
    .filter((record): record is OrbitInAppNotificationRecord => record !== null);
};

export const countUnreadInAppNotifications = async (
  organizationId: string,
  userId: string
): Promise<number> => {
  const [row] = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(orbitInAppNotification)
    .where(
      and(
        eq(orbitInAppNotification.organizationId, organizationId),
        eq(orbitInAppNotification.userId, userId),
        isNull(orbitInAppNotification.readAt)
      )
    );

  return row?.count ?? 0;
};

export const markInAppNotificationRead = async (
  organizationId: string,
  userId: string,
  notificationId: string
): Promise<OrbitInAppNotificationRecord | null> => {
  const now = new Date();

  const [row] = await database
    .update(orbitInAppNotification)
    .set({ readAt: now })
    .where(
      and(
        eq(orbitInAppNotification.id, notificationId),
        eq(orbitInAppNotification.organizationId, organizationId),
        eq(orbitInAppNotification.userId, userId)
      )
    )
    .returning();

  return row ? mapNotificationRow(row) : null;
};
