"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import { getOrganizationRole } from "@repo/auth/cms";
import {
  buildOrbitCasePushedEvent,
  executePushSchema,
  resolveMorphSliceByTargetType,
  type PushResultDto,
} from "@repo/orbit-case";
import { executePush } from "@repo/orbit-case/server";
import { getOrbitPushCapabilitiesForSession } from "@/lib/orbit-case-session";
import {
  revalidateOrbitCaseMorphMutation,
  revalidateOrbitCaseMutation,
} from "@/lib/orbit-case-revalidate";
import { emitOrgEvent } from "@/lib/emit-org-event";

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
      revalidateOrbitCaseMutation({
        organizationId: orgId,
        caseId: parsed.caseId,
      });

      const slice = resolveMorphSliceByTargetType(result.targetType);
      if (slice?.hasAppRoute) {
        revalidateOrbitCaseMorphMutation(
          slice.segment,
          orgId,
          result.targetId
        );
      }

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
