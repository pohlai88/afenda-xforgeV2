"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import { watchOrbitCaseSchema } from "@repo/orbit-case";
import { setOrbitCaseWatcher } from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";

export const watchCase = async (
  input: unknown
): Promise<AuthActionResult<{ watching: boolean }>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = watchOrbitCaseSchema.parse(input);
    await setOrbitCaseWatcher(orgId, parsed.caseId, userId, parsed.watching);
    revalidatePath(`/orbit-case/${parsed.caseId}`);
    return { watching: parsed.watching };
  });
