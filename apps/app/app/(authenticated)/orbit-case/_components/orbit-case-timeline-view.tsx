"use client";

import { Badge, blockRecipe } from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { OrbitCaseTimelineDto } from "@repo/orbit-case";
import { formatOrbitCaseDueDateLabel } from "@repo/orbit-case";
import Link from "next/link";

interface OrbitCaseTimelineViewProps {
  timeline: OrbitCaseTimelineDto;
}

const statusLabel = {
  backlog: "Backlog",
  ready: "Ready",
  doing: "Doing",
  waiting: "Waiting",
  done: "Done",
  cancelled: "Cancelled",
} as const;

export function OrbitCaseTimelineView({
  timeline,
}: OrbitCaseTimelineViewProps) {
  return (
    <div className="grid gap-4">
      {timeline.groups.map((group) => (
        <section
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid gap-3"
          )}
          key={group.bucket}
        >
          <h3 className={blockRecipe("blockTitle")}>{group.label}</h3>
          {group.cases.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No cases in this bucket.
            </p>
          ) : (
            group.cases.map((orbitCase) => (
              <Link href={`/orbit-case/${orbitCase.id}`} key={orbitCase.id}>
                <article className="rounded-md border bg-background p-3 text-sm transition-colors hover:bg-muted/30">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{orbitCase.title}</p>
                    <Badge variant="outline">
                      {statusLabel[orbitCase.status]}
                    </Badge>
                    {orbitCase.dueAt ? (
                      <Badge variant="soft">
                        Due {formatOrbitCaseDueDateLabel(orbitCase.dueAt)}
                      </Badge>
                    ) : null}
                  </div>
                </article>
              </Link>
            ))
          )}
        </section>
      ))}
    </div>
  );
}
