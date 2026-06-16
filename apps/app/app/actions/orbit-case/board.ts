"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import type { OrbitCaseBoardDto } from "@repo/orbit-case";
import {
  orbitCaseStatusSchema,
  toOrbitCaseBoardDto,
  updateOrbitCaseSchema,
} from "@repo/orbit-case";
import {
  getOrbitCaseBoard,
  updateOrbitCaseFields,
} from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";

const moveCaseStatusSchema = updateOrbitCaseSchema.pick({
  caseId: true,
  status: true,
});

export const getBoard = async (): Promise<
  AuthActionResult<OrbitCaseBoardDto>
> =>
  withOrg(async ({ orgId }) =>
    toOrbitCaseBoardDto(await getOrbitCaseBoard(orgId))
  );

export const moveCaseStatus = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseBoardDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = moveCaseStatusSchema.parse(input);
    const status = orbitCaseStatusSchema.parse(parsed.status);
    await updateOrbitCaseFields(orgId, userId, parsed.caseId, { status });
    revalidatePath("/orbit-case");
    return toOrbitCaseBoardDto(await getOrbitCaseBoard(orgId));
  });
