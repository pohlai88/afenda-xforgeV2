import type { OrbitPushCapability } from "./push.schema";
import { ORBIT_PUSH_CAPABILITIES } from "./push.schema";

/** Keep in sync with `packages/database/drizzle/0028_orbit_push_capabilities_align.sql`. */
export const ORBIT_PUSH_ROLE_CAPABILITIES = {
  owner: ORBIT_PUSH_CAPABILITIES,
  editor: ["budget", "meeting", "approval", "task"] as const satisfies readonly OrbitPushCapability[],
  member: ["meeting", "task"] as const satisfies readonly OrbitPushCapability[],
} as const;

export const orbitPushCapabilitiesJsonForRole = (role: string): string => {
  const capabilities =
    role === "owner" || role === "editor" || role === "member"
      ? ORBIT_PUSH_ROLE_CAPABILITIES[role]
      : ORBIT_PUSH_ROLE_CAPABILITIES.member;

  return JSON.stringify([...capabilities]);
};
