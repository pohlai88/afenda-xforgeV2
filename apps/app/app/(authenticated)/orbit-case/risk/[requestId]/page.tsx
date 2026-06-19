import type { OrbitMorphRequestDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import {
  OrbitMorphPilotDetailRoutePage,
  generateMorphPilotDetailMetadata,
} from "../../_components/orbit-morph-pilot-detail-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphPilotDetailMetadata("risk");
}

export default function OrbitRiskDetailPage({
  params,
}: OrbitMorphRequestDetailPageProps) {
  return <OrbitMorphPilotDetailRoutePage params={params} segment="risk" />;
}
