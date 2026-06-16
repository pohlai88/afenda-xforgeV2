import "server-only";

import type Stripe from "stripe";
import { stripe } from "./index";

export interface StripeWebhookPayload {
  data: { object: unknown };
  type: string;
}

/**
 * Stripe signature verification for inbound webhooks.
 * Used by apps/api via @repo/webhooks inbound gateway.
 */
export const verifyStripeWebhookPayload = (
  body: string,
  signature: string,
  secret: string
): StripeWebhookPayload => {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    secret
  ) as Stripe.Event;

  return {
    type: event.type,
    data: { object: event.data.object },
  };
};
