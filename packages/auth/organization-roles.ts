export const ORGANIZATION_ROLES = ["owner", "editor", "member"] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

const ORGANIZATION_ROLE_SET = new Set<string>(ORGANIZATION_ROLES);

export const parseOrganizationRole = (
  value: unknown
): OrganizationRole | null => {
  if (typeof value !== "string" || !ORGANIZATION_ROLE_SET.has(value)) {
    return null;
  }

  return value as OrganizationRole;
};
