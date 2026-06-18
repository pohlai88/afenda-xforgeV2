import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitLeadDetailPageProps {
  params: Promise<{ requestId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitLeadDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  return generateMorphDetailMetadata("lead", requestId);
}

export default async function OrbitLeadDetailPage({
  params,
}: OrbitLeadDetailPageProps) {
  const { requestId } = await params;
  return <OrbitMorphDetailView requestId={requestId} segment="lead" />;
}
