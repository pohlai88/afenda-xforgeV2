import { requireOrg } from "@repo/auth/server";
import {
  MORPH_LIFECYCLE_DETAIL_PARAM_KEYS,
  resolveMorphLifecycleSegmentConfig,
  type MorphLifecycleSegment,
} from "@repo/orbit-case";
import { resolveMorphLifecycleLoader } from "@repo/orbit-case/server";
import { Skeleton } from "@repo/design-system";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCachedOrbitCaseTitle } from "@/lib/orbit-case-cached-reads";
import {
  getMorphPilotFieldConfigs,
  toMorphPilotViewModel,
} from "@/lib/morph-pilot-ui";
import { Header } from "../../_components/header";
import { OrbitMorphPilotDetailView } from "./orbit-morph-pilot-detail-view";
import {
  OrbitMorphDetailLayout,
  OrbitMorphOriginAside,
} from "./orbit-morph-origin-aside";

const OrbitMorphPilotDetailFallback = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="min-h-[20rem] w-full max-w-2xl" />
  </div>
);

interface OrbitMorphPilotDetailRoutePageProps {
  params: Promise<Record<string, string>>;
  segment: MorphLifecycleSegment;
}

export async function generateMorphPilotDetailMetadata(
  segment: MorphLifecycleSegment
): Promise<Metadata> {
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

  const originCaseTitle = await getCachedOrbitCaseTitle(orgId, dto.originCaseId);

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
