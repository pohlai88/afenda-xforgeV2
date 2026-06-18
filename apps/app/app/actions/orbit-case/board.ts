"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import type {
  OrbitCaseBoardDto,
  OrbitCaseCalendarDto,
} from "@repo/orbit-case";
import {
  orbitCaseCalendarBoardSchema,
  orbitCaseStatusSchema,
  toOrbitCaseBoardDto,
  toOrbitCaseCalendarDto,
  updateOrbitCaseSchema,
} from "@repo/orbit-case";
import {
  getOrbitCaseBoard,
  getOrbitCaseCalendar,
  updateOrbitCaseFields,
} from "@repo/orbit-case/server";
import { revalidateOrbitCaseMutation } from "@/lib/orbit-case-revalidate";

const moveCaseStatusSchema = updateOrbitCaseSchema.pick({
  caseId: true,
  status: true,
});

export const moveCaseStatus = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseBoardDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = moveCaseStatusSchema.parse(input);
    const status = orbitCaseStatusSchema.parse(parsed.status);
    await updateOrbitCaseFields(orgId, userId, parsed.caseId, { status });
    revalidateOrbitCaseMutation({
      organizationId: orgId,
      caseId: parsed.caseId,
    });
    return toOrbitCaseBoardDto(await getOrbitCaseBoard(orgId));
  });

export const getCalendarBoard = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseCalendarDto>> =>
  withOrg(async ({ orgId }) => {
    const parsed = orbitCaseCalendarBoardSchema.parse(input);
    return toOrbitCaseCalendarDto(
      await getOrbitCaseCalendar(orgId, parsed.year, parsed.month)
    );
  });
