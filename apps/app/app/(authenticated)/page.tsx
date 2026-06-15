import { requireOrg } from "@repo/auth/server";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { AvatarStack } from "./components/avatar-stack";
import { Cursors } from "./components/cursors";
import { Header } from "./components/header";
import { WorkspaceCockpit } from "./components/workspace-cockpit";

const title = "Acme Inc";
const description = "My application.";

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
      <Header page="Governed workspace" pages={["XForge"]}>
        {env.LIVEBLOCKS_SECRET && (
          <CollaborationProvider orgId={orgId}>
            <AvatarStack />
            <Cursors />
          </CollaborationProvider>
        )}
      </Header>
      <WorkspaceCockpit />
    </>
  );
};

export default App;
