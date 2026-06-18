import type { Metadata } from "next";
import {
  generateMorphListMetadata,
  OrbitMorphListView,
} from "../components/orbit-morph-list-view";

interface OrbitApprovalListPageProps {
  searchParams: Promise<{ caseId?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphListMetadata("approval");
}

export default async function OrbitApprovalListPage({
  searchParams,
}: OrbitApprovalListPageProps) {
  const { caseId } = await searchParams;
  return <OrbitMorphListView caseId={caseId} segment="approval" />;
}
