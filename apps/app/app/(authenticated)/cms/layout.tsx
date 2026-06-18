import { requireEditor } from "@repo/auth/cms";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CollectionNav } from "./_components/collection-nav";

interface CmsLayoutProperties {
  readonly children: ReactNode;
}

const CmsLayout = async ({ children }: CmsLayoutProperties) => {
  try {
    await requireEditor();
  } catch {
    redirect("/");
  }

  return (
    <div className="flex min-h-full flex-col gap-6 p-[var(--xforge-space-7)] pt-0">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-tight">Content</h1>
        <p className="text-muted-foreground text-sm">
          Manage marketing blog posts and legal pages.
        </p>
      </div>
      <CollectionNav />
      {children}
    </div>
  );
};

export default CmsLayout;
