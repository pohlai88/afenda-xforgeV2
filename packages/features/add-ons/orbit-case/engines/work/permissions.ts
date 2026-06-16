import type { OrganizationRole } from "@repo/auth/organization-roles";
import type {
  OrbitPushCapability,
  PushDestinationDefinition,
} from "../../contract/push.schema";

export const canMutateOrbitCase = (role: OrganizationRole): boolean =>
  role === "owner" || role === "editor" || role === "member";

export const canHardDeleteOrbitCase = (role: OrganizationRole): boolean =>
  role === "owner";

export const canDeleteOrbitCaseAttachment = (
  role: OrganizationRole,
  attachment: { uploadedBy: string },
  actorId: string
): boolean => attachment.uploadedBy === actorId || role === "owner";

export const canPushToDestination = (
  role: OrganizationRole,
  userCapabilities: readonly OrbitPushCapability[],
  destination: PushDestinationDefinition
): boolean => {
  if (!destination.visibleToRoles.includes(role)) {
    return false;
  }

  const capabilitySet = new Set(userCapabilities);
  return destination.requiredCapabilities.every((capability) =>
    capabilitySet.has(capability)
  );
};
