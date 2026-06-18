import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitComplaintDetailPageProps {
  params: Promise<{ requestId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitComplaintDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  return generateMorphDetailMetadata("complaint", requestId);
}

export default async function OrbitComplaintDetailPage({
  params,
}: OrbitComplaintDetailPageProps) {
  const { requestId } = await params;
  return <OrbitMorphDetailView requestId={requestId} segment="complaint" />;
}
