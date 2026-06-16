import { requireOrg } from "@repo/auth/server";
import { Badge } from "@repo/design-system/design-system";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { env } from "@/env";
import { AvatarStack } from "./components/avatar-stack";
import { Cursors } from "./components/cursors";
import { Header } from "./components/header";
import { WorkspaceCockpitContent } from "./components/workspace-cockpit-content";
import { WorkspaceCockpitSkeleton } from "./components/workspace-cockpit-skeleton";

const title = "Governed workspace";
const description = "Tenant-scoped operations dashboard for Afenda XForge.";

const CollaborationProvider = dynamic(() =>
  import("./components/collaboration-provider").then(
    (mod) => mod.CollaborationProvider
  )
);

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  let orgId: string;

  try {
    ({ orgId } = await requireOrg());
  } catch {
    notFound();
  }

  return (
    <>
      <Header
        badge={
          <Badge tone="success" variant="outline">
            Controlled
          </Badge>
        }
        description="Review tenant scope, grants, and audit evidence before operational changes."
        eyebrow="Workspace / Overview"
        title="Governed workspace"
      >
        {env.LIVEBLOCKS_SECRET ? (
          <CollaborationProvider orgId={orgId}>
            <AvatarStack />
            <Cursors />
          </CollaborationProvider>
        ) : null}
      </Header>
      <Suspense fallback={<WorkspaceCockpitSkeleton />}>
        <WorkspaceCockpitContent orgId={orgId} />
      </Suspense>
    </>
  );
};

export default App;
