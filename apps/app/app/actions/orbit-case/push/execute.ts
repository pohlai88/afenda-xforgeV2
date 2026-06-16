"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import { getOrganizationRole } from "@repo/auth/cms";
import {
  executePushSchema,
  type PushDestinationDefinition,
  type PushResultDto,
} from "@repo/orbit-case";
import { executePush, resolveOrgPushDestinations } from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";
import { getOrbitPushCapabilitiesForSession } from "@/lib/orbit-case-session";
import { emitOrgEvent } from "@/lib/emit-org-event";
import { buildOrbitCasePushedEvent } from "@repo/orbit-case";

export const executeCasePush = async (
  input: unknown
): Promise<AuthActionResult<PushResultDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = executePushSchema.parse(input);
    const role = await getOrganizationRole(userId, orgId);

    if (!role) {
      throw new Error("Organization access denied");
    }

    const userCapabilities = await getOrbitPushCapabilitiesForSession(
      userId,
      orgId
    );

    const result = await executePush(
      {
        organizationId: orgId,
        actorId: userId,
        role,
        userCapabilities,
      },
      parsed
    );

    if (result.ok) {
      revalidatePath("/orbit-case");
      revalidatePath(`/orbit-case/${parsed.caseId}`);
      await emitOrgEvent(
        orgId,
        "orbit.case.pushed",
        buildOrbitCasePushedEvent({
          caseId: parsed.caseId,
          destinationId: parsed.destinationId,
          pushEventId: result.pushEventId,
          targetType: result.targetType,
          targetId: result.targetId,
        })
      );
    }

    return result;
  });

export const listPushDestinations = async (): Promise<
  AuthActionResult<PushDestinationDefinition[]>
> =>
  withOrg(async ({ orgId, userId }) => {
    const role = await getOrganizationRole(userId, orgId);

    if (!role) {
      throw new Error("Organization access denied");
    }

    const userCapabilities = await getOrbitPushCapabilitiesForSession(
      userId,
      orgId
    );

    return resolveOrgPushDestinations({
      orgId,
      userId,
      role,
      userCapabilities,
    });
  });
