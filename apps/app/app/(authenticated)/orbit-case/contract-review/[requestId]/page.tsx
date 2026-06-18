import type { OrbitMorphRequestDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import { generateMorphDetailMetadata } from "../../_components/orbit-morph-detail-view";
import { OrbitMorphDetailRoutePage } from "../../_components/orbit-morph-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphDetailMetadata("contract-review");
}

export default function OrbitContractReviewDetailPage({
  params,
}: OrbitMorphRequestDetailPageProps) {
  return (
    <OrbitMorphDetailRoutePage
      paramKey="requestId"
      params={params}
      segment="contract-review"
    />
  );
}
