import { requireOrg } from "@repo/auth/server";
import { Skeleton } from "@repo/design-system";
import {
  MORPH_LIFECYCLE_DETAIL_PARAM_KEYS,
  type MorphLifecycleSegment,
  resolveMorphLifecycleSegmentConfig,
} from "@repo/orbit-case";
import { resolveMorphLifecycleLoader } from "@repo/orbit-case/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getMorphPilotFieldConfigs,
  toMorphPilotViewModel,
} from "@/lib/morph-pilot-ui";
import { getCachedOrbitCaseTitle } from "@/lib/orbit-case-cached-reads";
import { Header } from "../../_components/header";
import {
  OrbitMorphDetailLayout,
  OrbitMorphOriginAside,
} from "./orbit-morph-origin-aside";
import { OrbitMorphPilotDetailView } from "./orbit-morph-pilot-detail-view";

const OrbitMorphPilotDetailFallback = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="min-h-[20rem] w-full max-w-2xl" />
  </div>
);

interface OrbitMorphPilotDetailRoutePageProps {
  readonly params: Promise<Record<string, string>>;
  readonly segment: MorphLifecycleSegment;
}

export function generateMorphPilotDetailMetadata(
  segment: MorphLifecycleSegment
): Metadata {
  const config = resolveMorphLifecycleSegmentConfig(segment);
  return { title: config.eyebrowLabel };
}

export const OrbitMorphPilotDetailRoutePage = ({
  params,
  segment,
}: OrbitMorphPilotDetailRoutePageProps) => (
  <Suspense fallback={<OrbitMorphPilotDetailFallback />}>
    <OrbitMorphPilotDetailRoutePageContent params={params} segment={segment} />
  </Suspense>
);

const OrbitMorphPilotDetailRoutePageContent = async ({
  params,
  segment,
}: OrbitMorphPilotDetailRoutePageProps) => {
  const config = resolveMorphLifecycleSegmentConfig(segment);
  const resolvedParams = await params;
  const paramKey = MORPH_LIFECYCLE_DETAIL_PARAM_KEYS[segment];
  const requestId = resolvedParams[paramKey];

  if (!requestId) {
    notFound();
  }

  const { orgId } = await requireOrg();
  const loader = resolveMorphLifecycleLoader(segment);
  const dto = await loader.getById(orgId, requestId);

  if (!dto) {
    notFound();
  }

  const originCaseTitle = await getCachedOrbitCaseTitle(
    orgId,
    dto.originCaseId
  );

  return (
    <>
      <Header
        description={`Governed ${config.singularLabel} created from an Orbit Case push.`}
        eyebrow={`Work / Orbit Case / ${config.eyebrowLabel}`}
        title={dto.title}
      />
      <OrbitMorphDetailLayout
        aside={
          <OrbitMorphOriginAside
            allItemsHref={`/orbit-case/${segment}`}
            allItemsLabel={`All ${config.singularLabel}s`}
            originCaseId={dto.originCaseId}
            originCaseTitle={originCaseTitle}
          />
        }
      >
        <OrbitMorphPilotDetailView
          fields={getMorphPilotFieldConfigs(segment)}
          request={toMorphPilotViewModel(dto)}
          segment={segment}
        />
      </OrbitMorphDetailLayout>
    </>
  );
};
