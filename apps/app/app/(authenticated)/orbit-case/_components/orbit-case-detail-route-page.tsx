import { Skeleton } from "@repo/design-system";
import { Suspense } from "react";
import { OrbitCaseDetailRouteContent } from "./orbit-case-detail-route-content";

const OrbitCaseDetailFallback = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-6 w-full max-w-2xl" />
    <Skeleton className="min-h-[28rem] w-full" />
  </div>
);

interface OrbitCaseDetailRoutePageProps {
  params: Promise<{ caseId: string }>;
}

export const OrbitCaseDetailRoutePage = ({
  params,
}: OrbitCaseDetailRoutePageProps) => (
  <Suspense fallback={<OrbitCaseDetailFallback />}>
    <OrbitCaseDetailRouteContent params={params} />
  </Suspense>
);
