import type { Metadata } from "next";
import {
  generateMorphDetailMetadata,
  OrbitMorphDetailView,
} from "../../components/orbit-morph-detail-view";

interface OrbitMeetingDetailPageProps {
  params: Promise<{ meetingId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitMeetingDetailPageProps): Promise<Metadata> {
  const { meetingId } = await params;
  return generateMorphDetailMetadata("meeting", meetingId);
}

export default async function OrbitMeetingDetailPage({
  params,
}: OrbitMeetingDetailPageProps) {
  const { meetingId } = await params;
  return <OrbitMorphDetailView requestId={meetingId} segment="meeting" />;
}
