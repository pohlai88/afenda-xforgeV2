"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  getOrbitCaseSchema,
  type OrbitCaseDto,
  toOrbitCaseDto,
} from "@repo/orbit-case";
import {
  canHardDeleteOrbitCase,
  getOrbitCaseById,
  isOrbitCaseWatcher,
} from "@repo/orbit-case/server";
import { getOrganizationRole } from "@repo/auth/cms";

export interface GetCaseResult {
  orbitCase: OrbitCaseDto;
  watching: boolean;
  canHardDelete: boolean;
}

export const getCase = async (
  input: unknown
): Promise<AuthActionResult<GetCaseResult>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = getOrbitCaseSchema.parse(input);
    const record = await getOrbitCaseById(orgId, parsed.caseId);

    if (!record) {
      throw new Error("Orbit Case not found");
    }

    const [watching, role] = await Promise.all([
      isOrbitCaseWatcher(orgId, parsed.caseId, userId),
      getOrganizationRole(userId, orgId),
    ]);

    return {
      orbitCase: toOrbitCaseDto(record),
      watching,
      canHardDelete: role ? canHardDeleteOrbitCase(role) : false,
    };
  });
