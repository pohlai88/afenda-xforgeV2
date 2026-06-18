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
    const organizations = await getOrganizations(user.id);

    if (
      organizations.length === 0 &&
      !hasPendingOrganizationInvite(user.user_metadata)
    ) {
      const organization = await createOrganization("My Organization", user.id);
      orgId = organization.id;
    } else if (organizations.length > 0) {
      await switchOrganization(organizations[0].id);
      orgId = organizations[0].id;
    }
  }

  return (
    <>
      {betaFeature ? (
        <div className="rounded-[var(--card-radius)] border border-[var(--status-info)]/25 bg-[var(--status-info)]/10 px-3 py-2 text-center text-[length:var(--xforge-font-caption-size)] text-[var(--status-info)]">
          Beta feature now available
        </div>
      ) : null}
      {children}
    </>
  );
};
