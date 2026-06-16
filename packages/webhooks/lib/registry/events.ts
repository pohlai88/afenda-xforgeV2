/** Canonical webhook event catalog — CMS strings re-exported from @repo/cms/events. */

export {
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_SETTINGS_UPDATED,
  CMS_EVENT_UNPUBLISHED,
} from "@repo/cms/events";

export {
  ORBIT_EVENT_CASE_CREATED,
  ORBIT_EVENT_CASE_PUSHED,
} from "@repo/orbit-case";

import {
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_SETTINGS_UPDATED,
  CMS_EVENT_UNPUBLISHED,
} from "@repo/cms/events";
import {
  ORBIT_EVENT_CASE_CREATED,
  ORBIT_EVENT_CASE_PUSHED,
} from "@repo/orbit-case";

export const WEBHOOK_TEST_EVENT = "webhook.test";

export const CMS_WEBHOOK_EVENTS = [
  CMS_EVENT_PUBLISHED,
  CMS_EVENT_UNPUBLISHED,
  CMS_EVENT_SETTINGS_UPDATED,
] as const;

export type CmsWebhookEventType = (typeof CMS_WEBHOOK_EVENTS)[number];

export const ORBIT_WEBHOOK_EVENTS = [
  ORBIT_EVENT_CASE_CREATED,
  ORBIT_EVENT_CASE_PUSHED,
] as const;

export type OrbitWebhookEventType = (typeof ORBIT_WEBHOOK_EVENTS)[number];

export const OUTBOUND_WEBHOOK_EVENT_TYPES = [
  ...CMS_WEBHOOK_EVENTS,
  ...ORBIT_WEBHOOK_EVENTS,
  WEBHOOK_TEST_EVENT,
] as const;

export type OutboundWebhookEventType =
  (typeof OUTBOUND_WEBHOOK_EVENT_TYPES)[number];

export const STRIPE_EVENT_CHECKOUT_COMPLETED =
  "stripe.checkout.session.completed";
export const STRIPE_EVENT_SUBSCRIPTION_SCHEDULE_CANCELED =
  "stripe.subscription_schedule.canceled";

export const INBOUND_STRIPE_EVENT_TYPES = [
  STRIPE_EVENT_CHECKOUT_COMPLETED,
  STRIPE_EVENT_SUBSCRIPTION_SCHEDULE_CANCELED,
] as const;

export type InboundStripeEventType =
  (typeof INBOUND_STRIPE_EVENT_TYPES)[number];

export const INBOUND_PROVIDERS = ["stripe", "auth"] as const;
export type InboundProvider = (typeof INBOUND_PROVIDERS)[number];

export const isCmsWebhookEventType = (
  value: string
): value is CmsWebhookEventType =>
  (CMS_WEBHOOK_EVENTS as readonly string[]).includes(value);
