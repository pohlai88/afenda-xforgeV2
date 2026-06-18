import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitProjectDetailPageProps {
  params: Promise<{ requestId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitProjectDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  return generateMorphDetailMetadata("project", requestId);
}

export default async function OrbitProjectDetailPage({
  params,
}: OrbitProjectDetailPageProps) {
  const { requestId } = await params;
  return <OrbitMorphDetailView requestId={requestId} segment="project" />;
}
