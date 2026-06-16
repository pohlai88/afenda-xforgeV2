import "server-only";

import { database } from "@repo/database";
import { webhookEndpoint } from "@repo/database/schema";
import { and, eq } from "drizzle-orm";
import { keys } from "../../keys";
import {
  CMS_WEBHOOK_EVENTS,
  type CmsWebhookEventType,
} from "../registry/events";
import {
  CUSTOMER_ENDPOINT_KIND,
  FIRST_PARTY_ENDPOINT_KIND,
} from "./endpoint-kinds";
import { validateWebhookUrl } from "./url-validation";

export { CUSTOMER_ENDPOINT_KIND, FIRST_PARTY_ENDPOINT_KIND };

const firstPartyEndpointId = (organizationId: string): string =>
  `fp-web-${organizationId}`;

const normalizeStoredSecret = (secret: string): string =>
  secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;

export const isFirstPartyWebConfigured = (): boolean => {
  const config = keys();

  return Boolean(
    config.WEBHOOK_FIRST_PARTY_WEB_URL && config.WEBHOOK_FIRST_PARTY_WEB_SECRET
  );
};

export const isCmsOutboundEvent = (eventType: string): boolean =>
  (CMS_WEBHOOK_EVENTS as readonly string[]).includes(eventType);

export const ensureFirstPartyWebEndpoint = async (
  organizationId: string,
  subscribedEvents: readonly CmsWebhookEventType[]
): Promise<string | null> => {
  if (!isFirstPartyWebConfigured()) {
    return null;
  }

  const config = keys();
  const url = validateWebhookUrl(
    config.WEBHOOK_FIRST_PARTY_WEB_URL?.trim()
  ).toString();
  const endpointId = firstPartyEndpointId(organizationId);
  const now = new Date();
  const storedSecret = normalizeStoredSecret(
    config.WEBHOOK_FIRST_PARTY_WEB_SECRET!
  );

  const [existing] = await database
    .select({ id: webhookEndpoint.id })
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.id, endpointId),
        eq(webhookEndpoint.organizationId, organizationId)
      )
    )
    .limit(1);

  if (existing) {
    await database
      .update(webhookEndpoint)
      .set({
        url,
        secret: storedSecret,
        enabled: true,
        events: [...subscribedEvents],
        kind: FIRST_PARTY_ENDPOINT_KIND,
        recentFailures: 0,
        disabledUntil: null,
        updatedAt: now,
      })
      .where(eq(webhookEndpoint.id, endpointId));

    return endpointId;
  }

  await database.insert(webhookEndpoint).values({
    id: endpointId,
    organizationId,
    url,
    secret: storedSecret,
    enabled: true,
    events: [...subscribedEvents],
    description: "First-party marketing site cache",
    kind: FIRST_PARTY_ENDPOINT_KIND,
    createdAt: now,
    updatedAt: now,
  });

  return endpointId;
};
