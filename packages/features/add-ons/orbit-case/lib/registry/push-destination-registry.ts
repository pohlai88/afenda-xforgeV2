import type { OrganizationRole } from "@repo/auth/organization-roles";
import type {
  OrbitPushCapability,
  PushDestinationDefinition,
} from "../../contract/push.schema";

const destinations = new Map<string, PushDestinationDefinition>();

export interface ResolvePushDestinationsInput {
  orgId: string;
  role: OrganizationRole;
  userCapabilities: readonly OrbitPushCapability[];
  userId: string;
}

export const registerPushDestination = (
  definition: PushDestinationDefinition
): void => {
  destinations.set(definition.id, definition);
};

export const clearPushDestinations = (): void => {
  destinations.clear();
};

export const resolvePushDestinations = ({
  role,
  userCapabilities,
}: ResolvePushDestinationsInput): PushDestinationDefinition[] =>
  resolvePushDestinationsWithList(
    { orgId: "", role, userCapabilities, userId: "" },
    [...destinations.values()]
  );

export const resolvePushDestinationsWithList = (
  { role, userCapabilities }: ResolvePushDestinationsInput,
  destinationList: PushDestinationDefinition[]
): PushDestinationDefinition[] => {
  const capabilitySet = new Set(userCapabilities);

  return destinationList.filter((destination) => {
    if (!destination.visibleToRoles.includes(role)) {
      return false;
    }

    return destination.requiredCapabilities.every((capability) =>
      capabilitySet.has(capability)
    );
  });
};

export const getPushDestination = (
  destinationId: string
): PushDestinationDefinition | null => destinations.get(destinationId) ?? null;

export const isPushDestinationRegistered = (destinationId: string): boolean =>
  destinations.has(destinationId);

export const listInMemoryPushDestinations = (): PushDestinationDefinition[] => [
  ...destinations.values(),
];
