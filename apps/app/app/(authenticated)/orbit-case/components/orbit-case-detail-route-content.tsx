import { getOrganizationRole } from "@repo/auth/cms";
import { requireOrg } from "@repo/auth/server";
import {
  toOrbitCaseActivityDto,
  toOrbitCaseAttachmentDto,
  toOrbitCaseCommentDto,
  toOrbitCaseDto,
  toOrbitObjectLinkDto,
  toOrbitObjectLinkProjectionDto,
} from "@repo/orbit-case";
import type { PushTemplateDefinition } from "@repo/orbit-case";
import {
  canHardDeleteOrbitCase,
  ensureSystemPushDefaults,
  getMergedPushTemplate,
  isOrbitCaseWatcher,
  resolveOrgPushDestinations,
} from "@repo/orbit-case/server";
import { notFound } from "next/navigation";
import { getCachedOrbitCaseDetailBundle } from "@/lib/orbit-case-cached-reads";
import { getOrbitPushCapabilitiesForSession } from "@/lib/orbit-case-session";
import { Header } from "../../components/header";
import { OrbitCaseDetailView } from "./orbit-case-detail-view";

interface OrbitCaseDetailRouteContentProps {
  params: Promise<{ caseId: string }>;
}

export const OrbitCaseDetailRouteContent = async ({
  params,
}: OrbitCaseDetailRouteContentProps) => {
  const { caseId } = await params;
  const { orgId, userId } = await requireOrg();
  const bundle = await getCachedOrbitCaseDetailBundle(orgId, caseId);

  if (!bundle) {
    notFound();
  }

  const { record, comments, activity, links, attachments } = bundle;

  ensureSystemPushDefaults();

  const role = await getOrganizationRole(userId, orgId);
  const userCapabilities = await getOrbitPushCapabilitiesForSession(
    userId,
    orgId
  );
  const [watching, destinations] = await Promise.all([
    isOrbitCaseWatcher(orgId, caseId, userId),
    role
      ? resolveOrgPushDestinations({
          orgId,
          userId,
          role,
          userCapabilities,
        })
      : Promise.resolve([]),
  ]);

  const pushTemplatesByDestinationId: Record<string, PushTemplateDefinition> =
    {};

  await Promise.all(
    destinations.map(async (destination) => {
      const template = await getMergedPushTemplate(orgId, destination.templateId);

      if (template) {
        pushTemplatesByDestinationId[destination.id] = template;
      }
    })
  );

  const linkProjections = links
    .map(toOrbitObjectLinkDto)
    .map(toOrbitObjectLinkProjectionDto);

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
        canEditOwner={role === "owner"}
        canHardDelete={role ? canHardDeleteOrbitCase(role) : false}
        comments={comments.map(toOrbitCaseCommentDto)}
        destinations={destinations}
        linkProjections={linkProjections}
        pushTemplatesByDestinationId={pushTemplatesByDestinationId}
        orbitCase={toOrbitCaseDto(record)}
        watching={watching}
      />
    </>
  );
};
