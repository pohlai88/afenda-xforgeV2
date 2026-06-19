/** Serializable organization summary for app-shell chrome. */
export interface AuthenticatedAppShellOrganization {
  readonly id: string;
  readonly name: string;
}

export function mapAuthenticatedAppShellOrganizations(
  organizations: readonly { readonly id: string; readonly name: string }[]
): readonly AuthenticatedAppShellOrganization[] {
  return organizations.map((organization) => ({
    id: organization.id,
    name: organization.name,
  }));
}
