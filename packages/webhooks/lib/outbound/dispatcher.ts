import "server-only";

import { database } from "@repo/database";
import { webhookDelivery, webhookEndpoint } from "@repo/database/schema";
import { and, asc, eq, inArray, lte, or, sql } from "drizzle-orm";
import { keys } from "../../keys";
import { signStandardWebhookHeader } from "../signing";
import { truncateResponseBody } from "../response-body";
import { tryClaimDelivery } from "./claim";
import {
  isEndpointDeliverable,
  recordEndpointDeliveryFailure,
  recordEndpointDeliverySuccess,
} from "./endpoints";
import { FIRST_PARTY_ENDPOINT_KIND } from "./endpoint-kinds";
import {
  classifyHttpFailure,
  getNextAttemptAt,
  MAX_TRANSIENT_ATTEMPTS,
  type WebhookFailureClass,
} from "./retry";

export type DeliveryProcessResult = {
  processed: number;
  delivered: number;
  retrying: number;
  failed: number;
  skipped: number;
};

export type ProcessWebhookDeliveriesOptions = {
  limit?: number;
  deliveryIds?: string[];
};

type DeliveryRow = {
  delivery: typeof webhookDelivery.$inferSelect;
  endpoint: typeof webhookEndpoint.$inferSelect;
};

const deliverableStatusCondition = (now: Date) =>
  and(
    or(
      eq(webhookDelivery.status, "pending"),
      eq(webhookDelivery.status, "retrying")
    ),
    lte(webhookDelivery.nextAttemptAt, now)
  );

const listDeliverableRows = async (limit: number): Promise<DeliveryRow[]> => {
  const now = new Date();

  const rows = await database
    .select({
      delivery: webhookDelivery,
      endpoint: webhookEndpoint,
    })
    .from(webhookDelivery)
    .innerJoin(
      webhookEndpoint,
      eq(webhookDelivery.endpointId, webhookEndpoint.id)
    )
    .where(deliverableStatusCondition(now))
    .orderBy(asc(webhookDelivery.createdAt))
    .limit(limit * 3);

  return rows
    .filter(({ endpoint }) => isEndpointDeliverable(endpoint, now))
    .slice(0, limit);
};

const listDeliveryRowsByIds = async (
  deliveryIds: string[]
): Promise<DeliveryRow[]> => {
  const now = new Date();

  const rows = await database
    .select({
      delivery: webhookDelivery,
      endpoint: webhookEndpoint,
    })
    .from(webhookDelivery)
    .innerJoin(
      webhookEndpoint,
      eq(webhookDelivery.endpointId, webhookEndpoint.id)
    )
    .where(inArray(webhookDelivery.id, deliveryIds))
    .orderBy(asc(webhookDelivery.createdAt));

  return rows.filter(({ endpoint }) => isEndpointDeliverable(endpoint, now));
};

const WEBHOOK_CRON_LOCK_KEY = 424242;

const tryAcquireCronLock = async (): Promise<boolean> => {
  const result = await database.execute<{ pg_try_advisory_lock: boolean }>(
    sql`SELECT pg_try_advisory_lock(${WEBHOOK_CRON_LOCK_KEY}) as "pg_try_advisory_lock"`
  );

  return result.rows[0]?.pg_try_advisory_lock === true;
};

const releaseCronLock = async (): Promise<void> => {
  await database.execute(
    sql`SELECT pg_advisory_unlock(${WEBHOOK_CRON_LOCK_KEY})`
  );
};

const signingSecretsForEndpoint = (
  endpoint: typeof webhookEndpoint.$inferSelect
): string[] => {
  const secrets = [endpoint.secret];
  const now = new Date();

  if (
    endpoint.secretPrevious &&
    endpoint.secretPreviousExpiresAt &&
    endpoint.secretPreviousExpiresAt > now
  ) {
    secrets.push(endpoint.secretPrevious);
  }

  return secrets;
};

const markDeliveryFailed = async (
  delivery: typeof webhookDelivery.$inferSelect,
  endpoint: typeof webhookEndpoint.$inferSelect,
  attempts: number,
  responseStatus: number | null,
  lastError: string,
  responseBody: string | null,
  failureClass: WebhookFailureClass
): Promise<"retrying" | "failed"> => {
  const nextAttemptAt = getNextAttemptAt(attempts, failureClass);

  await recordEndpointDeliveryFailure(
    endpoint.id,
    failureClass,
    endpoint.recentFailures,
    endpoint.kind
  );

  if (nextAttemptAt === null) {
    await database
      .update(webhookDelivery)
      .set({
        status: "failed",
        attempts,
        responseStatus,
        lastError,
        responseBody,
      })
      .where(eq(webhookDelivery.id, delivery.id));

    console.error("[webhooks] delivery failed permanently", {
      organizationId: delivery.organizationId,
      endpointId: delivery.endpointId,
      eventType: delivery.eventType,
      deliveryId: delivery.id,
      failureClass,
    });

    return "failed";
  }

  await database
    .update(webhookDelivery)
    .set({
      status: "retrying",
      attempts,
      nextAttemptAt,
      responseStatus,
      lastError,
      responseBody,
    })
    .where(eq(webhookDelivery.id, delivery.id));

  return "retrying";
};

