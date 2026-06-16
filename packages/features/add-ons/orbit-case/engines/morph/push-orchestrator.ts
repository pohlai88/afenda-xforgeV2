import "server-only";

import { createId } from "@paralleldrive/cuid2";
import type { OrganizationRole } from "@repo/auth/organization-roles";
import { database } from "@repo/database";
import {
  orbitBudgetRequest,
  orbitPushEvent,
} from "@repo/database/schema";
import { eq } from "drizzle-orm";
import type { PushResultDto } from "../../contract/orbit-case.types";
import type { ExecutePushInput } from "../../contract/push.schema";
import type { OrbitPushCapability } from "../../contract/push.schema";
import {
  getMergedPushDestination,
  getMergedPushTemplate,
  resolveMissingTemplateFieldsForOrg,
  resolveOrgPushDestinations,
} from "../../lib/registry/push-registry-store";
import { ensureSystemPushDefaults } from "../../lib/registry/system-defaults";
import { recordOrbitCaseActivity } from "../activity/record-activity";
import { createObjectLink } from "../link/object-links";
import { getOrbitCaseById } from "../work/orbit-cases";
import { canPushToDestination } from "../work/permissions";

export interface ExecutePushContext {
  organizationId: string;
  actorId: string;
  role: OrganizationRole;
  userCapabilities: readonly OrbitPushCapability[];
}

const parseStoredPushResult = (value: unknown): PushResultDto | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (record.ok === true) {
    return {
      ok: true,
      pushEventId: String(record.pushEventId),
      targetType: String(record.targetType),
      targetId: String(record.targetId),
      linkId: String(record.linkId),
      cached: Boolean(record.cached),
    };
  }

  if (record.ok === false && typeof record.code === "string") {
    const code = record.code;

    if (
      code === "destination_not_registered" ||
      code === "missing_fields" ||
      code === "forbidden"
    ) {
      return {
        ok: false,
        code,
        ...(Array.isArray(record.missingFields)
          ? { missingFields: record.missingFields.map(String) }
          : {}),
      };
    }
  }

  return null;
};

export const executePush = async (
  context: ExecutePushContext,
  input: ExecutePushInput
): Promise<PushResultDto> => {
  ensureSystemPushDefaults();

  const destination = await getMergedPushDestination(
    context.organizationId,
    input.destinationId
  );

  if (!destination) {
    return { ok: false, code: "destination_not_registered" };
  }

  const allowed = (
    await resolveOrgPushDestinations({
      orgId: context.organizationId,
      userId: context.actorId,
      role: context.role,
      userCapabilities: context.userCapabilities,
    })
  ).some((entry) => entry.id === input.destinationId);

  if (
    !allowed ||
    !canPushToDestination(
      context.role,
      context.userCapabilities,
      destination
    )
  ) {
    return { ok: false, code: "forbidden" };
  }

  const template = await getMergedPushTemplate(
    context.organizationId,
    destination.templateId
  );

  if (!template) {
    return { ok: false, code: "destination_not_registered" };
  }

  const missingFields = await resolveMissingTemplateFieldsForOrg(
    context.organizationId,
    destination.templateId,
    input.fieldValues
  );

  if (missingFields.length > 0) {
    return { ok: false, code: "missing_fields", missingFields };
  }

  const orbitCase = await getOrbitCaseById(
    context.organizationId,
    input.caseId
  );

  if (!orbitCase) {
    return { ok: false, code: "forbidden" };
  }

  const now = new Date();
  const pushEventId = createId();

  const claimResult = await database.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(orbitPushEvent)
      .values({
        id: pushEventId,
        organizationId: context.organizationId,
        caseId: input.caseId,
        destinationId: input.destinationId,
        actorId: context.actorId,
        idempotencyKey: input.idempotencyKey,
        status: "pending",
        result: null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: orbitPushEvent.id });

    if (inserted) {
      return { claimed: true as const, pushEventId: inserted.id };
    }

    const [existing] = await tx
      .select()
      .from(orbitPushEvent)
      .where(eq(orbitPushEvent.idempotencyKey, input.idempotencyKey))
      .limit(1);

    if (!existing) {
      return { claimed: false as const, existing: null };
    }

    return { claimed: false as const, existing };
  });

  if (!claimResult.claimed) {
    if (claimResult.existing?.status === "completed") {
      const cached = parseStoredPushResult(claimResult.existing.result);

      if (cached?.ok) {
        return { ...cached, cached: true };
      }
    }

    return { ok: false, code: "forbidden" };
  }

  const claimedEventId = claimResult.pushEventId;

  const title =
    typeof input.fieldValues.title === "string" && input.fieldValues.title
      ? input.fieldValues.title
      : orbitCase.title;
  const amount =
    typeof input.fieldValues.amount === "string"
      ? input.fieldValues.amount
      : null;

  const budgetId = createId();
  await database.insert(orbitBudgetRequest).values({
    id: budgetId,
    organizationId: context.organizationId,
    originCaseId: input.caseId,
    title,
    amount,
    createdBy: context.actorId,
    createdAt: now,
  });

  const link = await createObjectLink({
    organizationId: context.organizationId,
    originCaseId: input.caseId,
    pushEventId: claimedEventId,
    targetType: "budget-request",
    targetId: budgetId,
    payload: {
      external_source: "orbit-case",
      external_id: input.caseId,
      destinationLabel: destination.label,
    },
  });

  const successResult: PushResultDto = {
    ok: true,
    pushEventId: claimedEventId,
    targetType: "budget-request",
    targetId: budgetId,
    linkId: link.id,
    cached: false,
  };

  await database
    .update(orbitPushEvent)
    .set({
      status: "completed",
      result: successResult,
      updatedAt: new Date(),
    })
    .where(eq(orbitPushEvent.id, claimedEventId));

  await recordOrbitCaseActivity({
    organizationId: context.organizationId,
    caseId: input.caseId,
    actorId: context.actorId,
    action: "case.pushed",
    payload: {
      destinationId: input.destinationId,
      destinationLabel: destination.label,
      targetType: "budget-request",
      targetId: budgetId,
      pushEventId: claimedEventId,
    },
  });

  return successResult;
};
