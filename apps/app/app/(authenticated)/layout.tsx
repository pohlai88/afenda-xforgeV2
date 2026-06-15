import { getUserDisplayName } from "@repo/auth/metadata";
import { resolveServerMfaRedirect } from "@repo/auth/mfa-login.server";
import {
  createOrganization,
  getOrganizations,
  hasPendingOrganizationInvite,
  switchOrganization,
} from "@repo/auth/organizations";
import { auth, currentUser } from "@repo/auth/server";
import { SidebarProvider } from "@repo/design-system/design-system";
import { showBetaFeature } from "@repo/feature-flags";
import { secure } from "@repo/security";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { env } from "@/env";
import { MfaChallengeShell } from "./components/mfa-challenge-shell";
import { GlobalSidebar } from "./components/sidebar";

export const dynamic = "force-dynamic";

interface AppLayoutProperties {
  readonly children: ReactNode;
}

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(["CATEGORY:PREVIEW"]);
  }

  const user = await currentUser();
  const betaFeature = await showBetaFeature();

  if (!user) {
    redirect("/sign-in");
  }

  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/";
  const search = headerStore.get("x-search") ?? "";

  if (!pathname.startsWith("/mfa-challenge")) {
    const mfaRedirect = await resolveServerMfaRedirect(`${pathname}${search}`);

    if (mfaRedirect) {
      redirect(mfaRedirect);
    }
  } else {
    return <MfaChallengeShell>{children}</MfaChallengeShell>;
  }

  let { orgId } = await auth();

  if (!orgId) {
    const organizations = await getOrganizations(user.id);

    if (organizations.length === 0 && !hasPendingOrganizationInvite(user.user_metadata)) {
      const organization = await createOrganization("My Organization", user.id);
      orgId = organization.id;
    } else if (organizations.length > 0) {
      await switchOrganization(organizations[0].id);
      orgId = organizations[0].id;
    }
  }

  return (
    <SidebarProvider>
      <GlobalSidebar
        activeOrganizationId={orgId}
        userEmail={user.email}
        userName={getUserDisplayName(user.user_metadata)}
      >
        {betaFeature && (
          <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
            Beta feature now available
          </div>
        )}
        {children}
      </GlobalSidebar>
    </SidebarProvider>
  );
};

export default AppLayout;
