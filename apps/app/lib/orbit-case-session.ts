import "server-only";

import { createClient } from "@repo/auth/server";
import {
  getOrbitPushCapabilitiesFromAccessTokenClaims,
  type SupabaseAccessTokenClaims,
} from "@repo/auth/access-token-claims";
import type { OrganizationRole } from "@repo/auth/organization-roles";
import { getOrganizationRole } from "@repo/auth/cms";
import type { OrbitPushCapability } from "@repo/orbit-case";
import { resolveOrbitPushCapabilities } from "@/lib/orbit-case-capabilities";

const readAccessTokenClaims = async (): Promise<SupabaseAccessTokenClaims | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return data.claims as SupabaseAccessTokenClaims;
};

export const getOrbitPushCapabilitiesForSession = async (
  userId: string,
  orgId: string
): Promise<OrbitPushCapability[]> => {
  const role = await getOrganizationRole(userId, orgId);

  if (!role) {
    return [];
  }

  const claims = await readAccessTokenClaims();
  const claimCapabilities =
    getOrbitPushCapabilitiesFromAccessTokenClaims(claims);

  return resolveOrbitPushCapabilities(role, claimCapabilities);
};
