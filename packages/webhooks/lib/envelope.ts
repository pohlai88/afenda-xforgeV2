import "server-only";

import { createId } from "@paralleldrive/cuid2";
import type {
  EnqueueWebhookResult,
  WebhookEventDataMap,
  WebhookEventType,
  WebhookPayload,
} from "../types";

export const buildWebhookPayload = <TType extends WebhookEventType>(
  eventType: TType,
  organizationId: string,
  data: WebhookEventDataMap[TType]
): WebhookPayload<TType> => ({
  type: eventType,
  timestamp: new Date().toISOString(),
  organizationId,
  data,
});

/** @deprecated Use buildWebhookPayload */
export const buildWebhookEnvelope = buildWebhookPayload;

export const emptyEnqueueResult = (): EnqueueWebhookResult => ({
  eventId: null,
  deliveryCount: 0,
  deliveryIds: [],
});

export const newDeliveryId = (): string => createId();

export const newEventId = (): string => createId();
