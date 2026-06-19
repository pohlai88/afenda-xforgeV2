"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  resolveRoutedMorphSliceBySegment,
  updateMorphLifecycleRequestSchema,
  type OrbitMorphLifecycleRequestDto,
} from "@repo/orbit-case";
import {
  notifyMorphAssignee,
  resolveMorphDetailHref,
  resolveMorphLifecycleLoader,
} from "@repo/orbit-case/server";
import {
  revalidateOrbitCaseMorphMutation,
  revalidateOrbitCaseMutation,
} from "@/lib/orbit-case-revalidate";

export type MorphPilotUpdateResult = OrbitMorphLifecycleRequestDto;

export const updateMorphPilotRequest = async (
  input: unknown
): Promise<AuthActionResult<MorphPilotUpdateResult>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = updateMorphLifecycleRequestSchema.parse(input);
    const loader = resolveMorphLifecycleLoader(parsed.segment);
    const existing = await loader.getById(orgId, parsed.requestId);
    const updated = await loader.updateFields(
      orgId,
      userId,
      parsed.requestId,
      {
        assigneeId: parsed.assigneeId,
        status: parsed.status,
        title: parsed.title,
        values: parsed.values,
      }
    );

    if (!updated) {
      const config = parsed.segment.replaceAll("-", " ");
      throw new Error(`${config} request not found`);
    }

    if (
      parsed.assigneeId !== undefined &&
      updated.assigneeId &&
      updated.assigneeId !== existing?.assigneeId &&
      updated.assigneeId !== userId
    ) {
      const slice = resolveRoutedMorphSliceBySegment(parsed.segment);

      if (slice) {
        await notifyMorphAssignee({
          actorId: userId,
          assigneeId: updated.assigneeId,
          caseId: updated.originCaseId,
          morphHref: resolveMorphDetailHref(slice.targetType, updated.id),
          morphTitle: updated.title,
          organizationId: orgId,
          segment: parsed.segment,
        });
      }
    }

    revalidateOrbitCaseMorphMutation(parsed.segment, orgId, parsed.requestId);
    revalidateOrbitCaseMutation({
      organizationId: orgId,
      caseId: updated.originCaseId,
    });

    return updated;
  });