type DeliveryOutcome = "delivered" | "retrying" | "failed" | "skipped";

const deliverClaimedRow = async (
  claimed: typeof webhookDelivery.$inferSelect,
  endpoint: typeof webhookEndpoint.$inferSelect,
  timeoutMs: number
): Promise<Exclude<DeliveryOutcome, "skipped">> => {
  const body = JSON.stringify(claimed.payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = signStandardWebhookHeader(
    signingSecretsForEndpoint(endpoint),
    {
      id: claimed.eventId,
      timestamp,
      body,
    }
  );
  const nextAttempts = claimed.attempts + 1;

  try {
    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "afenda-webhooks/1.0",
        "webhook-id": claimed.eventId,
        "webhook-timestamp": timestamp,
        "webhook-signature": signature,
      },
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (response.ok) {
      await database
        .update(webhookDelivery)
        .set({
          status: "delivered",
          attempts: nextAttempts,
          responseStatus: response.status,
          deliveredAt: new Date(),
          lastError: null,
          responseBody: null,
        })
        .where(eq(webhookDelivery.id, claimed.id));

      await recordEndpointDeliverySuccess(endpoint.id);

      return "delivered";
    }

    const responseText = await response.text().catch(() => "");
    const errorMessage =
      responseText.slice(0, 500) || `HTTP ${response.status}`;
    const responseBody = responseText
      ? truncateResponseBody(responseText)
      : null;
    const failureClass = classifyHttpFailure(response.status);

    return markDeliveryFailed(
      claimed,
      endpoint,
      nextAttempts,
      response.status,
      errorMessage,
      responseBody,
      failureClass
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook delivery failed";

    return markDeliveryFailed(
      claimed,
      endpoint,
      nextAttempts,
      null,
      message,
      null,
      "transient"
    );
  }
};

export const processWebhookDeliveries = async (
  options: ProcessWebhookDeliveriesOptions = {}
): Promise<DeliveryProcessResult> => {
  const deliveryIds = options.deliveryIds;
  const isCronBatch = !deliveryIds?.length;

  if (isCronBatch && !(await tryAcquireCronLock())) {
    return {
      processed: 0,
      delivered: 0,
      retrying: 0,
      failed: 0,
      skipped: 0,
    };
  }

  try {
    const limit = deliveryIds?.length ?? options.limit ?? 50;
    const rows = deliveryIds?.length
      ? await listDeliveryRowsByIds(deliveryIds)
      : await listDeliverableRows(limit);
    const timeoutMs = Number(keys().WEBHOOK_DELIVERY_TIMEOUT_MS);
    const now = new Date();

    const outcomes = await Promise.all(
      rows.map(async (row): Promise<DeliveryOutcome> => {
        const claimed = await tryClaimDelivery(row.delivery.id, now);

        if (!claimed) {
          return "skipped";
        }

        return deliverClaimedRow(claimed, row.endpoint, timeoutMs);
      })
    );

    return outcomes.reduce<DeliveryProcessResult>(
      (accumulator, outcome) => {
        switch (outcome) {
          case "delivered":
            return {
              ...accumulator,
              processed: accumulator.processed + 1,
              delivered: accumulator.delivered + 1,
            };
          case "retrying":
            return {
              ...accumulator,
              processed: accumulator.processed + 1,
              retrying: accumulator.retrying + 1,
            };
          case "failed":
            return {
              ...accumulator,
              processed: accumulator.processed + 1,
              failed: accumulator.failed + 1,
            };
          case "skipped":
            return {
              ...accumulator,
              skipped: accumulator.skipped + 1,
            };
          default:
            return accumulator;
        }
      },
      { processed: 0, delivered: 0, retrying: 0, failed: 0, skipped: 0 }
    );
  } finally {
    if (isCronBatch) {
      await releaseCronLock();
    }
  }
};

/** Cron worker entry — claims oldest pending/retrying deliveries globally. */
export const processPendingDeliveries = async (
  limit = 50
): Promise<DeliveryProcessResult> => processWebhookDeliveries({ limit });

export { MAX_TRANSIENT_ATTEMPTS as MAX_WEBHOOK_ATTEMPTS };
