"use client";

import {
  blockRecipe,
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";

function SkeletonTable({ rows = 3 }: { readonly rows?: number }) {
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
        {Array.from({ length: rows }, (_, index) => (
          <TableRow key={index}>
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
    <div
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
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="h-8 w-24" key={index} />
            ))}
          </div>
        </section>
        <section className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-6 w-64" />
          <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}
                key={index}
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-3 h-7 w-16" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            ))}
          </div>
        </section>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <section
              className={cn(blockRecipe("blockPanel"), "overflow-hidden")}
              key={index}
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
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton className="h-8 w-full" key={index} />
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
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton className="h-12 w-full" key={index} />
        ))}
        <Button disabled size="sm" variant="secondary">
          Export evidence
        </Button>
      </aside>
    </div>
  );
}
