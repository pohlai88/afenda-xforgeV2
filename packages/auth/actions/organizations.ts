"use server";

import {
  getOrganizations,
  switchOrganization,
} from "@repo/auth/organizations";
import { withAuth } from "@repo/auth/guards";
import { revalidatePath } from "next/cache";

export const getActiveOrganizations = async () => {
  const result = await withAuth(async ({ userId }) => getOrganizations(userId));

  return result.ok ? result.data : [];
};

export const switchActiveOrganization = async (organizationId: string) => {
  await switchOrganization(organizationId);
  revalidatePath("/", "layout");
};
