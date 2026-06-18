import { Skeleton } from "@repo/design-system";

export const AuthenticatedLayoutFallback = () => (
  <div className="flex min-h-screen flex-col gap-4 p-6">
    <Skeleton className="h-10 w-48" />
    <Skeleton className="h-6 w-full max-w-xl" />
    <Skeleton className="min-h-[24rem] w-full flex-1" />
  </div>
);
