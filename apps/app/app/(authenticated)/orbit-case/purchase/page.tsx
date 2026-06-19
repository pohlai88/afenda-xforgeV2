import type { OrbitMorphListPageProps } from "@/lib/orbit-morph-page-types";
import { orbitMorphStatusSchema } from "@repo/orbit-case";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  OrbitMorphPilotListView,
  generateMorphPilotListMetadata,
} from "../_components/orbit-morph-pilot-list-view";
import { Skeleton } from "@repo/design-system";

const OrbitPurchaseListFallback = () => (
  <div className="flex flex-col gap-4 p-[var(--xforge-space-8)]">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphPilotListMetadata("purchase");
}

export default function OrbitPurchaseListPage({
  searchParams,
}: OrbitMorphListPageProps) {
  return (
    <Suspense fallback={<OrbitPurchaseListFallback />}>
      <OrbitPurchaseListPageContent searchParams={searchParams} />
    </Suspense>
  );
}

const OrbitPurchaseListPageContent = async ({
  searchParams,
}: OrbitMorphListPageProps) => {
  const resolved = await searchParams;
  const statusResult = resolved.status
    ? orbitMorphStatusSchema.safeParse(resolved.status)
    : null;

  return (
    <OrbitMorphPilotListView
      assigneeId={resolved.assigneeId}
      caseId={resolved.caseId}
      segment="purchase"
      status={statusResult?.success ? statusResult.data : undefined}
    />
  );
};
