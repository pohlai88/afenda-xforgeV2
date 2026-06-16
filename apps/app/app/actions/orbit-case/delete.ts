"use server";

import { withOrg, withOwner } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import { deleteOrbitCaseSchema } from "@repo/orbit-case";
import {
  hardDeleteOrbitCase,
  softDeleteOrbitCase,
} from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";

export const deleteCase = (
  input: unknown
): Promise<AuthActionResult<{ deleted: boolean }>> => {
  const parsed = deleteOrbitCaseSchema.parse(input);

  if (parsed.hard) {
    return withOwner(async ({ orgId }) => {
      const deleted = await hardDeleteOrbitCase(orgId, parsed.caseId);
      revalidatePath("/orbit-case");
      return { deleted };
    });
  }

  return withOrg(async ({ orgId, userId }) => {
    const deleted = await softDeleteOrbitCase(orgId, userId, parsed.caseId);
    revalidatePath("/orbit-case");
    return { deleted };
  });
};
