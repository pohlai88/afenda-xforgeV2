import { Skeleton } from "@repo/design-system";

export function DashboardLoading() {
  return (
    <div className="flex min-h-[100dvh] w-full">
      <aside className="hidden w-[var(--xforge-layout-sidebar)] shrink-0 border-r border-border-subtle p-4 md:flex md:flex-col md:gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <div className="mt-auto flex flex-col gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="h-[var(--xforge-layout-app-topbar)] w-full rounded-none" />
        <div className="flex flex-col gap-4 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <Skeleton className="min-h-[var(--chart-min-height)] w-full" />
          <Skeleton className="min-h-[24rem] w-full" />
        </div>
      </div>
    </div>
  );
}
