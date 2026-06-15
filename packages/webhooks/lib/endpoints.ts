import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { webhookDelivery, webhookEndpoint } from "@repo/database/schema";
import type { WebhookDeliveryStatus } from "@repo/database/schema";
import { and, desc, eq, lte, sql } from "drizzle-orm";
import { keys } from "../keys";
import type {
  ListWebhookDeliveriesOptions,
  WebhookDeliveryRecord,
  WebhookEndpointPublic,
  WebhookEndpointWithSecret,
  WebhookEventType,
} from "../types";
import {
  isWebhookEventType,
  parseWebhookEventTypes,
  WEBHOOK_TEST_EVENT,
} from "../types";
import {
  formatSigningSecretForDisplay,
  generateWebhookSecret,
} from "./secrets";
import { validateWebhookUrl } from "./url-validation";
import {
  WEBHOOK_RESPONSE_BODY_MAX_LENGTH,
  WEBHOOK_SECRET_ROTATION_GRACE_MS,
} from "./constants";

const truncateResponseBody = (value: string): string =>
  value.slice(0, WEBHOOK_RESPONSE_BODY_MAX_LENGTH);

const isDeliveryStatus = (
  value: string | null
): value is WebhookDeliveryStatus =>
  value === "pending" ||
  value === "delivered" ||
  value === "retrying" ||
  value === "failed";

const toPublicEndpoint = (
  row: typeof webhookEndpoint.$inferSelect,
  lastDeliveryStatus: string | null,
  lastDeliveryError: string | null
): WebhookEndpointPublic => ({
  id: row.id,
  organizationId: row.organizationId,
  url: row.url,
  enabled: row.enabled,
  events: row.events.filter(isWebhookEventType),
  description: row.description,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  lastDeliveryStatus: isDeliveryStatus(lastDeliveryStatus)
    ? lastDeliveryStatus
    : null,
  lastDeliveryError: lastDeliveryError,
});

export const listWebhookEndpoints = async (
  organizationId: string
): Promise<WebhookEndpointPublic[]> => {
  const rows = await database
    .select({
      endpoint: webhookEndpoint,
      lastDeliveryStatus: sql<string | null>`(
        SELECT d.status
        FROM next_forge.webhook_deliveries d
        WHERE d."endpointId" = ${webhookEndpoint.id}
          AND d."organizationId" = ${webhookEndpoint.organizationId}
        ORDER BY d."createdAt" DESC
        LIMIT 1
      )`,
      lastDeliveryError: sql<string | null>`(
        SELECT d."lastError"
        FROM next_forge.webhook_deliveries d
        WHERE d."endpointId" = ${webhookEndpoint.id}
          AND d."organizationId" = ${webhookEndpoint.organizationId}
        ORDER BY d."createdAt" DESC
        LIMIT 1
      )`,
    })
    .from(webhookEndpoint)
    .where(eq(webhookEndpoint.organizationId, organizationId))
    .orderBy(desc(webhookEndpoint.createdAt));

  return rows.map(({ endpoint, lastDeliveryStatus, lastDeliveryError }) =>
    toPublicEndpoint(endpoint, lastDeliveryStatus, lastDeliveryError)
  );
};

export const createWebhookEndpoint = async (input: {
  organizationId: string;
  url: string;
  events: string[];
  description?: string;
}): Promise<WebhookEndpointWithSecret> => {
  const normalizedUrl = validateWebhookUrl(input.url.trim()).toString();
  const events = parseWebhookEventTypes(input.events);

  const now = new Date();
  const secret = generateWebhookSecret();
  const id = createId();

  const [row] = await database
    .insert(webhookEndpoint)
    .values({
      id,
      organizationId: input.organizationId,
      url: normalizedUrl,
      secret,
      enabled: true,
      events,
      description: input.description ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return {
    ...toPublicEndpoint(row, null, null),
    secret: formatSigningSecretForDisplay(secret),
  };
};

export const updateWebhookEndpoint = async (input: {
  organizationId: string;
  endpointId: string;
  url?: string;
  events?: WebhookEventType[];
  description?: string | null;
  enabled?: boolean;
}): Promise<WebhookEndpointPublic | null> => {
  const [existing] = await database
    .select()
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.id, input.endpointId),
        eq(webhookEndpoint.organizationId, input.organizationId)
      )
    )
    .limit(1);

  if (!existing) {
    return null;
  }

  const normalizedUrl = input.url
    ? validateWebhookUrl(input.url.trim()).toString()
    : undefined;
  const events = input.events ? parseWebhookEventTypes(input.events) : undefined;

  const [row] = await database
    .update(webhookEndpoint)
    .set({
      ...(normalizedUrl ? { url: normalizedUrl } : {}),
      ...(events ? { events } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.enabled !== undefined ? { enabled: input.enabled } : {}),
      updatedAt: new Date(),
    })
    .where(eq(webhookEndpoint.id, input.endpointId))
    .returning();

  return toPublicEndpoint(row, null, null);
};

