import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { database } from "@repo/database";
import { webhookDelivery, webhookEndpoint } from "@repo/database/schema";
import { and, desc, eq, lt, lte, or, sql } from "drizzle-orm";
import { keys } from "../../keys";
import type {
  ListWebhookDeliveriesOptions,
  ListWebhookDeliveriesResult,
  WebhookDeliveryRecord,
  WebhookEndpointPublic,
  WebhookEndpointWithSecret,
  WebhookEventType,
} from "../../types";
import {
  isWebhookDeliveryStatus,
  isWebhookEventType,
  parseWebhookEventTypes,
  WEBHOOK_TEST_EVENT,
} from "../../types";
import { WEBHOOK_SECRET_ROTATION_GRACE_MS } from "../constants";
import {
  formatSigningSecretForDisplay,
  generateWebhookSecret,
} from "../secrets";
import {
  CUSTOMER_ENDPOINT_KIND,
  FIRST_PARTY_ENDPOINT_KIND,
} from "./endpoint-kinds";
import {
  ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT,
  getEndpointTransientCooldownMs,
  type WebhookFailureClass,
} from "./retry";
import { validateWebhookUrl } from "./url-validation";

const ENDPOINT_DISABLED_FAR_FUTURE = new Date("2099-01-01T00:00:00.000Z");

const toDeliveryRecord = (
  delivery: typeof webhookDelivery.$inferSelect,
  endpointUrl: string
): WebhookDeliveryRecord => ({
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
});

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
  lastDeliveryStatus: isWebhookDeliveryStatus(lastDeliveryStatus)
    ? lastDeliveryStatus
    : null,
  lastDeliveryError,
  recentFailures: row.recentFailures,
  disabledUntil: row.disabledUntil,
  isAutoDisabled:
    row.recentFailures >= ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT ||
    (row.disabledUntil !== null &&
      row.disabledUntil >= ENDPOINT_DISABLED_FAR_FUTURE),
});

export const isEndpointDeliverable = (
  endpoint: typeof webhookEndpoint.$inferSelect,
  now: Date
): boolean => {
  if (!endpoint.enabled) {
    return false;
  }

  if (endpoint.recentFailures >= ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT) {
    return false;
  }

  if (endpoint.disabledUntil && endpoint.disabledUntil > now) {
    return false;
  }

  return true;
};

export const recordEndpointDeliverySuccess = async (
  endpointId: string
): Promise<void> => {
  await database
    .update(webhookEndpoint)
    .set({
      recentFailures: 0,
      disabledUntil: null,
      updatedAt: new Date(),
    })
    .where(eq(webhookEndpoint.id, endpointId));
};

export const recordEndpointDeliveryFailure = async (
  endpointId: string,
  failureClass: WebhookFailureClass,
  currentRecentFailures: number,
  endpointKind: string = CUSTOMER_ENDPOINT_KIND
): Promise<void> => {
  if (endpointKind === FIRST_PARTY_ENDPOINT_KIND) {
    console.warn(
      "[webhooks] first-party delivery failure (health not penalized)",
      {
        endpointId,
        failureClass,
      }
    );
    return;
  }

  const now = new Date();
  const nextRecentFailures = currentRecentFailures + 1;
  let disabledUntil: Date | null = null;

  if (
    failureClass === "client" &&
    nextRecentFailures >= ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT
  ) {
    disabledUntil = ENDPOINT_DISABLED_FAR_FUTURE;
  } else if (failureClass === "transient") {
    disabledUntil = new Date(
      now.getTime() + getEndpointTransientCooldownMs(nextRecentFailures)
    );
  }

  await database
    .update(webhookEndpoint)
    .set({
      recentFailures: nextRecentFailures,
      disabledUntil,
      updatedAt: now,
    })
    .where(eq(webhookEndpoint.id, endpointId));

  if (
    failureClass === "client" &&
    nextRecentFailures >= ENDPOINT_CLIENT_ERROR_STRIKE_LIMIT
  ) {
    console.error("[webhooks] endpoint auto-disabled after client errors", {
      endpointId,
      recentFailures: nextRecentFailures,
    });
  }
};

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
    .where(
      and(
        eq(webhookEndpoint.organizationId, organizationId),
        eq(webhookEndpoint.kind, CUSTOMER_ENDPOINT_KIND)
      )
    )
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
      kind: CUSTOMER_ENDPOINT_KIND,
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
        eq(webhookEndpoint.organizationId, input.organizationId),
        eq(webhookEndpoint.kind, CUSTOMER_ENDPOINT_KIND)
      )
    )
    .limit(1);

  if (!existing) {
    return null;
  }

  const normalizedUrl = input.url
    ? validateWebhookUrl(input.url.trim()).toString()
    : undefined;
  const events = input.events
    ? parseWebhookEventTypes(input.events)
    : undefined;

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
        eq(webhookEndpoint.organizationId, organizationId),
        eq(webhookEndpoint.kind, CUSTOMER_ENDPOINT_KIND)
      )
    )
    .returning({ id: webhookEndpoint.id });

  return deleted.length > 0;
};

export const resetWebhookEndpointHealth = async (
  organizationId: string,
  endpointId: string
): Promise<boolean> => {
  const [row] = await database
    .update(webhookEndpoint)
    .set({
      recentFailures: 0,
      disabledUntil: null,
      enabled: true,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(webhookEndpoint.id, endpointId),
        eq(webhookEndpoint.organizationId, organizationId),
        eq(webhookEndpoint.kind, CUSTOMER_ENDPOINT_KIND)
      )
    )
    .returning({ id: webhookEndpoint.id });

  return Boolean(row);
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
        eq(webhookEndpoint.organizationId, organizationId),
        eq(webhookEndpoint.kind, CUSTOMER_ENDPOINT_KIND)
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
): Promise<ListWebhookDeliveriesResult> => {
  const limit = options.limit ?? 50;
  const filters = [eq(webhookDelivery.organizationId, organizationId)];

  if (options.endpointId) {
    const [endpoint] = await database
      .select({ id: webhookEndpoint.id })
      .from(webhookEndpoint)
      .where(
        and(
          eq(webhookEndpoint.id, options.endpointId),
          eq(webhookEndpoint.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!endpoint) {
      return { deliveries: [], nextCursor: null };
    }

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
        or(
          lt(webhookDelivery.createdAt, cursorRow.createdAt),
          and(
            eq(webhookDelivery.createdAt, cursorRow.createdAt),
            lt(webhookDelivery.id, cursorRow.id)
          )
        )!
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

  const deliveries = rows.map(({ delivery, endpointUrl }) =>
    toDeliveryRecord(delivery, endpointUrl)
  );
  const lastDelivery = deliveries.at(-1);

  return {
    deliveries,
    nextCursor:
      deliveries.length === limit && lastDelivery ? lastDelivery.id : null,
  };
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

export { FIRST_PARTY_ENDPOINT_KIND };
