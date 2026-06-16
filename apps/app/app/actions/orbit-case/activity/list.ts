"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  listOrbitCaseActivitySchema,
  type OrbitCaseActivityDto,
  toOrbitCaseActivityDto,
} from "@repo/orbit-case";
import { listOrbitCaseActivity } from "@repo/orbit-case/server";

export const listActivity = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseActivityDto[]>> =>
  withOrg(async ({ orgId }) => {
    const parsed = listOrbitCaseActivitySchema.parse(input);
    const records = await listOrbitCaseActivity(orgId, parsed.caseId);
    return records.map(toOrbitCaseActivityDto);
  });
