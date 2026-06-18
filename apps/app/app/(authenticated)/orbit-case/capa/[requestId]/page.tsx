import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitCapaDetailPageProps {
  params: Promise<{ requestId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitCapaDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  return generateMorphDetailMetadata("capa", requestId);
}

export default async function OrbitCapaDetailPage({
  params,
}: OrbitCapaDetailPageProps) {
  const { requestId } = await params;
  return <OrbitMorphDetailView requestId={requestId} segment="capa" />;
}
