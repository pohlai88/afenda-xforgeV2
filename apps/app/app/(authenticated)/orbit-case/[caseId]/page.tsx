import type { Metadata } from "next";
import { OrbitCaseDetailRoutePage } from "../_components/orbit-case-detail-route-page";

interface OrbitCaseDetailPageProps {
  params: Promise<{ caseId: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Orbit Case",
  };
}

export default function OrbitCaseDetailPage({
  params,
}: OrbitCaseDetailPageProps) {
  return <OrbitCaseDetailRoutePage params={params} />;
}
