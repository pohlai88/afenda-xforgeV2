import type { OrbitBudgetListPageProps } from "@/lib/orbit-morph-page-types";
import { orbitMorphStatusSchema } from "@repo/orbit-case";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  OrbitMorphPilotListView,
  generateMorphPilotListMetadata,
} from "../_components/orbit-morph-pilot-list-view";
import { Skeleton } from "@repo/design-system";

const OrbitBudgetListFallback = () => (
  <div className="flex flex-col gap-4 p-[var(--xforge-space-8)]">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphPilotListMetadata("budget");
}

export default function OrbitBudgetListPage({
  searchParams,
}: OrbitBudgetListPageProps) {
  return (
    <Suspense fallback={<OrbitBudgetListFallback />}>
      <OrbitBudgetListPageContent searchParams={searchParams} />
    </Suspense>
  );
}

const OrbitBudgetListPageContent = async ({
  searchParams,
}: OrbitBudgetListPageProps) => {
  const resolved = await searchParams;
  const statusResult = resolved.status
    ? orbitMorphStatusSchema.safeParse(resolved.status)
    : null;

  return (
    <OrbitMorphPilotListView
      assigneeId={resolved.assigneeId}
      caseId={resolved.caseId}
      segment="budget"
      status={statusResult?.success ? statusResult.data : undefined}
    />
  );
};
