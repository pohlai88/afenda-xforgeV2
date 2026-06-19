import "server-only";

import type { CreateOrbitInAppNotificationInput } from "../../contract/in-app-notification.schema";
import { resolveMorphSliceByTargetType } from "../../contract/morph-destination-manifest";
import { listCaseWatcherUserIds } from "../work/orbit-cases";
import { createInAppNotifications } from "./in-app-notifications";

export const notifyCaseWatchersOnPush = async (input: {
  actorId: string;
  caseId: string;
  caseTitle: string;
  destinationLabel: string;
  morphHref: string;
  organizationId: string;
  targetType: string;
}): Promise<void> => {
  const watcherIds = await listCaseWatcherUserIds(
    input.organizationId,
    input.caseId
  );

  const recipients = watcherIds.filter((userId) => userId !== input.actorId);

  if (recipients.length === 0) {
    return;
  }

  const notifications: CreateOrbitInAppNotificationInput[] = recipients.map(
    (userId) => ({
      body: `${input.destinationLabel} was created from "${input.caseTitle}".`,
      href: input.morphHref,
      kind: "orbit.case.pushed",
      payload: {
        caseId: input.caseId,
        targetType: input.targetType,
      },
      title: "Case pushed to module",
      userId,
    })
  );

  await createInAppNotifications(input.organizationId, notifications);
};

export const notifyUserOnCaseAssigned = async (input: {
  assigneeId: string;
  actorId: string;
  caseId: string;
  caseTitle: string;
  organizationId: string;
}): Promise<void> => {
  if (!input.assigneeId || input.assigneeId === input.actorId) {
    return;
  }

  await createInAppNotifications(input.organizationId, [
    {
      body: `You were assigned to "${input.caseTitle}".`,
      href: `/orbit-case/${input.caseId}`,
      kind: "orbit.case.assigned",
      payload: { caseId: input.caseId },
      title: "Case assigned to you",
      userId: input.assigneeId,
    },
  ]);
};

export const notifyMorphAssignee = async (input: {
  actorId: string;
  assigneeId: string | null;
  caseId: string;
  morphHref: string;
  morphTitle: string;
  organizationId: string;
  segment: string;
}): Promise<void> => {
  if (!input.assigneeId || input.assigneeId === input.actorId) {
    return;
  }

  await createInAppNotifications(input.organizationId, [
    {
      body: `You were assigned to "${input.morphTitle}".`,
      href: input.morphHref,
      kind: "orbit.morph.assigned",
      payload: {
        caseId: input.caseId,
        segment: input.segment,
      },
      title: "Morph request assigned to you",
      userId: input.assigneeId,
    },
  ]);
};

export const resolveMorphDetailHref = (
  targetType: string,
  targetId: string
): string => {
  const slice = resolveMorphSliceByTargetType(targetType);

  if (!slice?.hasAppRoute) {
    return `/orbit-case/${targetId}`;
  }

  return `/orbit-case/${slice.segment}/${targetId}`;
};
