"use server";

import { withOrg } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import { type OrbitObjectLinkDto, toOrbitObjectLinkDto } from "@repo/orbit-case";
import { listObjectLinksForCase } from "@repo/orbit-case/server";
import { z } from "zod";

const listLinksSchema = z.object({
  caseId: z.string().min(1),
});

export const listLinks = async (
  input: unknown
): Promise<AuthActionResult<OrbitObjectLinkDto[]>> =>
  withOrg(async ({ orgId }) => {
    const parsed = listLinksSchema.parse(input);
    const records = await listObjectLinksForCase(orgId, parsed.caseId);
    return records.map(toOrbitObjectLinkDto);
  });
