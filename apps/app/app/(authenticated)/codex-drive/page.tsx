import type { Metadata } from "next";
import { WorkspaceRouteShell } from "../components/workspace-route-shell";

const title = "Codex Drive";
const description =
  "Object retrieval for uploads, downloads, shared media, attachments, imports, exports, and bucket-backed files.";

export const metadata: Metadata = {
  title,
  description,
};

export default function CodexDrivePage() {
  return (
    <WorkspaceRouteShell
      description={description}
      eyebrow="Work / Codex Drive"
      items={[
        {
          label: "Objects",
          description:
            "Browse documents, images, media, contracts, and exports.",
        },
        {
          label: "Sharing",
          description:
            "Review object access, shared links, and handoff context.",
        },
        {
          label: "Buckets",
          description:
            "Trace uploaded, downloaded, imported, and attached object sources.",
        },
      ]}
      title={title}
    />
  );
}
