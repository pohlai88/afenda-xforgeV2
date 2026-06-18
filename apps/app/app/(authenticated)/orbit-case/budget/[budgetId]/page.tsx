import type { OrbitBudgetDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import { generateMorphDetailMetadata } from "../../components/orbit-morph-detail-view";
import { OrbitMorphDetailRoutePage } from "../../components/orbit-morph-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphDetailMetadata("budget");
}

export default function OrbitBudgetDetailPage({
  params,
}: OrbitBudgetDetailPageProps) {
  return (
    <OrbitMorphDetailRoutePage
      paramKey="budgetId"
      params={params}
      segment="budget"
    />
  );
}
