"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  createOrbitCaseCommentSchema,
  type OrbitCaseCommentDto,
  toOrbitCaseCommentDto,
} from "@repo/orbit-case";
import { createOrbitCaseComment } from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";

export const addComment = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseCommentDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = createOrbitCaseCommentSchema.parse(input);
    const comment = await createOrbitCaseComment(
      orgId,
      userId,
      parsed.caseId,
      parsed.body
    );
    revalidatePath("/orbit-case");
    revalidatePath(`/orbit-case/${parsed.caseId}`);
    return toOrbitCaseCommentDto(comment);
  });
