"use server";

import { withOwner } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  syncMorphExternalStatusSchema,
  type OrbitMorphStatus,
} from "@repo/orbit-case";
import { syncMorphExternalStatus } from "@repo/orbit-case/server";
import {
  revalidateOrbitCaseMorphMutation,
  revalidateOrbitCaseMutation,
} from "@/lib/orbit-case-revalidate";

export interface SyncMorphExternalStatusResult {
  originCaseId: string;
  requestId: string;
  status: OrbitMorphStatus;
}

export const syncMorphExternalStatusAction = async (
  input: unknown
): Promise<AuthActionResult<SyncMorphExternalStatusResult | null>> =>
  withOwner(async ({ orgId, userId }) => {
    const parsed = syncMorphExternalStatusSchema.parse(input);
    const result = await syncMorphExternalStatus(orgId, userId, parsed);

    if (!result) {
      return null;
    }

    revalidateOrbitCaseMorphMutation(parsed.segment, orgId, result.requestId);
    revalidateOrbitCaseMutation({
      organizationId: orgId,
      caseId: result.originCaseId,
    });

    return result;
  });
