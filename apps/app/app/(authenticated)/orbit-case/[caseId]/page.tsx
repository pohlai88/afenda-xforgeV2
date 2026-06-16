import { getOrganizationRole } from "@repo/auth/cms";
import { requireOrg } from "@repo/auth/server";
import {
  toOrbitCaseActivityDto,
  toOrbitCaseAttachmentDto,
  toOrbitCaseCommentDto,
  toOrbitCaseDto,
  toOrbitObjectLinkDto,
} from "@repo/orbit-case";
import {
  canHardDeleteOrbitCase,
  ensureSystemPushDefaults,
  getOrbitCaseById,
  isOrbitCaseWatcher,
  listObjectLinksForCase,
  listOrbitCaseActivity,
  listOrbitCaseAttachments,
  listOrbitCaseComments,
  resolveOrgPushDestinations,
} from "@repo/orbit-case/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrbitPushCapabilitiesForSession } from "@/lib/orbit-case-session";
import { Header } from "../../components/header";
import { OrbitCaseDetailView } from "../components/orbit-case-detail-view";

interface OrbitCaseDetailPageProps {
  params: Promise<{ caseId: string }>;
}

export async function generateMetadata({
  params,
}: OrbitCaseDetailPageProps): Promise<Metadata> {
  const { caseId } = await params;
  const { orgId } = await requireOrg();
  const record = await getOrbitCaseById(orgId, caseId);

  return {
    title: record?.title ?? "Orbit Case",
  };
}

export default async function OrbitCaseDetailPage({
  params,
}: OrbitCaseDetailPageProps) {
  const { caseId } = await params;
  const { orgId, userId } = await requireOrg();
  const record = await getOrbitCaseById(orgId, caseId);

  if (!record) {
    notFound();
  }

  ensureSystemPushDefaults();

  const role = await getOrganizationRole(userId, orgId);
  const userCapabilities = await getOrbitPushCapabilitiesForSession(
    userId,
    orgId
  );
  const [comments, activity, links, watching, destinations, attachments] =
    await Promise.all([
      listOrbitCaseComments(orgId, caseId),
      listOrbitCaseActivity(orgId, caseId),
      listObjectLinksForCase(orgId, caseId),
      isOrbitCaseWatcher(orgId, caseId, userId),
      role
        ? resolveOrgPushDestinations({
            orgId,
            userId,
            role,
            userCapabilities,
          })
        : Promise.resolve([]),
      listOrbitCaseAttachments(orgId, caseId),
    ]);

  return (
    <>
      <Header
        description="Work item detail — update, comment, and push when ready."
        eyebrow="Work / Orbit Case"
        title={record.title}
      />
      <OrbitCaseDetailView
        activity={activity.map(toOrbitCaseActivityDto)}
        attachments={attachments.map(toOrbitCaseAttachmentDto)}
        canHardDelete={role ? canHardDeleteOrbitCase(role) : false}
        comments={comments.map(toOrbitCaseCommentDto)}
        destinations={destinations}
        links={links.map(toOrbitObjectLinkDto)}
        orbitCase={toOrbitCaseDto(record)}
        watching={watching}
      />
    </>
  );
}
