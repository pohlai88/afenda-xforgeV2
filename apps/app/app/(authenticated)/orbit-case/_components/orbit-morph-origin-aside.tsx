import { Badge, blockRecipe, cn } from "@repo/design-system";
import Link from "next/link";
import type { ReactNode } from "react";

interface OrbitMorphOriginAsideProps {
  readonly allItemsHref: string;
  readonly allItemsLabel: string;
  readonly originCaseId: string;
  readonly originCaseTitle: string | null;
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
        <p className="text-sm text-text-secondary">Origin case unavailable</p>
      )}
    </div>
    <Link
      className="text-sm text-text-secondary hover:text-text-primary"
      href={allItemsHref}
    >
      {allItemsLabel}
    </Link>
  </aside>
);

interface OrbitMorphDetailLayoutProps {
  readonly aside: ReactNode;
  readonly children: ReactNode;
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
