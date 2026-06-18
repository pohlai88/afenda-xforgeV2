"use client";

import {
  Button,
  blockRecipe,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";

const TABLE_ROW_KEYS = ["table-row-1", "table-row-2", "table-row-3"] as const;
const FILTER_KEYS = ["filter-1", "filter-2", "filter-3", "filter-4"] as const;
const METRIC_KEYS = ["metric-1", "metric-2", "metric-3", "metric-4"] as const;
const PANEL_KEYS = ["panel-1", "panel-2"] as const;
const LIST_ROW_KEYS = ["list-row-1", "list-row-2", "list-row-3"] as const;
const AUDIT_ROW_KEYS = ["audit-row-1", "audit-row-2", "audit-row-3"] as const;

function SkeletonTable({ rows = 3 }: { readonly rows?: number }) {
  const rowKeys = TABLE_ROW_KEYS.slice(0, rows);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-8 px-3 py-2">
            <Skeleton className="h-3 w-16" />
          </TableHead>
          <TableHead className="h-8 px-3 py-2">
            <Skeleton className="h-3 w-20" />
          </TableHead>
          <TableHead className="h-8 px-3 py-2 text-right">
            <Skeleton className="ms-auto h-3 w-12" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rowKeys.map((rowKey) => (
          <TableRow key={rowKey}>
            <TableCell className="px-3 py-2">
              <Skeleton className="h-3 w-32" />
            </TableCell>
            <TableCell className="px-3 py-2">
              <Skeleton className="h-3 w-24 font-mono" />
            </TableCell>
            <TableCell className="px-3 py-2 text-right">
              <Skeleton className="ms-auto h-3 w-16" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function WorkspaceCockpitSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading workspace cockpit"
      className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_var(--xforge-layout-audit-rail)]"
    >
      <section className={cn(blockRecipe("blockStack"), "min-w-0")}>
        <section
          className={cn(
            blockRecipe("blockStack", "blockPanel", "blockPanelPadding"),
            "gap-2"
          )}
        >
          <Skeleton className="h-9 w-full" />
          <div className="flex flex-wrap gap-2">
            {FILTER_KEYS.map((filterKey) => (
              <Skeleton className="h-8 w-24" key={filterKey} />
            ))}
          </div>
        </section>
        <section className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-6 w-64" />
          <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {METRIC_KEYS.map((metricKey) => (
              <div
                className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}
                key={metricKey}
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-3 h-7 w-16" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            ))}
          </div>
        </section>
        <div className="grid gap-4 lg:grid-cols-2">
          {PANEL_KEYS.map((panelKey) => (
            <section
              className={cn(blockRecipe("blockPanel"), "overflow-hidden")}
              key={panelKey}
            >
              <div className="border-border-default border-b px-[var(--card-padding)] py-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-3 w-48" />
              </div>
              <SkeletonTable />
            </section>
          ))}
        </div>
        <section className={cn(blockRecipe("blockPanel"), "overflow-hidden")}>
          <div className="border-border-default border-b px-[var(--card-padding)] py-3">
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid gap-2 px-3 py-2">
            {LIST_ROW_KEYS.map((rowKey) => (
              <Skeleton className="h-8 w-full" key={rowKey} />
            ))}
          </div>
        </section>
      </section>
      <aside
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "grid h-fit gap-4"
        )}
      >
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-40" />
        {AUDIT_ROW_KEYS.map((rowKey) => (
          <Skeleton className="h-12 w-full" key={rowKey} />
        ))}
        <Button disabled size="sm" variant="secondary">
          Export evidence
        </Button>
      </aside>
    </section>
  );
}
