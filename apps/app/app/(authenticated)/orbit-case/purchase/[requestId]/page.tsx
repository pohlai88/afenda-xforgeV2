import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitPurchaseDetailPageProps {
  params: Promise<{ requestId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitPurchaseDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  return generateMorphDetailMetadata("purchase", requestId);
}

export default async function OrbitPurchaseDetailPage({
  params,
}: OrbitPurchaseDetailPageProps) {
  const { requestId } = await params;
  return <OrbitMorphDetailView requestId={requestId} segment="purchase" />;
}
