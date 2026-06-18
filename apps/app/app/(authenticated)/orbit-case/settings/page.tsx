import { getOrganizationRole } from "@repo/auth/cms";
import { requireOrg } from "@repo/auth/server";
import { ensureSystemPushDefaults, listAdminPushRegistry } from "@repo/orbit-case/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "../../_components/header";
import { OrbitPushRegistryAdmin } from "./_components/orbit-push-registry-admin";

export const metadata: Metadata = {
  title: "Orbit Case push registry",
  description: "Manage tenant push destinations and templates.",
};

export default async function OrbitCaseSettingsPage() {
  const { orgId, userId } = await requireOrg();
  const role = await getOrganizationRole(userId, orgId);

  if (role !== "owner") {
    redirect("/orbit-case");
  }

  ensureSystemPushDefaults();
  const registry = await listAdminPushRegistry(orgId);

  return (
    <>
      <Header
        description="Owner-only registry for push destinations and field templates."
        eyebrow="Work / Orbit Case / Settings"
        title="Push registry"
      />
      <OrbitPushRegistryAdmin
        destinations={registry.destinations}
        templates={registry.templates}
      />
    </>
  );
}
