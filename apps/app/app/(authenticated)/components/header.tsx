import { blockRecipe } from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { ReactNode } from "react";

interface HeaderProps {
  readonly badge?: ReactNode;
  readonly children?: ReactNode;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly title: string;
}

export const Header = ({
  badge,
  children,
  description,
  eyebrow,
  title,
}: HeaderProps) => (
  <div
    className={cn(
      blockRecipe("blockHeader"),
      "shrink-0 border-border-default border-b px-[var(--xforge-space-8)] py-[var(--xforge-space-5)] antialiased"
    )}
    data-slot="page-header"
  >
    <div className={blockRecipe("blockHeaderContent")}>
      {eyebrow ? (
        <div className={blockRecipe("blockDescription")}>{eyebrow}</div>
      ) : null}
      <div className="flex min-w-0 items-center gap-2">
        <h1 className={cn(blockRecipe("blockTitle"), "tracking-tight")}>
          {title}
        </h1>
        {badge}
      </div>
      {description ? (
        <p
          className={cn(
            blockRecipe("blockDescription"),
            "max-w-prose truncate"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
    {children ? (
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    ) : null}
  </div>
);
