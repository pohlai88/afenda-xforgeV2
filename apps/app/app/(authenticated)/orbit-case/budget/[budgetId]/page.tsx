import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitBudgetDetailPageProps {
  params: Promise<{ budgetId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitBudgetDetailPageProps): Promise<Metadata> {
  const { budgetId } = await params;
  return generateMorphDetailMetadata("budget", budgetId);
}

export default async function OrbitBudgetDetailPage({
  params,
}: OrbitBudgetDetailPageProps) {
  const { budgetId } = await params;
  return <OrbitMorphDetailView requestId={budgetId} segment="budget" />;
}
