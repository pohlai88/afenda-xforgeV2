"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  listOrbitInAppNotificationsFilterSchema,
  toOrbitInAppNotificationDto,
  type OrbitInAppNotificationDto,
} from "@repo/orbit-case";
import { listInAppNotificationsForUser } from "@repo/orbit-case/server";

export const listOrbitNotifications = async (
  input: unknown = {}
): Promise<AuthActionResult<OrbitInAppNotificationDto[]>> =>
  withOrg(async ({ orgId, userId }) => {
    const filters = listOrbitInAppNotificationsFilterSchema.parse(input);
    const records = await listInAppNotificationsForUser(orgId, userId, filters);
    return records.map(toOrbitInAppNotificationDto);
  });
