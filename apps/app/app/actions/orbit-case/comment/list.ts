"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import type { OrbitCaseCommentDto } from "@repo/orbit-case";
import { toOrbitCaseCommentDto } from "@repo/orbit-case";
import { listOrbitCaseComments } from "@repo/orbit-case/server";
import { z } from "zod";

const listCommentsSchema = z.object({
  caseId: z.string().min(1),
});

export const listComments = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseCommentDto[]>> =>
  withOrg(async ({ orgId }) => {
    const parsed = listCommentsSchema.parse(input);
    const comments = await listOrbitCaseComments(orgId, parsed.caseId);
    return comments.map(toOrbitCaseCommentDto);
  });
