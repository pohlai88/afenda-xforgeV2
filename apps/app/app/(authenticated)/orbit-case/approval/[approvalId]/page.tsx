import type { OrbitApprovalDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import { generateMorphDetailMetadata } from "../../_components/orbit-morph-detail-view";
import { OrbitMorphDetailRoutePage } from "../../_components/orbit-morph-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphDetailMetadata("approval");
}

export default function OrbitApprovalDetailPage({
  params,
}: OrbitApprovalDetailPageProps) {
  return (
    <OrbitMorphDetailRoutePage
      paramKey="approvalId"
      params={params}
      segment="approval"
    />
  );
}
