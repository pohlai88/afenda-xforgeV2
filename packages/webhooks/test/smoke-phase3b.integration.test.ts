import { createId } from "@paralleldrive/cuid2";
import {
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_UNPUBLISHED,
  cmsDocumentEventSchema,
} from "@repo/cms/events";
import { database } from "@repo/database";
import { organization, webhookDelivery } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  createWebhookEndpoint,
  replayWebhookDelivery,
  rotateWebhookEndpointSecret,
  updateWebhookEndpoint,
} from "../lib/endpoints";
import { enqueueWebhookEvent } from "../lib/enqueue";
import { processPendingDeliveries, processWebhookDeliveries } from "../lib/dispatcher";
import { verifyStandardWebhook } from "../lib/verify";
import { ensureWebhookOutboxSchema } from "../test-support/ensure-webhook-schema";

type CapturedWebhookRequest = {
  url: string;
  headers: Record<string, string>;
  body: string;
};

const hasDatabase = Boolean(
  process.env.DATABASE_URL ?? process.env.DIRECT_URL
);

describe.skipIf(!hasDatabase)("Phase 3B webhook outbox smoke", () => {
  const organizationId = createId();
  const capturedRequests: CapturedWebhookRequest[] = [];
  let endpointId: string;
  let endpointSecret: string;

  beforeAll(async () => {
    await ensureWebhookOutboxSchema();

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const headers = Object.fromEntries(
          new Headers(init?.headers).entries()
        );
        const body = typeof init?.body === "string" ? init.body : "";

        capturedRequests.push({ url, headers, body });

        return new Response("ok", { status: 200 });
      })
    );

    const now = new Date();

    await database.insert(organization).values({
      id: organizationId,
      name: "Phase 3B smoke org",
      createdAt: now,
      updatedAt: now,
    });

    const endpoint = await createWebhookEndpoint({
      organizationId,
      url: "https://example.com/webhooks/smoke",
      events: [CMS_EVENT_PUBLISHED, CMS_EVENT_UNPUBLISHED],
      description: "Phase 3B integration smoke",
    });

    endpointId = endpoint.id;
    endpointSecret = endpoint.secret;
  });

  afterAll(async () => {
    await database.delete(organization).where(eq(organization.id, organizationId));
    vi.unstubAllGlobals();
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

  it("replays failed deliveries with a fresh attempt budget", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("down", { status: 503 }))
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

    await database
      .update(webhookDelivery)
      .set({
        status: "failed",
        attempts: 5,
        lastError: "HTTP 503",
      })
      .where(eq(webhookDelivery.id, enqueueResult.deliveryIds[0]!));

    const [failed] = await database
      .select()
      .from(webhookDelivery)
      .where(eq(webhookDelivery.id, enqueueResult.deliveryIds[0]!));

    expect(failed?.status).toBe("failed");
    expect(failed?.attempts).toBe(5);

    const replayed = await replayWebhookDelivery(
      organizationId,
      enqueueResult.deliveryIds[0]!
    );

    expect(replayed).toBe(true);

    const [queued] = await database
      .select()
      .from(webhookDelivery)
      .where(eq(webhookDelivery.id, enqueueResult.deliveryIds[0]!));

    expect(queued?.status).toBe("pending");
    expect(queued?.attempts).toBe(0);

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const headers = Object.fromEntries(
          new Headers(init?.headers).entries()
        );
        const body = typeof init?.body === "string" ? init.body : "";

        capturedRequests.push({ url, headers, body });

        return new Response("ok", { status: 200 });
      })
    );
  });
});
