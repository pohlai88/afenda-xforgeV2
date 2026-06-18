import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitApprovalDetailPageProps {
  params: Promise<{ approvalId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitApprovalDetailPageProps): Promise<Metadata> {
  const { approvalId } = await params;
  return generateMorphDetailMetadata("approval", approvalId);
}

export default async function OrbitApprovalDetailPage({
  params,
}: OrbitApprovalDetailPageProps) {
  const { approvalId } = await params;
  return <OrbitMorphDetailView requestId={approvalId} segment="approval" />;
}
