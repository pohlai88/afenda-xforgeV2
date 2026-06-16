"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  type OrbitCaseDto,
  toOrbitCaseDto,
  updateOrbitCaseSchema,
} from "@repo/orbit-case";
import { updateOrbitCaseFields } from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";

export const updateCase = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = updateOrbitCaseSchema.parse(input);
    const { caseId, ...patch } = parsed;
    const updated = await updateOrbitCaseFields(orgId, userId, caseId, patch);

    if (!updated) {
      throw new Error("Orbit Case not found");
    }

    revalidatePath("/orbit-case");
    return toOrbitCaseDto(updated);
  });
