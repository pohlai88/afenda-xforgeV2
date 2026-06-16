import type { OrganizationRole } from "@repo/auth/organization-roles";
import {
  ORBIT_PUSH_CAPABILITIES,
  orbitPushCapabilitySchema,
  type OrbitPushCapability,
} from "@repo/orbit-case";

const EDITOR_CAPABILITIES: OrbitPushCapability[] = [
  "budget",
  "meeting",
  "approval",
  "task",
];

const MEMBER_CAPABILITIES: OrbitPushCapability[] = ["meeting", "task"];

export const orbitCaseCapabilitiesForRole = (
  role: OrganizationRole
): OrbitPushCapability[] => {
  switch (role) {
    case "owner":
      return [...ORBIT_PUSH_CAPABILITIES];
    case "editor":
      return EDITOR_CAPABILITIES;
    case "member":
      return MEMBER_CAPABILITIES;
    default:
      return [];
  }
};

export const resolveOrbitPushCapabilities = (
  role: OrganizationRole,
  claimValues: readonly string[] | undefined
): OrbitPushCapability[] => {
  const fromClaims = (claimValues ?? []).flatMap((value) => {
    const parsed = orbitPushCapabilitySchema.safeParse(value);
    return parsed.success ? [parsed.data] : [];
  });

  if (fromClaims.length > 0) {
    return [...new Set(fromClaims)];
  }

  return orbitCaseCapabilitiesForRole(role);
};
