import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitInvestigationDetailPageProps {
  params: Promise<{ requestId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitInvestigationDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  return generateMorphDetailMetadata("investigation", requestId);
}

export default async function OrbitInvestigationDetailPage({
  params,
}: OrbitInvestigationDetailPageProps) {
  const { requestId } = await params;
  return (
    <OrbitMorphDetailView requestId={requestId} segment="investigation" />
  );
}