export const deleteWebhookEndpoint = async (
  organizationId: string,
  endpointId: string
): Promise<boolean> => {
  const deleted = await database
    .delete(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.id, endpointId),
        eq(webhookEndpoint.organizationId, organizationId)
      )
    )
    .returning({ id: webhookEndpoint.id });

  return deleted.length > 0;
};

export const rotateWebhookEndpointSecret = async (
  organizationId: string,
  endpointId: string
): Promise<{ secret: string } | null> => {
  const [existing] = await database
    .select()
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.id, endpointId),
        eq(webhookEndpoint.organizationId, organizationId)
      )
    )
    .limit(1);

  if (!existing) {
    return null;
  }

  const now = new Date();
  const newSecret = generateWebhookSecret();
  const expiresAt = new Date(now.getTime() + WEBHOOK_SECRET_ROTATION_GRACE_MS);

  await database
    .update(webhookEndpoint)
    .set({
      secretPrevious: existing.secret,
      secretPreviousExpiresAt: expiresAt,
      secret: newSecret,
      updatedAt: now,
    })
    .where(eq(webhookEndpoint.id, endpointId));

  return { secret: formatSigningSecretForDisplay(newSecret) };
};

export const listWebhookDeliveries = async (
  organizationId: string,
  options: ListWebhookDeliveriesOptions = {}
): Promise<WebhookDeliveryRecord[]> => {
  const limit = options.limit ?? 50;
  const filters = [eq(webhookDelivery.organizationId, organizationId)];

  if (options.endpointId) {
    filters.push(eq(webhookDelivery.endpointId, options.endpointId));
  }

  if (options.status) {
    filters.push(eq(webhookDelivery.status, options.status));
  }

  if (options.cursor) {
    const [cursorRow] = await database
      .select({
        createdAt: webhookDelivery.createdAt,
        id: webhookDelivery.id,
      })
      .from(webhookDelivery)
      .where(
        and(
          eq(webhookDelivery.id, options.cursor),
          eq(webhookDelivery.organizationId, organizationId)
        )
      )
      .limit(1);

    if (cursorRow) {
      filters.push(
        sql`ROW(${webhookDelivery.createdAt}, ${webhookDelivery.id}) < ROW(${cursorRow.createdAt}, ${cursorRow.id})`
      );
    }
  }

  const rows = await database
    .select({
      delivery: webhookDelivery,
      endpointUrl: webhookEndpoint.url,
    })
    .from(webhookDelivery)
    .innerJoin(
      webhookEndpoint,
      eq(webhookDelivery.endpointId, webhookEndpoint.id)
    )
    .where(and(...filters))
    .orderBy(desc(webhookDelivery.createdAt), desc(webhookDelivery.id))
    .limit(limit);

  return rows.map(({ delivery, endpointUrl }) => ({
    id: delivery.id,
    eventId: delivery.eventId,
    organizationId: delivery.organizationId,
    endpointId: delivery.endpointId,
    eventType: isWebhookEventType(delivery.eventType)
      ? delivery.eventType
      : WEBHOOK_TEST_EVENT,
    status: delivery.status,
    attempts: delivery.attempts,
    lastError: delivery.lastError,
    responseStatus: delivery.responseStatus,
    responseBody: delivery.responseBody,
    createdAt: delivery.createdAt,
    deliveredAt: delivery.deliveredAt,
    endpointUrl,
  }));
};

export const replayWebhookDelivery = async (
  organizationId: string,
  deliveryId: string
): Promise<boolean> => {
  const [row] = await database
    .select()
    .from(webhookDelivery)
    .where(
      and(
        eq(webhookDelivery.id, deliveryId),
        eq(webhookDelivery.organizationId, organizationId)
      )
    )
    .limit(1);

  if (!row || row.status !== "failed") {
    return false;
  }

  await database
    .update(webhookDelivery)
    .set({
      status: "pending",
      attempts: 0,
      nextAttemptAt: new Date(),
      lastError: null,
      responseStatus: null,
      responseBody: null,
    })
    .where(eq(webhookDelivery.id, deliveryId));

  return true;
};

export const pruneOldWebhookDeliveries = async (): Promise<{
  deleted: number;
}> => {
  const retentionDays = keys().WEBHOOK_DELIVERY_RETENTION_DAYS;
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

  const deleted = await database
    .delete(webhookDelivery)
    .where(lte(webhookDelivery.createdAt, cutoff))
    .returning({ id: webhookDelivery.id });

  return { deleted: deleted.length };
};

export { truncateResponseBody };
