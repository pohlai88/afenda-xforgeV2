import { auth, currentUser } from "@repo/auth/server";
import {
  getUserDisplayName,
} from "@repo/auth/metadata";
import {
  createOrganization,
  getOrganizations,
  switchOrganization,
} from "@repo/auth/organizations";
import { SidebarProvider } from "@repo/design-system/components/ui/sidebar";
import { showBetaFeature } from "@repo/feature-flags";
import { secure } from "@repo/security";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { env } from "@/env";
import { NotificationsProvider } from "./components/notifications-provider";
import { GlobalSidebar } from "./components/sidebar";

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

  let { orgId } = await auth();

  if (!orgId) {
    const organizations = await getOrganizations(user.id);

    if (organizations.length === 0) {
      const organization = await createOrganization("My Organization", user.id);
      orgId = organization.id;
    } else {
      await switchOrganization(organizations[0].id);
      orgId = organizations[0].id;
    }
  }

  return (
    <NotificationsProvider userId={user.id}>
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
    </NotificationsProvider>
  );
};

export default AppLayout;
