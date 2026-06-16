import "server-only";

import type { InboundProvider } from "../registry/events";
import { dispatchInboundEvent } from "./registry";
import {
  type StripeWebhookEvent,
  type StripeWebhookVerifier,
  toInboundStripeEvent,
  verifyStripeWebhook,
} from "./stripe";
import type { InboundWebhookResult } from "./types";

export interface HandleInboundWebhookOptions {
  stripe?: {
    secret: string;
    verify: StripeWebhookVerifier;
  };
}

export const handleInboundWebhook = async (
  provider: InboundProvider,
  request: Request,
  options: HandleInboundWebhookOptions = {}
): Promise<InboundWebhookResult> => {
  if (provider === "stripe") {
    const stripeConfig = options.stripe;

    if (!stripeConfig?.secret) {
      return {
        ok: false,
        status: 503,
        error: "Stripe webhook is not configured",
      };
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return {
        ok: false,
        status: 400,
        error: "Missing stripe-signature header",
      };
    }

    let stripeEvent: StripeWebhookEvent;

    try {
      stripeEvent = verifyStripeWebhook(
        body,
        signature,
        stripeConfig.secret,
        stripeConfig.verify
      );
    } catch {
      return {
        ok: false,
        status: 400,
        error: "Invalid webhook signature",
      };
    }

    return dispatchInboundEvent(toInboundStripeEvent(stripeEvent));
  }

  if (provider === "auth") {
    return {
      ok: false,
      status: 501,
      error:
        "Auth webhook provider is not configured. Organization bootstrap runs on first authenticated app load.",
    };
  }

  return {
    ok: false,
    status: 400,
    error: `Unknown inbound provider: ${provider}`,
  };
};
