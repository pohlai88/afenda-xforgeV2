import type { OrganizationRole } from "@repo/auth/organization-roles";
import {
  ORBIT_PUSH_CAPABILITIES,
  orbitPushCapabilitySchema,
  type OrbitPushCapability,
} from "./push.schema";

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

const parseClaimCapabilities = (
  claimValues: readonly string[] | undefined,
  roleCeiling: ReadonlySet<OrbitPushCapability>
): OrbitPushCapability[] => {
  const parsed: OrbitPushCapability[] = [];

  for (const value of claimValues ?? []) {
    const result = orbitPushCapabilitySchema.safeParse(value);
    if (result.success && roleCeiling.has(result.data)) {
      parsed.push(result.data);
    }
  }

  return [...new Set(parsed)];
};

/**
 * Resolves push capabilities for the current org role.
 *
 * Live DB role is always the authority ceiling. JWT claims are optional hints
 * capped to that ceiling; missing, empty, invalid, or stale claims fall back
 * to role defaults (no manual re-sign-in required for authorization).
 */
export const resolveOrbitPushCapabilities = (
  role: OrganizationRole,
  claimValues: readonly string[] | undefined
): OrbitPushCapability[] => {
  const roleDefaults = orbitCaseCapabilitiesForRole(role);
  const roleCeiling = new Set(roleDefaults);
  const fromClaims = parseClaimCapabilities(claimValues, roleCeiling);

  if (fromClaims.length > 0) {
    return fromClaims;
  }

  return roleDefaults;
};
