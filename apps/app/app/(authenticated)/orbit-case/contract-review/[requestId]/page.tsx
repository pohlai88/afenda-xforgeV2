import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitContractReviewDetailPageProps {
  params: Promise<{ requestId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitContractReviewDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  return generateMorphDetailMetadata("contract-review", requestId);
}

export default async function OrbitContractReviewDetailPage({
  params,
}: OrbitContractReviewDetailPageProps) {
  const { requestId } = await params;
  return (
    <OrbitMorphDetailView requestId={requestId} segment="contract-review" />
  );
}
