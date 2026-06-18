import type { OrbitMorphRequestDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import { generateMorphDetailMetadata } from "../../components/orbit-morph-detail-view";
import { OrbitMorphDetailRoutePage } from "../../components/orbit-morph-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphDetailMetadata("capa");
}

export default function OrbitCapaDetailPage({
  params,
}: OrbitMorphRequestDetailPageProps) {
  return (
    <OrbitMorphDetailRoutePage
      paramKey="requestId"
      params={params}
      segment="capa"
    />
  );
}
