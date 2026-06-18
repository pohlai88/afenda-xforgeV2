import {
  getOrbitCaseBoard,
  getOrbitCaseById,
  getOrbitCaseCalendar,
  getOrbitCaseTimeline,
  listObjectLinksForCase,
  listOrbitCaseActivity,
  listOrbitCaseAttachments,
  listOrbitCaseComments,
  listOrbitCases,
  resolveOrbitMorphRouteLoader,
} from "@repo/orbit-case/server";
import {
  getOrbitCaseCacheTags,
  getOrbitCaseMorphCacheTags,
  orbitCaseDetailTag,
} from "@repo/orbit-case/revalidate";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedOrbitCaseWorkspace(organizationId: string) {
  "use cache";
  cacheLife("minutes");

  for (const tag of getOrbitCaseCacheTags({ organizationId })) {
    cacheTag(tag);
  }

  const now = new Date();

  return Promise.all([
    listOrbitCases(organizationId),
    getOrbitCaseBoard(organizationId),
    getOrbitCaseCalendar(
      organizationId,
      now.getUTCFullYear(),
      now.getUTCMonth() + 1
    ),
    getOrbitCaseTimeline(organizationId, now),
  ]);
}

export interface CachedOrbitCaseDetailBundle {
  activity: Awaited<ReturnType<typeof listOrbitCaseActivity>>;
  attachments: Awaited<ReturnType<typeof listOrbitCaseAttachments>>;
  comments: Awaited<ReturnType<typeof listOrbitCaseComments>>;
  links: Awaited<ReturnType<typeof listObjectLinksForCase>>;
  record: NonNullable<Awaited<ReturnType<typeof getOrbitCaseById>>>;
}

export async function getCachedOrbitCaseDetailBundle(
  organizationId: string,
  caseId: string
): Promise<CachedOrbitCaseDetailBundle | null> {
  "use cache";
  cacheLife("minutes");

  for (const tag of getOrbitCaseCacheTags({ organizationId, caseId })) {
    cacheTag(tag);
  }

  const record = await getOrbitCaseById(organizationId, caseId);

  if (!record) {
    return null;
  }

  const [comments, activity, links, attachments] = await Promise.all([
    listOrbitCaseComments(organizationId, caseId),
    listOrbitCaseActivity(organizationId, caseId),
    listObjectLinksForCase(organizationId, caseId),
    listOrbitCaseAttachments(organizationId, caseId),
  ]);

  return {
    record,
    comments,
    activity,
    links,
    attachments,
  };
}

export async function getCachedOrbitCaseTitle(
  organizationId: string,
  caseId: string
): Promise<string | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(orbitCaseDetailTag(caseId));

  const record = await getOrbitCaseById(organizationId, caseId);
  return record?.title ?? null;
}

export async function getCachedMorphRequestsForOrg(
  segment: string,
  organizationId: string
) {
  "use cache";
  cacheLife("minutes");

  for (const tag of getOrbitCaseMorphCacheTags(segment, organizationId)) {
    cacheTag(tag);
  }

  const loader = resolveOrbitMorphRouteLoader(segment);

  if (!loader) {
    return [];
  }

  return loader.listForOrg(organizationId);
}
