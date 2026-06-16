"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  listOrbitCasesFilterSchema,
  type OrbitCaseDto,
  toOrbitCaseDto,
} from "@repo/orbit-case";
import { listOrbitCases } from "@repo/orbit-case/server";

export const listCases = async (
  filters?: unknown
): Promise<AuthActionResult<OrbitCaseDto[]>> =>
  withOrg(async ({ orgId }) => {
    const parsed = listOrbitCasesFilterSchema.parse(filters ?? {});
    const records = await listOrbitCases(orgId, parsed);
    return records.map(toOrbitCaseDto);
  });
