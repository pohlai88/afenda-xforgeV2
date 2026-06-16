import type {
  CmsDocumentEvent,
  CmsSettingsUpdatedEvent,
} from "@repo/cms/events";
import {
  type WebhookDeliveryStatus,
  webhookDeliveryStatuses,
} from "@repo/database/schema";
import { z } from "zod";
import {
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_SETTINGS_UPDATED,
  CMS_EVENT_UNPUBLISHED,
  CMS_WEBHOOK_EVENTS,
  type CmsWebhookEventType,
  INBOUND_STRIPE_EVENT_TYPES,
  type InboundStripeEventType,
  OUTBOUND_WEBHOOK_EVENT_TYPES,
  STRIPE_EVENT_CHECKOUT_COMPLETED,
  STRIPE_EVENT_SUBSCRIPTION_SCHEDULE_CANCELED,
  WEBHOOK_TEST_EVENT,
} from "./lib/registry/events";

export type { WebhookDeliveryStatus };
export type { CmsWebhookEventType, InboundStripeEventType };

export {
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_UNPUBLISHED,
  CMS_EVENT_SETTINGS_UPDATED,
  CMS_WEBHOOK_EVENTS,
  WEBHOOK_TEST_EVENT,
  OUTBOUND_WEBHOOK_EVENT_TYPES,
  INBOUND_STRIPE_EVENT_TYPES,
  STRIPE_EVENT_CHECKOUT_COMPLETED,
  STRIPE_EVENT_SUBSCRIPTION_SCHEDULE_CANCELED,
};

export const WEBHOOK_DELIVERY_STATUSES = webhookDeliveryStatuses;

export const webhookDeliveryStatusSchema = z.enum(webhookDeliveryStatuses);

export const isWebhookDeliveryStatus = (
  value: string | null | undefined
): value is WebhookDeliveryStatus =>
  webhookDeliveryStatusSchema.safeParse(value).success;

export const ALL_WEBHOOK_EVENT_TYPES = OUTBOUND_WEBHOOK_EVENT_TYPES;

export type WebhookEventType = (typeof OUTBOUND_WEBHOOK_EVENT_TYPES)[number];

export const webhookEventTypeSchema = z.enum(OUTBOUND_WEBHOOK_EVENT_TYPES);

export const cmsWebhookEventTypeSchema = z.enum(CMS_WEBHOOK_EVENTS);

/** Maps each outbound event type to its `data` payload shape. */
export interface WebhookEventDataMap {
  "cms.document.published": CmsDocumentEvent;
  "cms.document.unpublished": CmsDocumentEvent;
  "cms.settings.updated": CmsSettingsUpdatedEvent;
  "webhook.test": { message: string };
}

/** JSON body delivered to subscriber endpoints (Standard Webhooks payload). */
export interface WebhookPayload<TType extends WebhookEventType> {
  data: WebhookEventDataMap[TType];
  organizationId: string;
  timestamp: string;
  type: TType;
}

export interface WebhookEndpointPublic {
  createdAt: Date;
  description: string | null;
  disabledUntil: Date | null;
  enabled: boolean;
  events: WebhookEventType[];
  id: string;
  isAutoDisabled: boolean;
  lastDeliveryError: string | null;
  lastDeliveryStatus: WebhookDeliveryStatus | null;
  organizationId: string;
  recentFailures: number;
  updatedAt: Date;
  url: string;
}

export type WebhookEndpointWithSecret = WebhookEndpointPublic & {
  secret: string;
};

export interface WebhookDeliveryRecord {
  attempts: number;
  createdAt: Date;
  deliveredAt: Date | null;
  endpointId: string;
  endpointUrl?: string;
  eventId: string;
  eventType: WebhookEventType;
  id: string;
  lastError: string | null;
  organizationId: string;
  responseBody: string | null;
  responseStatus: number | null;
  status: WebhookDeliveryStatus;
}

export interface ListWebhookDeliveriesOptions {
  cursor?: string;
  endpointId?: string;
  limit?: number;
  status?: WebhookDeliveryStatus;
}

export interface ListWebhookDeliveriesResult {
  deliveries: WebhookDeliveryRecord[];
  /** Delivery id cursor for the next page when `deliveries.length === limit`. */
  nextCursor: string | null;
}

export interface ReplayWebhookDeliveryResult {
  queued: true;
}

export interface EnqueueWebhookResult {
  deliveryCount: number;
  deliveryIds: string[];
  eventId: string | null;
}

export const isWebhookEventType = (value: string): value is WebhookEventType =>
  (OUTBOUND_WEBHOOK_EVENT_TYPES as readonly string[]).includes(value);

export const parseWebhookEventTypes = (
  events: string[]
): WebhookEventType[] => {
  const parsed = z.array(webhookEventTypeSchema).min(1).safeParse(events);

  if (!parsed.success) {
    throw new Error("Invalid webhook event subscription");
  }

  return parsed.data;
};
