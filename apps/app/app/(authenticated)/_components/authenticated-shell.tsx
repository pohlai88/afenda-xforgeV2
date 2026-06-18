"use client";

import {
  AfendaAppContentHeader,
  AfendaAppShell,
  AfendaAppSidebar,
} from "@repo/design-system";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { renderAuthenticatedSidebarLink } from "@/lib/app-shell/sidebar-link";
import { authenticatedAppSidebarNavDescriptor } from "@/lib/app-shell/sidebar-nav.descriptor";
import { authenticatedAppSidebarNavIconRegistry } from "@/lib/app-shell/sidebar-nav.registry";
import { OrbitCaseLeftRail } from "../orbit-case/_components/orbit-case-left-rail";
import { EvidenceDrawer } from "./evidence-drawer";
import { LynxAiRightRail } from "./lynx-ai-right-rail";
import {
  parseOrbitCaseRoute,
  resolveOrbitCaseBreadcrumbs,
} from "@/lib/app-shell/orbit-case-route-context";

interface AuthenticatedShellProperties {
  readonly children: ReactNode;
}

function useAppShellModuleChrome(pathname: string) {
  return useMemo(() => {
    const orbitContext = parseOrbitCaseRoute(pathname);

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
  }, [pathname]);
}

export function AuthenticatedShell({ children }: AuthenticatedShellProperties) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { breadcrumbs, contentLeftRail, defaultContentLeftRailOpen } =
    useAppShellModuleChrome(pathname);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (pathname.startsWith("/mfa-challenge")) {
    return <>{children}</>;
  }

  if (!isMounted) {
    return <div className="min-h-svh bg-background" />;
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
      sidebar={
        <AfendaAppSidebar
          navDescriptor={authenticatedAppSidebarNavDescriptor}
          navIconRegistry={authenticatedAppSidebarNavIconRegistry}
          pathname={pathname}
          renderLink={renderAuthenticatedSidebarLink}
        />
      }
    >
      {children}
    </AfendaAppShell>
  );
}
