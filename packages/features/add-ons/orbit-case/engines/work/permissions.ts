import type { OrganizationRole } from "@repo/auth/organization-roles";

export const canMutateOrbitCase = (role: OrganizationRole): boolean =>
  role === "owner" || role === "editor" || role === "member";

export const canHardDeleteOrbitCase = (role: OrganizationRole): boolean =>
  role === "owner";
