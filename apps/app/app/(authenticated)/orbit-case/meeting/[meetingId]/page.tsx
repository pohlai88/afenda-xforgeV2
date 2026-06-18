import type { OrbitMeetingDetailPageProps } from "@/lib/orbit-morph-page-types";
import type { Metadata } from "next";
import { generateMorphDetailMetadata } from "../../_components/orbit-morph-detail-view";
import { OrbitMorphDetailRoutePage } from "../../_components/orbit-morph-route-page";

export async function generateMetadata(): Promise<Metadata> {
  return generateMorphDetailMetadata("meeting");
}

export default function OrbitMeetingDetailPage({
  params,
}: OrbitMeetingDetailPageProps) {
  return (
    <OrbitMorphDetailRoutePage
      paramKey="meetingId"
      params={params}
      segment="meeting"
    />
  );
}
