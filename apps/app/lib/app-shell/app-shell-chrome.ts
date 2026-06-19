import { getUserAvatarUrl, getUserDisplayName } from "@repo/auth/metadata";
import type {
  AfendaAppShellUserSummary,
  SidebarBehaviorMode,
} from "@repo/design-system";
import {
  authenticatedAppShellFooterLinks,
  type AuthenticatedAppShellFooterLink,
} from "./footer-links";
import {
  mapAuthenticatedAppShellOrganizations,
  type AuthenticatedAppShellOrganization,
} from "./organizations";

/** Serializable chrome props passed from the authenticated layout server boundary. */
export interface AuthenticatedAppShellChrome {
  readonly activeOrganizationId: string | null;
  readonly defaultSidebarBehaviorMode: SidebarBehaviorMode;
  readonly footerCopyrightHolder: string;
  readonly footerLinks: readonly AuthenticatedAppShellFooterLink[];
  readonly organizations: readonly AuthenticatedAppShellOrganization[];
  readonly tenantId: string | null;
  readonly user: AfendaAppShellUserSummary;
  readonly userId: string;
}

interface ResolveAuthenticatedAppShellChromeInput {
  readonly activeOrganizationId: string | null;
  readonly defaultSidebarBehaviorMode: SidebarBehaviorMode;
  readonly email: string | null | undefined;
  readonly organizations: readonly { readonly id: string; readonly name: string }[];
  readonly orgId: string | null;
  readonly userId: string;
  readonly userMetadata: Record<string, unknown> | undefined;
}

export function resolveAuthenticatedAppShellUserSummary(input: {
  readonly email: string | null | undefined;
  readonly userMetadata: Record<string, unknown> | undefined;
}): AfendaAppShellUserSummary {
  const name =
    getUserDisplayName(input.userMetadata) ??
    input.email ??
    "Signed-in user";
  const email = input.email ?? "";
  const avatar = getUserAvatarUrl(input.userMetadata) ?? "";

  return { avatar, email, name };
}

export function resolveAuthenticatedAppShellChrome({
  activeOrganizationId,
  defaultSidebarBehaviorMode,
  email,
  organizations,
  orgId,
  userId,
  userMetadata,
}: ResolveAuthenticatedAppShellChromeInput): AuthenticatedAppShellChrome {
  return {
    activeOrganizationId,
    defaultSidebarBehaviorMode,
    footerCopyrightHolder: "Afenda",
    footerLinks: authenticatedAppShellFooterLinks,
    organizations: mapAuthenticatedAppShellOrganizations(organizations),
    tenantId: orgId,
    user: resolveAuthenticatedAppShellUserSummary({ email, userMetadata }),
    userId,
  };
}
