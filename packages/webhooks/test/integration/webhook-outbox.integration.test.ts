import { createId } from "@paralleldrive/cuid2";
import {
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_UNPUBLISHED,
  cmsDocumentEventSchema,
} from "@repo/cms/events";
import { database } from "@repo/database";
import { organization, webhookDelivery } from "@repo/database/schema";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  processPendingDeliveries,
  processWebhookDeliveries,
} from "../../lib/outbound/dispatcher";
import {
  createWebhookEndpoint,
  listWebhookDeliveries,
  replayWebhookDelivery,
  resetWebhookEndpointHealth,
  rotateWebhookEndpointSecret,
  updateWebhookEndpoint,
} from "../../lib/outbound/endpoints";
import { enqueueWebhookEvent } from "../../lib/outbound/enqueue";
import { verifyStandardWebhook } from "../../lib/verify";
import { setIntegrationFetchHandler } from "../../test-support/setup-integration-fetch";

type CapturedWebhookRequest = {
  url: string;
  headers: Record<string, string>;
  body: string;
};

const hasDatabase = Boolean(process.env.DATABASE_URL ?? process.env.DIRECT_URL);

describe.skipIf(!hasDatabase)("webhook outbox integration", () => {
  const organizationId = createId();
  const capturedRequests: CapturedWebhookRequest[] = [];
  let endpointId: string;
  let endpointSecret: string;

  beforeAll(async () => {
    const now = new Date();

    await database.insert(organization).values({
      id: organizationId,
      name: "Webhook integration org",
      createdAt: now,
      updatedAt: now,
    });

    const endpoint = await createWebhookEndpoint({
      organizationId,
      url: "https://example.com/webhooks/smoke",
      events: [CMS_EVENT_PUBLISHED, CMS_EVENT_UNPUBLISHED],
      description: "Webhook integration smoke",
    });

    endpointId = endpoint.id;
    endpointSecret = endpoint.secret;
  });

  beforeEach(() => {
    setIntegrationFetchHandler(async (input, init) => {
      const url = String(input);
      const headers = Object.fromEntries(new Headers(init?.headers).entries());
      const body = typeof init?.body === "string" ? init.body : "";

      capturedRequests.push({ url, headers, body });

      return new Response("ok", { status: 200 });
    });
  });

  afterAll(async () => {
    await database
      .delete(organization)
      .where(eq(organization.id, organizationId));
  });

  it("delivers signed cms.document.published after enqueue", async () => {
    capturedRequests.length = 0;

    const eventData = cmsDocumentEventSchema.parse({
      collection: "blog",
      locale: "en",
      slug: "smoke-published",
      title: "Smoke publish",
      status: "published",
      publishedAt: "2026-06-15",
    });

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      CMS_EVENT_PUBLISHED,
      eventData
    );

    expect(enqueueResult.eventId).toBeTruthy();
    expect(enqueueResult.deliveryCount).toBe(1);
    expect(enqueueResult.deliveryIds).toHaveLength(1);

    const deliveryResult = await processWebhookDeliveries({
      deliveryIds: enqueueResult.deliveryIds,
    });

    expect(deliveryResult.delivered).toBe(1);
    expect(capturedRequests).toHaveLength(1);

    const request = capturedRequests[0]!;
    expect(request.url).toBe("https://example.com/webhooks/smoke");

    const payload = JSON.parse(request.body) as {
      type: string;
      timestamp: string;
      organizationId: string;
      data: typeof eventData;
    };

    expect(payload.type).toBe(CMS_EVENT_PUBLISHED);
    expect(payload.organizationId).toBe(organizationId);
    expect(payload.data).toEqual(eventData);
    expect(payload.timestamp).toBeTruthy();
    expect(request.headers["webhook-id"]).toBe(enqueueResult.eventId);
    expect(request.headers["user-agent"]).toBe("afenda-webhooks/1.0");

    const verifyResult = verifyStandardWebhook({
      secret: endpointSecret,
      rawBody: request.body,
      headers: request.headers,
      toleranceSeconds: 60_000,
    });

    expect(verifyResult.ok).toBe(true);
  });

  it("delivers cms.document.unpublished on delete flow payload", async () => {
    capturedRequests.length = 0;

    const eventData = cmsDocumentEventSchema.parse({
      collection: "blog",
      locale: "en",
      slug: "smoke-unpublished",
      title: "Smoke unpublish",
      status: "published",
    });

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      CMS_EVENT_UNPUBLISHED,
      eventData
    );

    const deliveryResult = await processWebhookDeliveries({
      deliveryIds: enqueueResult.deliveryIds,
    });

    expect(deliveryResult.delivered).toBe(1);
    expect(JSON.parse(capturedRequests[0]!.body).type).toBe(
      CMS_EVENT_UNPUBLISHED
    );
  });

  it("no-ops enqueue when disabled endpoint", async () => {
    await updateWebhookEndpoint({
      organizationId,
      endpointId,
      enabled: false,
    });

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      CMS_EVENT_PUBLISHED,
      cmsDocumentEventSchema.parse({
        collection: "blog",
        locale: "en",
        slug: "disabled-endpoint",
        title: "Disabled",
        status: "published",
      })
    );

    expect(enqueueResult).toEqual({
      eventId: null,
      deliveryCount: 0,
      deliveryIds: [],
    });

    await updateWebhookEndpoint({
      organizationId,
      endpointId,
      enabled: true,
    });
  });

  it("processPendingDeliveries picks up pending rows (cron path)", async () => {
    capturedRequests.length = 0;

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      CMS_EVENT_PUBLISHED,
      cmsDocumentEventSchema.parse({
        collection: "legal",
        locale: "es",
        slug: "cron-smoke",
        title: "Cron smoke",
        status: "published",
      })
    );

    expect(enqueueResult.deliveryIds).toHaveLength(1);

    const [pending] = await database
      .select()
      .from(webhookDelivery)
      .where(eq(webhookDelivery.id, enqueueResult.deliveryIds[0]!));

    expect(pending?.status).toBe("pending");

    const cronResult = await processPendingDeliveries(50);

    expect(cronResult.delivered).toBeGreaterThanOrEqual(1);
    expect(capturedRequests.length).toBeGreaterThanOrEqual(1);
  });

  it("dual-signs during secret rotation grace period", async () => {
    capturedRequests.length = 0;
    const previousSecret = endpointSecret;

    const rotation = await rotateWebhookEndpointSecret(
      organizationId,
      endpointId
    );

    expect(rotation?.secret).toMatch(/^whsec_/);
    endpointSecret = rotation!.secret;

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      CMS_EVENT_PUBLISHED,
      cmsDocumentEventSchema.parse({
        collection: "blog",
        locale: "en",
        slug: "rotation-smoke",
        title: "Rotation",
        status: "published",
      })
    );

    await processWebhookDeliveries({
      deliveryIds: enqueueResult.deliveryIds,
    });

    const request = capturedRequests[0]!;
    const signatures = request.headers["webhook-signature"]?.split(" ") ?? [];

    expect(signatures.length).toBe(2);

    expect(
      verifyStandardWebhook({
        secret: endpointSecret,
        rawBody: request.body,
        headers: request.headers,
        toleranceSeconds: 60_000,
      }).ok
    ).toBe(true);

    expect(
      verifyStandardWebhook({
        secret: previousSecret,
        rawBody: request.body,
        headers: request.headers,
        toleranceSeconds: 60_000,
      }).ok
    ).toBe(true);
  });

  it("replays failed deliveries and cron delivers them", async () => {
    capturedRequests.length = 0;

    setIntegrationFetchHandler(
      async () => new Response("down", { status: 503 })
    );

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      CMS_EVENT_PUBLISHED,
      cmsDocumentEventSchema.parse({
        collection: "blog",
        locale: "en",
        slug: "replay-smoke",
        title: "Replay smoke",
        status: "published",
      })
    );

    await processWebhookDeliveries({
      deliveryIds: enqueueResult.deliveryIds,
    });

    const deliveryId = enqueueResult.deliveryIds[0]!;

    await database
      .update(webhookDelivery)
      .set({
        status: "failed",
        attempts: 5,
        lastError: "HTTP 503",
      })
      .where(eq(webhookDelivery.id, deliveryId));

    const replayed = await replayWebhookDelivery(organizationId, deliveryId);

    expect(replayed).toBe(true);

    const [queued] = await database
      .select()
      .from(webhookDelivery)
      .where(eq(webhookDelivery.id, deliveryId));

    expect(queued?.status).toBe("pending");
    expect(queued?.attempts).toBe(0);

    setIntegrationFetchHandler(async (input, init) => {
      const url = String(input);
      const headers = Object.fromEntries(new Headers(init?.headers).entries());
      const body = typeof init?.body === "string" ? init.body : "";

      capturedRequests.push({ url, headers, body });

      return new Response("ok", { status: 200 });
    });

    await resetWebhookEndpointHealth(organizationId, endpointId);

    const cronResult = await processPendingDeliveries(50);

    expect(cronResult.delivered).toBeGreaterThanOrEqual(1);
    expect(capturedRequests.length).toBeGreaterThanOrEqual(1);

    const [delivered] = await database
      .select()
      .from(webhookDelivery)
      .where(eq(webhookDelivery.id, deliveryId));

    expect(delivered?.status).toBe("delivered");
  });

  it("lists deliveries with cursor pagination and filters", async () => {
    const listEndpoint = await createWebhookEndpoint({
      organizationId,
      url: `https://example.com/webhooks/list-${createId()}`,
      events: [CMS_EVENT_PUBLISHED],
      description: "Delivery list pagination smoke",
    });

    const createdDeliveryIds: string[] = [];

    for (let index = 0; index < 3; index += 1) {
      const enqueueResult = await enqueueWebhookEvent(
        organizationId,
        CMS_EVENT_PUBLISHED,
        cmsDocumentEventSchema.parse({
          collection: "blog",
          locale: "en",
          slug: `list-smoke-${index}-${createId()}`,
          title: `List smoke ${index}`,
          status: "published",
        })
      );

      const [listDelivery] = await database
        .select({ id: webhookDelivery.id })
        .from(webhookDelivery)
        .where(
          and(
            eq(webhookDelivery.eventId, enqueueResult.eventId!),
            eq(webhookDelivery.endpointId, listEndpoint.id)
          )
        )
        .limit(1);

      createdDeliveryIds.push(listDelivery!.id);

      await processWebhookDeliveries({
        deliveryIds: enqueueResult.deliveryIds,
      });
    }

    const pageOne = await listWebhookDeliveries(organizationId, {
      limit: 2,
      endpointId: listEndpoint.id,
    });

    expect(pageOne.deliveries.length).toBe(2);
    expect(pageOne.nextCursor).toBeTruthy();

    const pageOneIds = new Set(pageOne.deliveries.map((row) => row.id));

    const pageTwo = await listWebhookDeliveries(organizationId, {
      limit: 2,
      endpointId: listEndpoint.id,
      cursor: pageOne.nextCursor!,
    });

    expect(pageTwo.deliveries).toHaveLength(1);
    expect(pageOneIds.has(pageTwo.deliveries[0]!.id)).toBe(false);
    expect(createdDeliveryIds).toContain(pageTwo.deliveries[0]!.id);

    const unknownEndpoint = await listWebhookDeliveries(organizationId, {
      endpointId: createId(),
    });

    expect(unknownEndpoint).toEqual({ deliveries: [], nextCursor: null });

    const deliveredOnly = await listWebhookDeliveries(organizationId, {
      status: "delivered",
      endpointId: listEndpoint.id,
      limit: 50,
    });

    expect(deliveredOnly.deliveries).toHaveLength(3);
    expect(
      deliveredOnly.deliveries.every((row) => row.status === "delivered")
    ).toBe(true);
  });
});
