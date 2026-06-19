"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  type OrbitCaseDto,
  toOrbitCaseDto,
  updateOrbitCaseSchema,
} from "@repo/orbit-case";
import {
  getOrbitCaseById,
  notifyUserOnCaseAssigned,
  updateOrbitCaseFields,
} from "@repo/orbit-case/server";
import { revalidateOrbitCaseMutation } from "@/lib/orbit-case-revalidate";

export const updateCase = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = updateOrbitCaseSchema.parse(input);
    const { caseId, ...patch } = parsed;
    const existing = await getOrbitCaseById(orgId, caseId);

    if (!existing) {
      throw new Error("Orbit Case not found");
    }

    const updated = await updateOrbitCaseFields(orgId, userId, caseId, patch);

    if (!updated) {
      throw new Error("Orbit Case not found");
    }

    if (
      patch.assigneeId !== undefined &&
      patch.assigneeId &&
      patch.assigneeId !== existing.assigneeId &&
      patch.assigneeId !== userId
    ) {
      await notifyUserOnCaseAssigned({
        actorId: userId,
        assigneeId: patch.assigneeId,
        caseId,
        caseTitle: updated.title,
        organizationId: orgId,
      });
    }

    revalidateOrbitCaseMutation({
      organizationId: orgId,
      caseId: parsed.caseId,
    });
    return toOrbitCaseDto(updated);
  });
