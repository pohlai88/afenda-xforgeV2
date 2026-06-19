"use client";

import {
  AfendaAppContentHeader,
  AfendaAppFooter,
  AfendaAppShell,
  AfendaAppSidebar,
  type SidebarNavUserMenuItem,
} from "@repo/design-system";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, type ReactNode } from "react";
import {
  type AuthenticatedAppShellChrome,
  AUTHENTICATED_SIDEBAR_SIGN_OUT_MENU_ITEM_ID,
  authenticatedAppSidebarNavDescriptor,
  authenticatedAppSidebarNavIconRegistry,
  authenticatedSidebarNavUserMenuGroups,
  filterAuthenticatedAppSidebarNav,
  parseOrbitCaseRoute,
  renderAuthenticatedSidebarLink,
  resolveOrbitCaseBreadcrumbs,
  useAuthenticatedSignOut,
} from "@/lib/app-shell";
import { OrbitCaseLeftRail } from "../orbit-case/_components/orbit-case-left-rail";
import { AuthenticatedAppTopbar } from "./authenticated-app-topbar";
import { EvidenceDrawer } from "./evidence-drawer";
import { LynxAiRightRail } from "./lynx-ai-right-rail";

interface AuthenticatedShellProperties extends AuthenticatedAppShellChrome {
  readonly children: ReactNode;
  readonly showOrbitCaseNav: boolean;
}

function useAppShellModuleChrome(pathname: string, showOrbitCaseNav: boolean) {
  return useMemo(() => {
    const orbitContext = showOrbitCaseNav
      ? parseOrbitCaseRoute(pathname)
      : null;

    if (!orbitContext) {
      return {
        breadcrumbs: undefined,
        contentLeftRail: undefined,
        defaultContentLeftRailOpen: undefined,
      };
    }

    return {
      breadcrumbs: resolveOrbitCaseBreadcrumbs(orbitContext),
      contentLeftRail: <OrbitCaseLeftRail context={orbitContext} />,
      defaultContentLeftRailOpen: true,
    };
  }, [pathname, showOrbitCaseNav]);
}

export function AuthenticatedShell({
  activeOrganizationId,
  children,
  defaultSidebarBehaviorMode,
  footerCopyrightHolder,
  footerLinks,
  organizations,
  showOrbitCaseNav,
  tenantId,
  user,
  userId,
}: AuthenticatedShellProperties) {
  const pathname = usePathname();
  const { isSigningOut, signOut } = useAuthenticatedSignOut();
  const navDescriptor = useMemo(
    () =>
      showOrbitCaseNav
        ? authenticatedAppSidebarNavDescriptor
        : filterAuthenticatedAppSidebarNav(authenticatedAppSidebarNavDescriptor, [
            "orbit-case",
          ]),
    [showOrbitCaseNav]
  );
  const { breadcrumbs, contentLeftRail, defaultContentLeftRailOpen } =
    useAppShellModuleChrome(pathname, showOrbitCaseNav);

  const handleNavUserMenuItemSelect = useCallback(
    (item: SidebarNavUserMenuItem) => {
      if (item.href || item.id !== AUTHENTICATED_SIDEBAR_SIGN_OUT_MENU_ITEM_ID) {
        return;
      }

      if (isSigningOut) {
        return;
      }

      signOut();
    },
    [isSigningOut, signOut]
  );

  if (pathname.startsWith("/mfa-challenge")) {
    return <>{children}</>;
  }

  return (
    <AfendaAppShell
      contentBottomDrawer={<EvidenceDrawer />}
      contentHeader={
        breadcrumbs ? (
          <AfendaAppContentHeader breadcrumbs={breadcrumbs} />
        ) : undefined
      }
      contentLeftRail={contentLeftRail}
      contentRightRail={<LynxAiRightRail />}
      defaultContentLeftRailOpen={defaultContentLeftRailOpen}
      defaultContentRightRailOpen
      defaultSidebarBehaviorMode={defaultSidebarBehaviorMode}
      footer={
        <AfendaAppFooter
          copyrightHolder={footerCopyrightHolder}
          links={footerLinks}
        />
      }
      sidebar={
        <AfendaAppSidebar
          navDescriptor={navDescriptor}
          navIconRegistry={authenticatedAppSidebarNavIconRegistry}
          navUserMenuGroups={authenticatedSidebarNavUserMenuGroups}
          onNavUserMenuItemSelect={handleNavUserMenuItemSelect}
          pathname={pathname}
          renderLink={renderAuthenticatedSidebarLink}
          renderNavUserMenuLink={renderAuthenticatedSidebarLink}
          user={user}
        />
      }
      topbar={
        <AuthenticatedAppTopbar
          activeOrganizationId={activeOrganizationId}
          organizations={organizations}
          showOrbitNotifications={showOrbitCaseNav}
          tenantId={tenantId ?? undefined}
          userId={userId}
        />
      }
    >
      {children}
    </AfendaAppShell>
  );
}
