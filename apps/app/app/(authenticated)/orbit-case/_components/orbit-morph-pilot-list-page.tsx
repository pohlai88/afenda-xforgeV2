import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import { orbitMorphStatusSchema, type MorphLifecycleSegment } from "@repo/orbit-case";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  OrbitMorphPilotListView,
  generateMorphPilotListMetadata,
} from "./orbit-morph-pilot-list-view";
import { Skeleton } from "@repo/design-system";

const OrbitMorphPilotListFallback = () => (
  <div className="flex flex-col gap-4 p-[var(--xforge-space-8)]">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-24 w-full" />
  </div>
);

interface OrbitMorphPilotListPageProps extends OrbitMorphListPageProps {
  segment: MorphLifecycleSegment;
}

export const createOrbitMorphPilotListPage = (segment: MorphLifecycleSegment) => {
  const Page = ({ searchParams }: OrbitMorphListPageProps) => (
    <Suspense fallback={<OrbitMorphPilotListFallback />}>
      <OrbitMorphPilotListPageContent searchParams={searchParams} segment={segment} />
    </Suspense>
  );

  const generateMetadata = async (): Promise<Metadata> =>
    generateMorphPilotListMetadata(segment);

  return { Page, generateMetadata };
};

const OrbitMorphPilotListPageContent = async ({
  searchParams,
  segment,
}: OrbitMorphPilotListPageProps) => {
  const resolved = await searchParams;
  const statusResult = resolved.status
    ? orbitMorphStatusSchema.safeParse(resolved.status)
    : null;

  return (
    <OrbitMorphPilotListView
      assigneeId={resolved.assigneeId}
      caseId={resolved.caseId}
      segment={segment}
      status={statusResult?.success ? statusResult.data : undefined}
    />
  );
};
