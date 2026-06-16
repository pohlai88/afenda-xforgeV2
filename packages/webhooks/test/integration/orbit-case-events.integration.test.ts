import { createId } from "@paralleldrive/cuid2";
import {
  ORBIT_EVENT_CASE_CREATED,
  ORBIT_EVENT_CASE_PUSHED,
  buildOrbitCaseCreatedEvent,
  buildOrbitCasePushedEvent,
} from "@repo/orbit-case";
import { database } from "@repo/database";
import {
  organization,
  webhookDelivery,
  webhookEndpoint,
} from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { processWebhookDeliveries } from "../../lib/outbound/dispatcher";
import { enqueueWebhookEvent } from "../../lib/outbound/enqueue";
import { setIntegrationFetchHandler } from "../../test-support/setup-integration-fetch";

const hasDatabase = Boolean(process.env.DATABASE_URL ?? process.env.DIRECT_URL);

describe.skipIf(!hasDatabase)("orbit case webhook events integration", () => {
  const organizationId = createId();
  const endpointId = createId();
  const capturedBodies: string[] = [];

  beforeAll(async () => {
    const now = new Date();

    await database.insert(organization).values({
      id: organizationId,
      name: "Orbit webhook integration org",
      createdAt: now,
      updatedAt: now,
    });

    await database.insert(webhookEndpoint).values({
      id: endpointId,
      organizationId,
      url: "https://orbit-integration.test/webhooks",
      secret: "whsec_test_orbit_integration_secret_value_1234567890",
      enabled: true,
      events: [ORBIT_EVENT_CASE_CREATED, ORBIT_EVENT_CASE_PUSHED],
      createdAt: now,
      updatedAt: now,
    });
  });

  beforeEach(() => {
    capturedBodies.length = 0;
    setIntegrationFetchHandler(async (input, init) => {
      if (init?.body && typeof init.body === "string") {
        capturedBodies.push(init.body);
      }

      return new Response("ok", { status: 200 });
    });
  });

  afterAll(async () => {
    await database
      .delete(webhookDelivery)
      .where(eq(webhookDelivery.organizationId, organizationId));
    await database
      .delete(webhookEndpoint)
      .where(eq(webhookEndpoint.organizationId, organizationId));
    await database
      .delete(organization)
      .where(eq(organization.id, organizationId));
  });

  it("enqueues and delivers orbit.case.created", async () => {
    const caseId = createId();
    const payload = buildOrbitCaseCreatedEvent({
      caseId,
      title: "Webhook smoke case",
      status: "backlog",
      createdAt: new Date().toISOString(),
      createdBy: "user_test",
    });

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      ORBIT_EVENT_CASE_CREATED,
      payload
    );

    expect(enqueueResult.deliveryCount).toBe(1);

    await processWebhookDeliveries({
      deliveryIds: enqueueResult.deliveryIds,
    });

    expect(capturedBodies).toHaveLength(1);
    expect(capturedBodies[0]).toContain(caseId);
    expect(capturedBodies[0]).toContain(ORBIT_EVENT_CASE_CREATED);
  });

  it("enqueues and delivers orbit.case.pushed", async () => {
    const caseId = createId();
    const pushEventId = createId();
    const targetId = createId();

    const payload = buildOrbitCasePushedEvent({
      caseId,
      destinationId: "budget-request",
      pushEventId,
      targetType: "budget-request",
      targetId,
    });

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      ORBIT_EVENT_CASE_PUSHED,
      payload
    );

    expect(enqueueResult.deliveryCount).toBe(1);

    await processWebhookDeliveries({
      deliveryIds: enqueueResult.deliveryIds,
    });

    expect(capturedBodies).toHaveLength(1);
    expect(capturedBodies[0]).toContain(pushEventId);
    expect(capturedBodies[0]).toContain(ORBIT_EVENT_CASE_PUSHED);
  });
});
