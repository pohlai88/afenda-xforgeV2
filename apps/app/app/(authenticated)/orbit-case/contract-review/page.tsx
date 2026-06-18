import type { Metadata } from "next";
import {
  generateMorphListMetadata,
  OrbitMorphListView,
} from "../components/orbit-morph-list-view";

interface OrbitMorphListPageProps {
  searchParams: Promise<{ caseId?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphListMetadata("contract-review");
}

export default async function OrbitContractReviewListPage({
  searchParams,
}: OrbitMorphListPageProps) {
  const { caseId } = await searchParams;
  return <OrbitMorphListView caseId={caseId} segment="contract-review" />;
}
