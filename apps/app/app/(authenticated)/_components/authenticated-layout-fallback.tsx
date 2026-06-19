import { Skeleton } from "@repo/design-system";

export const AuthenticatedLayoutFallback = () => (
  <div
    className="grid h-svh max-h-svh w-full min-w-0 overflow-hidden bg-background [grid-template-areas:'topbar_topbar'_'sidebar_content'] [grid-template-columns:var(--xforge-layout-sidebar,calc(var(--spacing)*16))_minmax(0,1fr)] [grid-template-rows:var(--xforge-layout-app-topbar,calc(var(--spacing)*12))_minmax(0,1fr)]"
    data-slot="authenticated-layout-fallback"
  >
    <div className="flex items-center gap-3 border-border-default border-b px-4 [grid-area:topbar]">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-6 w-32" />
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
    <div className="flex flex-col gap-3 border-border-default border-r p-3 [grid-area:sidebar]">
      <Skeleton className="h-4 w-24" />
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton className="h-9 w-full" key={`sidebar-nav-${index}`} />
      ))}
    </div>
    <div className="flex min-h-0 flex-col gap-4 p-4 [grid-area:content]">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="min-h-[24rem] w-full flex-1" />
    </div>
  </div>
);
