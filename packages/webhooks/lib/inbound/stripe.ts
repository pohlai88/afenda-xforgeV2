import {
  STRIPE_EVENT_CHECKOUT_COMPLETED,
  STRIPE_EVENT_SUBSCRIPTION_SCHEDULE_CANCELED,
} from "../registry/events";
import type { InboundEvent } from "./types";

export type StripeWebhookEvent = {
  type: string;
  data: { object: unknown };
};

export type StripeWebhookVerifier = (
  body: string,
  signature: string,
  secret: string
) => StripeWebhookEvent;

const STRIPE_TYPE_MAP: Record<string, string> = {
  "checkout.session.completed": STRIPE_EVENT_CHECKOUT_COMPLETED,
  "subscription_schedule.canceled":
    STRIPE_EVENT_SUBSCRIPTION_SCHEDULE_CANCELED,
};

export const normalizeStripeEventType = (stripeType: string): string =>
  STRIPE_TYPE_MAP[stripeType] ?? `stripe.${stripeType}`;

export const verifyStripeWebhook = (
  body: string,
  signature: string,
  secret: string,
  verify: StripeWebhookVerifier
): StripeWebhookEvent => verify(body, signature, secret);

export const toInboundStripeEvent = (
  stripeEvent: StripeWebhookEvent
): InboundEvent => ({
  provider: "stripe",
  type: normalizeStripeEventType(stripeEvent.type),
  data: stripeEvent.data.object,
  raw: stripeEvent,
});
