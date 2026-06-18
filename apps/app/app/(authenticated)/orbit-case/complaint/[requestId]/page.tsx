import type { OrbitMorphRequestDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import { generateMorphDetailMetadata } from "../../_components/orbit-morph-detail-view";
import { OrbitMorphDetailRoutePage } from "../../_components/orbit-morph-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphDetailMetadata("complaint");
}

export default function OrbitComplaintDetailPage({
  params,
}: OrbitMorphRequestDetailPageProps) {
  return (
    <OrbitMorphDetailRoutePage
      paramKey="requestId"
      params={params}
      segment="complaint"
    />
  );
}
