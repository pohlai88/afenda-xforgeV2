import type { OrbitBudgetDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import {
  OrbitMorphPilotDetailRoutePage,
  generateMorphPilotDetailMetadata,
} from "../../_components/orbit-morph-pilot-detail-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphPilotDetailMetadata("budget");
}

export default function OrbitBudgetDetailPage({
  params,
}: OrbitBudgetDetailPageProps) {
  return <OrbitMorphPilotDetailRoutePage params={params} segment="budget" />;
}
