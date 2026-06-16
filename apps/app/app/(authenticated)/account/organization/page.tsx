import { canOwnOrg, getOrganizationRole } from "@repo/auth/cms";
import { OrganizationManager } from "@repo/auth/components/organization-manager";
import { getOrganizations } from "@repo/auth/organizations";
import { auth, currentUser } from "@repo/auth/server";
import { cn, recipe } from "@repo/design-system/design-system";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const title = "Organization";
const description =
  "Create workspaces, rename your active org, and invite members.";

export const metadata: Metadata = createMetadata({ title, description });

const OrganizationPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { orgId } = await auth();
  const organizations = await getOrganizations(user.id);
  const role = orgId ? await getOrganizationRole(user.id, orgId) : null;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-2xl flex-col p-6",
        recipe("sectionGap")
      )}
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl text-text-primary tracking-tight">
          {title}
        </h1>
        <p className={recipe("captionText")}>{description}</p>
      </div>
      <OrganizationManager
        activeOrganizationId={orgId}
        canManageActiveOrganization={canOwnOrg(role)}
        organizations={organizations.map((organization) => ({
          id: organization.id,
          name: organization.name,
        }))}
      />
    </div>
  );
};

export default OrganizationPage;
