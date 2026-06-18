"use client";

import {
  AfendaAppContentBottomDrawer,
  Badge,
  blockRecipe,
  cn,
} from "@repo/design-system";
import { FileSearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  EVIDENCE_7W1H_DIMENSIONS,
  resolveEvidenceDrawerContext,
  type Evidence7w1hDimensionKey,
  type Evidence7w1hEntry,
} from "@/lib/app-shell/evidence-7w1h";

function Evidence7w1hCell({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="grid min-w-[8.5rem] gap-0.5">
      <dt className="text-[length:var(--xforge-font-caption-size)] font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </dt>
      <dd className="text-sm leading-snug text-text-primary">{value}</dd>
    </div>
  );
}

function Evidence7w1hRow({ entry }: { readonly entry: Evidence7w1hEntry }) {
  return (
    <article
      className={cn(
        blockRecipe("blockPanel"),
        "min-w-[min(100%,42rem)] shrink-0 border border-border-default bg-background p-3"
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{entry.what}</Badge>
        <span className="text-[length:var(--xforge-font-caption-size)] text-text-secondary">
          {entry.when}
        </span>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EVIDENCE_7W1H_DIMENSIONS.map((dimension) => (
          <Evidence7w1hCell
            key={`${entry.id}-${dimension.key}`}
            label={dimension.label}
            value={entry[dimension.key as Evidence7w1hDimensionKey]}
          />
        ))}
      </dl>
    </article>
  );
}

export function EvidenceDrawer() {
  const pathname = usePathname();
  const context = useMemo(
    () => resolveEvidenceDrawerContext(pathname),
    [pathname]
  );

  return (
    <AfendaAppContentBottomDrawer className="flex min-h-0 flex-col p-0">
      <header className="flex shrink-0 items-center gap-2 border-b border-border-default px-3 py-2 sm:px-4">
        <FileSearchIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-text-secondary"
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm text-text-primary">Evidence</p>
          <p className="truncate text-[length:var(--xforge-font-caption-size)] text-text-secondary">
            7W1H audit trail · {context.scopeLabel}
          </p>
        </div>
        <Badge variant="soft">{context.subjectLabel}</Badge>
      </header>

      <div className="min-h-0 flex-1 overflow-auto px-3 py-3 sm:px-4">
        {context.entries.length === 0 ? (
          <p className={cn(blockRecipe("blockDescription"), "px-1")}>
            No evidence events recorded for this view yet.
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {context.entries.map((entry) => (
              <Evidence7w1hRow entry={entry} key={entry.id} />
            ))}
          </div>
        )}
      </div>
    </AfendaAppContentBottomDrawer>
  );
}
