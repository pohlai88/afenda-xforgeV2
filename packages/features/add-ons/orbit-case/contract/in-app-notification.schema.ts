import { z } from "zod";

export const ORBIT_IN_APP_NOTIFICATION_KINDS = [
  "orbit.case.assigned",
  "orbit.case.pushed",
  "orbit.morph.assigned",
] as const;

export type OrbitInAppNotificationKind =
  (typeof ORBIT_IN_APP_NOTIFICATION_KINDS)[number];

export const orbitInAppNotificationKindSchema = z.enum(
  ORBIT_IN_APP_NOTIFICATION_KINDS
);

export const orbitInAppNotificationPayloadSchema = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
  .default({});

export type OrbitInAppNotificationPayload = z.infer<
  typeof orbitInAppNotificationPayloadSchema
>;

export const createOrbitInAppNotificationInputSchema = z.object({
  body: z.string().trim().max(500).nullable().optional(),
  href: z.string().min(1).max(500),
  kind: orbitInAppNotificationKindSchema,
  payload: orbitInAppNotificationPayloadSchema.optional(),
  title: z.string().trim().min(1).max(200),
  userId: z.string().min(1),
});

export type CreateOrbitInAppNotificationInput = z.infer<
  typeof createOrbitInAppNotificationInputSchema
>;

export const listOrbitInAppNotificationsFilterSchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  unreadOnly: z.boolean().optional(),
});

export type ListOrbitInAppNotificationsFilter = z.infer<
  typeof listOrbitInAppNotificationsFilterSchema
>;

export const markOrbitInAppNotificationReadSchema = z.object({
  notificationId: z.string().min(1),
});

export type MarkOrbitInAppNotificationReadInput = z.infer<
  typeof markOrbitInAppNotificationReadSchema
>;

export interface OrbitInAppNotificationRecord {
  body: string | null;
  createdAt: Date;
  href: string;
  id: string;
  kind: OrbitInAppNotificationKind;
  organizationId: string;
  payload: OrbitInAppNotificationPayload;
  readAt: Date | null;
  title: string;
  userId: string;
}

export type OrbitInAppNotificationDto = Omit<
  OrbitInAppNotificationRecord,
  "createdAt" | "readAt" | "payload"
> & {
  createdAt: string;
  payload: OrbitInAppNotificationPayload;
  readAt: string | null;
};

export {
  syncMorphExternalStatusSchema,
  type SyncMorphExternalStatusInput,
} from "./morph-sync.schema";
