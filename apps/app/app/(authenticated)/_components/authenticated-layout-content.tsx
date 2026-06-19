import { resolveServerMfaRedirect } from "@repo/auth/mfa-login.server";
import {
  createOrganization,
  getOrganizations,
  hasPendingOrganizationInvite,
  switchOrganization,
} from "@repo/auth/organizations";
import { auth, currentUser } from "@repo/auth/server";
import { showBetaFeature } from "@repo/feature-flags";
import { secure } from "@repo/security";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { env } from "@/env";
import { resolveAuthenticatedAppShellChrome } from "@/lib/app-shell";
import { resolveAuthenticatedSidebarBehaviorMode } from "@/lib/app-shell/resolve-sidebar-behavior-mode.server";
import { resolveOrbitCaseEnabled } from "@/lib/orbit-case-access";
import { AuthenticatedShell } from "./authenticated-shell";
import { MfaChallengeShell } from "./mfa-challenge-shell";

interface AuthenticatedLayoutContentProperties {
  readonly children: ReactNode;
}

export const AuthenticatedLayoutContent = async ({
  children,
}: AuthenticatedLayoutContentProperties) => {
  if (env.ARCJET_KEY) {
    await secure(["CATEGORY:PREVIEW"]);
  }

  const user = await currentUser();
  const betaFeature = await showBetaFeature();
  const showOrbitCaseNav = await resolveOrbitCaseEnabled();
  const defaultSidebarBehaviorMode =
    await resolveAuthenticatedSidebarBehaviorMode();

  if (!user) {
    redirect("/sign-in");
  }

  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/";
  const search = headerStore.get("x-search") ?? "";

  if (pathname.startsWith("/mfa-challenge")) {
    return <MfaChallengeShell>{children}</MfaChallengeShell>;
  }

  const mfaRedirect = await resolveServerMfaRedirect(`${pathname}${search}`);

  if (mfaRedirect) {
    redirect(mfaRedirect);
  }

  let { orgId } = await auth();

  if (!orgId) {
    const bootstrapOrganizations = await getOrganizations(user.id);

    if (
      bootstrapOrganizations.length === 0 &&
      !hasPendingOrganizationInvite(user.user_metadata)
    ) {
      const organization = await createOrganization("My Organization", user.id);
      orgId = organization.id;
    } else if (bootstrapOrganizations.length > 0) {
      await switchOrganization(bootstrapOrganizations[0].id);
      orgId = bootstrapOrganizations[0].id;
    }
  }

  const organizations = await getOrganizations(user.id);

  const appShellChrome = resolveAuthenticatedAppShellChrome({
    activeOrganizationId: orgId ?? null,
    defaultSidebarBehaviorMode,
    email: user.email,
    organizations,
    orgId: orgId ?? null,
    userId: user.id,
    userMetadata: user.user_metadata,
  });

  return (
    <>
      {betaFeature ? (
        <div className="rounded-[var(--card-radius)] border border-[var(--status-info)]/25 bg-[var(--status-info)]/10 px-3 py-2 text-center text-[length:var(--xforge-font-caption-size)] text-[var(--status-info)]">
          Beta feature now available
        </div>
      ) : null}
      <AuthenticatedShell
        showOrbitCaseNav={showOrbitCaseNav}
        {...appShellChrome}
      >
        {children}
      </AuthenticatedShell>
    </>
  );
};
