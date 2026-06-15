import { createId } from "@paralleldrive/cuid2";
import { CMS_EVENT_PUBLISHED, cmsDocumentEventSchema } from "@repo/cms/events";
import { database } from "@repo/database";
import {
  organization,
  webhookDelivery,
  webhookEndpoint,
} from "@repo/database/schema";
import { eq } from "drizzle-orm";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { processWebhookDeliveries } from "../../lib/outbound/dispatcher";
import {
  createWebhookEndpoint,
  resetWebhookEndpointHealth,
} from "../../lib/outbound/endpoints";
import { enqueueWebhookEvent } from "../../lib/outbound/enqueue";
import {
  CLIENT_ERROR_RETRY_DELAY_MS,
  ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT,
} from "../../lib/outbound/retry";
import { setIntegrationFetchHandler } from "../../test-support/setup-integration-fetch";

const hasDatabase = Boolean(process.env.DATABASE_URL ?? process.env.DIRECT_URL);

describe.skipIf(!hasDatabase)("webhook endpoint health integration", () => {
  const organizationId = createId();
  let endpointId: string;

  beforeAll(async () => {
    const now = new Date();

    await database.insert(organization).values({
      id: organizationId,
      name: "Webhook health integration org",
      createdAt: now,
      updatedAt: now,
    });

    const endpoint = await createWebhookEndpoint({
      organizationId,
      url: `https://example.com/webhooks/health-${createId()}`,
      events: [CMS_EVENT_PUBLISHED],
      description: "Health reset smoke",
    });

    endpointId = endpoint.id;
  });

  beforeEach(() => {
    setIntegrationFetchHandler(
      async () => new Response("not found", { status: 404 })
    );
  });

  afterAll(async () => {
    vi.unstubAllGlobals();
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

  it("auto-disables after client errors and resets via resetWebhookEndpointHealth", async () => {
    vi.useFakeTimers({ now: new Date("2026-06-15T12:00:00.000Z") });

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      CMS_EVENT_PUBLISHED,
      cmsDocumentEventSchema.parse({
        collection: "blog",
        locale: "en",
        slug: `health-smoke-${createId()}`,
        title: "Health smoke",
        status: "published",
      })
    );

    const deliveryId = enqueueResult.deliveryIds[0]!;

    for (
      let attempt = 0;
      attempt < ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT;
      attempt += 1
    ) {
      await processWebhookDeliveries({ deliveryIds: [deliveryId] });
      vi.advanceTimersByTime(CLIENT_ERROR_RETRY_DELAY_MS + 1000);
    }

    vi.useRealTimers();

    const [disabledEndpoint] = await database
      .select()
      .from(webhookEndpoint)
      .where(eq(webhookEndpoint.id, endpointId))
      .limit(1);

    expect(disabledEndpoint?.recentFailures).toBeGreaterThanOrEqual(
      ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT
    );
    expect(disabledEndpoint?.enabled).toBe(true);

    const reset = await resetWebhookEndpointHealth(organizationId, endpointId);

    expect(reset).toBe(true);

    const [resetEndpoint] = await database
      .select()
      .from(webhookEndpoint)
      .where(eq(webhookEndpoint.id, endpointId))
      .limit(1);

    expect(resetEndpoint?.recentFailures).toBe(0);
    expect(resetEndpoint?.disabledUntil).toBeNull();
    expect(resetEndpoint?.enabled).toBe(true);
  });
});
