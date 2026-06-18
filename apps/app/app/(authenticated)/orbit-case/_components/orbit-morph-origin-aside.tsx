import { Badge, blockRecipe } from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

interface OrbitMorphOriginAsideProps {
  allItemsHref: string;
  allItemsLabel: string;
  originCaseId: string;
  originCaseTitle: string | null;
}

export const OrbitMorphOriginAside = ({
  allItemsHref,
  allItemsLabel,
  originCaseId,
  originCaseTitle,
}: OrbitMorphOriginAsideProps) => (
  <aside
    className={cn(
      blockRecipe("blockPanel", "blockPanelPadding"),
      "grid h-fit gap-4"
    )}
  >
    <div className="grid gap-2">
      <Badge variant="soft">From Orbit Case</Badge>
      {originCaseTitle ? (
        <Link
          className="font-medium text-sm hover:underline"
          href={`/orbit-case/${originCaseId}`}
        >
          {originCaseTitle}
        </Link>
      ) : (
        <p className="text-muted-foreground text-sm">Origin case unavailable</p>
      )}
    </div>
    <Link
      className="text-muted-foreground text-sm hover:text-foreground"
      href={allItemsHref}
    >
      {allItemsLabel}
    </Link>
  </aside>
);

interface OrbitMorphDetailLayoutProps {
  aside: ReactNode;
  children: ReactNode;
}

export const OrbitMorphDetailLayout = ({
  aside,
  children,
}: OrbitMorphDetailLayoutProps) => (
  <div className="grid gap-6 p-[var(--xforge-space-8)] lg:grid-cols-[1fr_320px]">
    {children}
    {aside}
  </div>
);
