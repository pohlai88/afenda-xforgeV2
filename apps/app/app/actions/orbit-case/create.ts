"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  createOrbitCaseSchema,
  type OrbitCaseDto,
  toOrbitCaseDto,
} from "@repo/orbit-case";
import { createOrbitCase } from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";

export const createCase = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = createOrbitCaseSchema.parse(input);
    const created = await createOrbitCase(orgId, userId, parsed);
    revalidatePath("/orbit-case");
    return toOrbitCaseDto(created);
  });
