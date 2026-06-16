"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  buildOrbitCaseCreatedEvent,
  createOrbitCaseSchema,
  type OrbitCaseDto,
  toOrbitCaseDto,
} from "@repo/orbit-case";
import { createOrbitCase } from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";
import { emitOrgEvent } from "@/lib/emit-org-event";

export const createCase = async (
  input: unknown
): Promise<AuthActionResult<OrbitCaseDto>> =>
  withOrg(async ({ orgId, userId }) => {
    const parsed = createOrbitCaseSchema.parse(input);
    const created = await createOrbitCase(orgId, userId, parsed);
    const dto = toOrbitCaseDto(created);
    revalidatePath("/orbit-case");
    await emitOrgEvent(
      orgId,
      "orbit.case.created",
      buildOrbitCaseCreatedEvent({
        caseId: dto.id,
        title: dto.title,
        status: dto.status,
        createdAt: dto.createdAt,
        createdBy: dto.createdBy,
      })
    );
    return dto;
  });
