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
export type WebhookEventDataMap = {
  "cms.document.published": CmsDocumentEvent;
  "cms.document.unpublished": CmsDocumentEvent;
  "cms.settings.updated": CmsSettingsUpdatedEvent;
  "webhook.test": { message: string };
};

/** JSON body delivered to subscriber endpoints (Standard Webhooks payload). */
export type WebhookPayload<TType extends WebhookEventType> = {
  type: TType;
  timestamp: string;
  organizationId: string;
  data: WebhookEventDataMap[TType];
};

export type WebhookEndpointPublic = {
  id: string;
  organizationId: string;
  url: string;
  enabled: boolean;
  events: WebhookEventType[];
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastDeliveryStatus: WebhookDeliveryStatus | null;
  lastDeliveryError: string | null;
  recentFailures: number;
  disabledUntil: Date | null;
  isAutoDisabled: boolean;
};

export type WebhookEndpointWithSecret = WebhookEndpointPublic & {
  secret: string;
};

export type WebhookDeliveryRecord = {
  id: string;
  eventId: string;
  organizationId: string;
  endpointId: string;
  eventType: WebhookEventType;
  status: WebhookDeliveryStatus;
  attempts: number;
  lastError: string | null;
  responseStatus: number | null;
  responseBody: string | null;
  createdAt: Date;
  deliveredAt: Date | null;
  endpointUrl?: string;
};

export type ListWebhookDeliveriesOptions = {
  endpointId?: string;
  status?: WebhookDeliveryStatus;
  limit?: number;
  cursor?: string;
};

export type ListWebhookDeliveriesResult = {
  deliveries: WebhookDeliveryRecord[];
  /** Delivery id cursor for the next page when `deliveries.length === limit`. */
  nextCursor: string | null;
};

export type ReplayWebhookDeliveryResult = {
  queued: true;
};

export type EnqueueWebhookResult = {
  eventId: string | null;
  deliveryCount: number;
  deliveryIds: string[];
};

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
