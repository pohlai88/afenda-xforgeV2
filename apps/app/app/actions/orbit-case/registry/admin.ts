"use server";

import { withOwner } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import {
  deletePushDestinationSchema,
  deletePushTemplateSchema,
  upsertPushDestinationSchema,
  upsertPushTemplateSchema,
} from "@repo/orbit-case";
import {
  deleteOrgPushDestination,
  deleteOrgPushTemplate,
  listAdminPushRegistry,
  upsertOrgPushDestination,
  upsertOrgPushTemplate,
} from "@repo/orbit-case/server";
import { revalidatePath } from "next/cache";
import { revalidateOrbitCaseMutation } from "@/lib/orbit-case-revalidate";

export const getPushRegistryAdmin = async () =>
  withOwner(async ({ orgId }) => listAdminPushRegistry(orgId));

export const savePushDestination = async (
  input: unknown
): Promise<AuthActionResult<{ rowId: string }>> =>
  withOwner(async ({ orgId }) => {
    upsertPushDestinationSchema.parse(input);
    const rowId = await upsertOrgPushDestination(orgId, input);
    revalidatePath("/orbit-case/settings");
    revalidateOrbitCaseMutation({ organizationId: orgId });
    return { rowId };
  });

export const removePushDestination = async (
  input: unknown
): Promise<AuthActionResult<{ deleted: number }>> =>
  withOwner(async ({ orgId }) => {
    deletePushDestinationSchema.parse(input);
    const deleted = await deleteOrgPushDestination(orgId, input);
    revalidatePath("/orbit-case/settings");
    revalidateOrbitCaseMutation({ organizationId: orgId });
    return { deleted };
  });

export const savePushTemplate = async (
  input: unknown
): Promise<AuthActionResult<{ templateId: string }>> =>
  withOwner(async ({ orgId }) => {
    upsertPushTemplateSchema.parse(input);
    const templateId = await upsertOrgPushTemplate(orgId, input);
    revalidatePath("/orbit-case/settings");
    revalidateOrbitCaseMutation({ organizationId: orgId });
    return { templateId };
  });

export const removePushTemplate = async (
  input: unknown
): Promise<AuthActionResult<{ deleted: number }>> =>
  withOwner(async ({ orgId }) => {
    deletePushTemplateSchema.parse(input);
    const deleted = await deleteOrgPushTemplate(orgId, input);
    revalidatePath("/orbit-case/settings");
    revalidateOrbitCaseMutation({ organizationId: orgId });
    return { deleted };
  });
