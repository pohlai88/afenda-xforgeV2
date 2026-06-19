"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  markOrbitInAppNotificationReadSchema,
  toOrbitInAppNotificationDto,
  type OrbitInAppNotificationDto,
} from "@repo/orbit-case";
import { markInAppNotificationRead } from "@repo/orbit-case/server";

export const markOrbitNotificationRead = async (
  input: unknown
): Promise<AuthActionResult<OrbitInAppNotificationDto | null>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = markOrbitInAppNotificationReadSchema.parse(input);
    const record = await markInAppNotificationRead(
      orgId,
      userId,
      parsed.notificationId
    );

    return record ? toOrbitInAppNotificationDto(record) : null;
  });
