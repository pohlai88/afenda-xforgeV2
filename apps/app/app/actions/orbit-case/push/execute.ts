"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import { getOrganizationRole } from "@repo/auth/cms";
import {
  executePushSchema,
  type PushDestinationDefinition,
  type PushResultDto,
  type PushTemplateDefinition,
} from "@repo/orbit-case";
import {
  executePush,
  getMergedPushDestination,
  getMergedPushTemplate,
  resolveOrgPushDestinations,
} from "@repo/orbit-case/server";
import { getOrbitPushCapabilitiesForSession } from "@/lib/orbit-case-session";
import {
  revalidateOrbitCaseBudgetMutation,
  revalidateOrbitCaseMutation,
} from "@/lib/orbit-case-revalidate";
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
      revalidateOrbitCaseMutation({
        organizationId: orgId,
        caseId: parsed.caseId,
      });
      if (result.targetType === "budget-request") {
        revalidateOrbitCaseBudgetMutation(result.targetId);
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

export const getPushTemplateForDestination = async (
  destinationId: string
): Promise<AuthActionResult<PushTemplateDefinition>> =>
  withOrg(async ({ orgId, userId }) => {
    const role = await getOrganizationRole(userId, orgId);

    if (!role) {
      throw new Error("Organization access denied");
    }

    const destination = await getMergedPushDestination(orgId, destinationId);

    if (!destination) {
      throw new Error("Destination not found");
    }

    const template = await getMergedPushTemplate(orgId, destination.templateId);

    if (!template) {
      throw new Error("Template not found");
    }

    return template;
  });
