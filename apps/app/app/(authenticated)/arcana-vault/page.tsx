import type { Metadata } from "next";
import { RouteSections } from "../_components/route-sections";

const title = "Arcana Vault";
const description =
  "A user-owned room for drafts, notes, bookmarks, pins, and private files.";

export const metadata: Metadata = {
  title,
  description,
};

export default function ArcanaVaultPage() {
  return (
    <RouteSections
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
