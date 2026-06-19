import type {
  OrbitInAppNotificationDto,
  OrbitInAppNotificationRecord,
} from "./in-app-notification.schema";

export const toOrbitInAppNotificationDto = (
  record: OrbitInAppNotificationRecord
): OrbitInAppNotificationDto => ({
  body: record.body,
  createdAt: record.createdAt.toISOString(),
  href: record.href,
  id: record.id,
  kind: record.kind,
  organizationId: record.organizationId,
  payload: record.payload,
  readAt: record.readAt ? record.readAt.toISOString() : null,
  title: record.title,
  userId: record.userId,
});
