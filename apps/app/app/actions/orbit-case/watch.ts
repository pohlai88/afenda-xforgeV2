"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import { watchOrbitCaseSchema } from "@repo/orbit-case";
import { setOrbitCaseWatcher } from "@repo/orbit-case/server";
import { revalidateOrbitCaseMutation } from "@/lib/orbit-case-revalidate";

export const watchCase = async (
  input: unknown
): Promise<AuthActionResult<{ watching: boolean }>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = watchOrbitCaseSchema.parse(input);
    await setOrbitCaseWatcher(orgId, parsed.caseId, userId, parsed.watching);
    revalidateOrbitCaseMutation({
      organizationId: orgId,
      caseId: parsed.caseId,
    });
    return { watching: parsed.watching };
  });
