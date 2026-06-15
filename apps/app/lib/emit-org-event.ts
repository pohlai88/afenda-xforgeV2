import type {
  EnqueueWebhookResult,
  WebhookEventDataMap,
  WebhookEventType,
} from "@repo/webhooks";
import { enqueueWebhookEvent } from "@repo/webhooks/server";

const failedEnqueueResult = (): EnqueueWebhookResult => ({
  eventId: null,
  deliveryCount: 0,
  deliveryIds: [],
});

/**
 * Sole outbound webhook producer for organization-scoped events.
 * Fan-out (customer endpoints + first-party web) runs inside @repo/webhooks.
 */
export const emitOrgEvent = async <TType extends WebhookEventType>(
  organizationId: string,
  eventType: TType,
  data: WebhookEventDataMap[TType]
): Promise<EnqueueWebhookResult> => {
  try {
    return await enqueueWebhookEvent(organizationId, eventType, data);
  } catch (error) {
    console.error(`[emit-org-event] ${eventType} failed:`, error);
    return failedEnqueueResult();
  }
};
