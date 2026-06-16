import { createId } from "@paralleldrive/cuid2";
import { CMS_EVENT_PUBLISHED, cmsDocumentEventSchema } from "@repo/cms/events";
import { database } from "@repo/database";
import {
  organization,
  webhookDelivery,
  webhookEndpoint,
} from "@repo/database/schema";
import { and, eq } from "drizzle-orm";
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
import { FIRST_PARTY_ENDPOINT_KIND } from "../../lib/outbound/endpoint-kinds";
import { enqueueWebhookEvent } from "../../lib/outbound/enqueue";
import { verifyStandardWebhook } from "../../lib/verify";
import { setIntegrationFetchHandler } from "../../test-support/setup-integration-fetch";

const FIRST_PARTY_URL =
  "https://first-party-integration.test/api/webhooks/cms-cache";
const FIRST_PARTY_SECRET = "whsec_dGVzdC1sb2NhbC13ZWJob29rLXNlY3JldC1kZXYxMjM=";

const hasDatabase = Boolean(process.env.DATABASE_URL ?? process.env.DIRECT_URL);

describe.skipIf(!hasDatabase)("first-party webhook fan-out integration", () => {
  const organizationId = createId();
  const capturedUrls: string[] = [];

  beforeAll(async () => {
    process.env.WEBHOOK_FIRST_PARTY_WEB_URL = FIRST_PARTY_URL;
    process.env.WEBHOOK_FIRST_PARTY_WEB_SECRET = FIRST_PARTY_SECRET;

    const now = new Date();

    await database.insert(organization).values({
      id: organizationId,
      name: "First-party integration org",
      createdAt: now,
      updatedAt: now,
    });
  });

  beforeEach(() => {
    capturedUrls.length = 0;
    setIntegrationFetchHandler((input) => {
      capturedUrls.push(String(input));
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

  it("enqueues and delivers CMS events to the configured first-party URL", async () => {
    const payload = cmsDocumentEventSchema.parse({
      collection: "blog",
      locale: "en",
      slug: `fp-smoke-${createId()}`,
      title: "First-party smoke",
      status: "published",
    });

    const enqueueResult = await enqueueWebhookEvent(
      organizationId,
      CMS_EVENT_PUBLISHED,
      payload
    );

    expect(enqueueResult.deliveryCount).toBe(1);
    expect(enqueueResult.deliveryIds).toHaveLength(1);

    const [firstPartyEndpoint] = await database
      .select()
      .from(webhookEndpoint)
      .where(
        and(
          eq(webhookEndpoint.organizationId, organizationId),
          eq(webhookEndpoint.kind, FIRST_PARTY_ENDPOINT_KIND)
        )
      )
      .limit(1);

    expect(firstPartyEndpoint?.url).toBe(FIRST_PARTY_URL);
    expect(firstPartyEndpoint?.enabled).toBe(true);

    await processWebhookDeliveries({
      deliveryIds: enqueueResult.deliveryIds,
    });

    expect(capturedUrls).toContain(FIRST_PARTY_URL);

    const [delivery] = await database
      .select()
      .from(webhookDelivery)
      .where(eq(webhookDelivery.id, enqueueResult.deliveryIds[0]!))
      .limit(1);

    expect(delivery?.status).toBe("delivered");

    const captured = capturedUrls.find((url) => url === FIRST_PARTY_URL);
    expect(captured).toBeTruthy();

    const lastFetch = vi.mocked(fetch).mock.calls.at(-1);
    const init = lastFetch?.[1];
    const body = typeof init?.body === "string" ? init.body : "";
    const headers = Object.fromEntries(new Headers(init?.headers).entries());

    const verification = verifyStandardWebhook({
      secret: FIRST_PARTY_SECRET,
      rawBody: body,
      headers,
    });

    expect(verification.ok).toBe(true);
    expect(JSON.parse(body).type).toBe(CMS_EVENT_PUBLISHED);
  });
});
