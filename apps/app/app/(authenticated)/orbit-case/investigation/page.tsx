import type { Metadata } from "next";
import {
  generateMorphListMetadata,
  OrbitMorphListView,
} from "../components/orbit-morph-list-view";

interface OrbitMorphListPageProps {
  searchParams: Promise<{ caseId?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphListMetadata("investigation");
}

export default async function OrbitInvestigationListPage({
  searchParams,
}: OrbitMorphListPageProps) {
  const { caseId } = await searchParams;
  return <OrbitMorphListView caseId={caseId} segment="investigation" />;
}
