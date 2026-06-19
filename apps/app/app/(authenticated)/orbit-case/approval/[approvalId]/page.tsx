import type { OrbitApprovalDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import {
  OrbitMorphPilotDetailRoutePage,
  generateMorphPilotDetailMetadata,
} from "../../_components/orbit-morph-pilot-detail-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphPilotDetailMetadata("approval");
}

export default function OrbitApprovalDetailPage({
  params,
}: OrbitApprovalDetailPageProps) {
  return <OrbitMorphPilotDetailRoutePage params={params} segment="approval" />;
}
