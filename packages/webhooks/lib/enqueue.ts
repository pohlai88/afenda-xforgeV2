import "server-only";

import { database } from "@repo/database";
import { webhookDelivery, webhookEndpoint } from "@repo/database/schema";
import { and, eq, sql } from "drizzle-orm";
import {
  buildWebhookPayload,
  emptyEnqueueResult,
  newDeliveryId,
  newEventId,
} from "./envelope";
import type {
  EnqueueWebhookResult,
  WebhookEventDataMap,
  WebhookEventType,
} from "../types";
import { WEBHOOK_TEST_EVENT } from "../types";

export const enqueueWebhookEvent = async <TType extends WebhookEventType>(
  organizationId: string,
  eventType: TType,
  data: WebhookEventDataMap[TType]
): Promise<EnqueueWebhookResult> => {
  const matchingEndpoints = await database
    .select()
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.organizationId, organizationId),
        eq(webhookEndpoint.enabled, true),
        sql`${eventType} = ANY(${webhookEndpoint.events})`
      )
    );

  if (matchingEndpoints.length === 0) {
    return emptyEnqueueResult();
  }

  const eventId = newEventId();
  const payload = buildWebhookPayload(eventType, organizationId, data);
  const now = new Date();

  const deliveryIds = matchingEndpoints.map(() => newDeliveryId());

  await database.insert(webhookDelivery).values(
    matchingEndpoints.map((endpoint, index) => ({
      id: deliveryIds[index]!,
      eventId,
      organizationId,
      endpointId: endpoint.id,
      eventType,
      payload,
      status: "pending" as const,
      attempts: 0,
      nextAttemptAt: now,
      createdAt: now,
    }))
  );

  return {
    eventId,
    deliveryCount: matchingEndpoints.length,
    deliveryIds,
  };
};

export const enqueueTestWebhook = async (
  organizationId: string,
  endpointId: string
): Promise<string | null> => {
  const [endpoint] = await database
    .select()
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.id, endpointId),
        eq(webhookEndpoint.organizationId, organizationId),
        eq(webhookEndpoint.enabled, true)
      )
    )
    .limit(1);

  if (!endpoint) {
    return null;
  }

  const deliveryId = newDeliveryId();
  const eventId = newEventId();
  const payload = buildWebhookPayload(
    WEBHOOK_TEST_EVENT,
    organizationId,
    { message: "Webhook test event" }
  );
  const now = new Date();

  await database.insert(webhookDelivery).values({
    id: deliveryId,
    eventId,
    organizationId,
    endpointId: endpoint.id,
    eventType: WEBHOOK_TEST_EVENT,
    payload,
    status: "pending",
    attempts: 0,
    nextAttemptAt: now,
    createdAt: now,
  });

  return deliveryId;
};
