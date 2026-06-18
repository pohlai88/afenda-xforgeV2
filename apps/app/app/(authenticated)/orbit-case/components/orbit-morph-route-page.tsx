import type { OrbitMorphSegment } from "@/lib/orbit-morph-page-types";
import { Skeleton } from "@repo/design-system/design-system";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrbitMorphDetailView } from "./orbit-morph-detail-view";
import { OrbitMorphListView } from "./orbit-morph-list-view";

const OrbitMorphPageFallback = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-6 w-full max-w-2xl" />
    <Skeleton className="min-h-[20rem] w-full" />
  </div>
);

interface OrbitMorphListRoutePageProps {
  searchParams: Promise<{ caseId?: string }>;
  segment: OrbitMorphSegment;
}

export const OrbitMorphListRoutePage = ({
  searchParams,
  segment,
}: OrbitMorphListRoutePageProps) => (
  <Suspense fallback={<OrbitMorphPageFallback />}>
    <OrbitMorphListRoutePageContent
      searchParams={searchParams}
      segment={segment}
    />
  </Suspense>
);

const OrbitMorphListRoutePageContent = async ({
  searchParams,
  segment,
}: OrbitMorphListRoutePageProps) => {
  const { caseId } = await searchParams;
  return <OrbitMorphListView caseId={caseId} segment={segment} />;
};

type OrbitMorphDetailParamKey =
  | "approvalId"
  | "budgetId"
  | "meetingId"
  | "requestId";

interface OrbitMorphDetailRoutePageProps {
  paramKey: OrbitMorphDetailParamKey;
  params: Promise<Record<string, string>>;
  segment: OrbitMorphSegment;
}

export const OrbitMorphDetailRoutePage = ({
  paramKey,
  params,
  segment,
}: OrbitMorphDetailRoutePageProps) => (
  <Suspense fallback={<OrbitMorphPageFallback />}>
    <OrbitMorphDetailRoutePageContent
      paramKey={paramKey}
      params={params}
      segment={segment}
    />
  </Suspense>
);

const OrbitMorphDetailRoutePageContent = async ({
  paramKey,
  params,
  segment,
}: OrbitMorphDetailRoutePageProps) => {
  const resolvedParams = await params;
  const requestId = resolvedParams[paramKey];

  if (!requestId) {
    notFound();
  }

  return <OrbitMorphDetailView requestId={requestId} segment={segment} />;
};
