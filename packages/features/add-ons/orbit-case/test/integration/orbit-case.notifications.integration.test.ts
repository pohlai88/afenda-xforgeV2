import { createId } from "@paralleldrive/cuid2";
import { database, organization, orbitCase, orbitInAppNotification } from "@repo/database";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { notifyUserOnCaseAssigned } from "../../engines/notifications/notify-orbit-case";
import { listInAppNotificationsForUser } from "../../engines/notifications/in-app-notifications";

const hasDatabase = Boolean(process.env.DATABASE_URL ?? process.env.DIRECT_URL);

describe.skipIf(!hasDatabase)("orbit in-app notifications integration", () => {
  const organizationId = createId();
  const actorId = createId();
  const assigneeId = createId();
  const caseId = createId();

  beforeAll(async () => {
    const now = new Date();

    await database.insert(organization).values({
      id: organizationId,
      name: "Orbit notifications integration org",
      createdAt: now,
      updatedAt: now,
    });

    await database.insert(orbitCase).values({
      assigneeId: null,
      createdAt: now,
      createdBy: actorId,
      description: null,
      dueAt: null,
      id: caseId,
      organizationId,
      ownerId: actorId,
      priority: "medium",
      status: "backlog",
      title: "Assign notification case",
      updatedAt: now,
    });
  });

  afterAll(async () => {
    await database
      .delete(orbitInAppNotification)
      .where(eq(orbitInAppNotification.organizationId, organizationId));
    await database.delete(orbitCase).where(eq(orbitCase.organizationId, organizationId));
    await database.delete(organization).where(eq(organization.id, organizationId));
  });

  it("persists case-assigned notification for assignee", async () => {
    await notifyUserOnCaseAssigned({
      actorId,
      assigneeId,
      caseId,
      caseTitle: "Assign notification case",
      organizationId,
    });

    const notifications = await listInAppNotificationsForUser(
      organizationId,
      assigneeId
    );

    expect(notifications).toHaveLength(1);
    expect(notifications[0]?.kind).toBe("orbit.case.assigned");
    expect(notifications[0]?.href).toBe(`/orbit-case/${caseId}`);
  });
});
