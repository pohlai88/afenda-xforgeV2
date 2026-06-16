import type { Metadata } from "next";
import { WorkspaceRouteShell } from "../components/workspace-route-shell";

const title = "Arcana Vault";
const description =
  "A user-owned room for drafts, notes, bookmarks, pins, and private files.";

export const metadata: Metadata = {
  title,
  description,
};

export default function ArcanaVaultPage() {
  return (
    <WorkspaceRouteShell
      description={description}
      eyebrow="Work / Arcana Vault"
      items={[
        {
          label: "Drafts",
          description: "Keep unfinished cases, forms, and workspace fragments.",
        },
        {
          label: "Pins",
          description:
            "Hold personal shortcuts, objects, and module references.",
        },
        {
          label: "Private files",
          description:
            "Store user-owned material inside tenant-controlled policy limits.",
        },
      ]}
      title={title}
    />
  );
}
