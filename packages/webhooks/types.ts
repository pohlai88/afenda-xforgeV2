import { z } from "zod";
import type { CmsDocumentEvent } from "@repo/cms/events";
import type { WebhookDeliveryStatus } from "@repo/database/schema";

export type { WebhookDeliveryStatus };

export const WEBHOOK_TEST_EVENT = "webhook.test";

export const CMS_WEBHOOK_EVENTS = [
  "cms.document.published",
  "cms.document.unpublished",
] as const;

export type CmsWebhookEventType = (typeof CMS_WEBHOOK_EVENTS)[number];

export const ALL_WEBHOOK_EVENT_TYPES = [
  ...CMS_WEBHOOK_EVENTS,
  WEBHOOK_TEST_EVENT,
] as const;

export type WebhookEventType = (typeof ALL_WEBHOOK_EVENT_TYPES)[number];

export const webhookEventTypeSchema = z.enum(ALL_WEBHOOK_EVENT_TYPES);

export const cmsWebhookEventTypeSchema = z.enum(CMS_WEBHOOK_EVENTS);

/** Maps each outbound event type to its `data` payload shape. */
export type WebhookEventDataMap = {
  "cms.document.published": CmsDocumentEvent;
  "cms.document.unpublished": CmsDocumentEvent;
  "webhook.test": { message: string };
};

/** JSON body delivered to subscriber endpoints (Standard Webhooks payload). */
export type WebhookPayload<TType extends WebhookEventType> = {
  type: TType;
  timestamp: string;
  organizationId: string;
  data: WebhookEventDataMap[TType];
};

/** @deprecated Use WebhookPayload — event id is sent in the webhook-id header. */
export type WebhookEnvelope<TType extends WebhookEventType> =
  WebhookPayload<TType>;

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

export type EnqueueWebhookResult = {
  eventId: string | null;
  deliveryCount: number;
  deliveryIds: string[];
};

export const isWebhookEventType = (value: string): value is WebhookEventType =>
  (ALL_WEBHOOK_EVENT_TYPES as readonly string[]).includes(value);

export const parseWebhookEventTypes = (
  events: string[]
): WebhookEventType[] => {
  const parsed = z.array(webhookEventTypeSchema).min(1).safeParse(events);

  if (!parsed.success) {
    throw new Error("Invalid webhook event subscription");
  }

  return parsed.data;
};
