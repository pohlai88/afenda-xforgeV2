import { requireOrg } from "@repo/auth/server";
import { cache } from "react";
import { WorkspaceCockpitView } from "./workspace-cockpit-view";

const assertWorkspaceSnapshot = cache(async (orgId: string) => {
  const session = await requireOrg();

  if (session.orgId !== orgId) {
    throw new Error("Organization scope mismatch.");
  }
});

interface WorkspaceCockpitContentProperties {
  readonly orgId: string;
}

export async function WorkspaceCockpitContent({
  orgId,
}: WorkspaceCockpitContentProperties) {
  await assertWorkspaceSnapshot(orgId);
  return <WorkspaceCockpitView />;
}
