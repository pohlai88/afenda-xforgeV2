import { analytics } from "@repo/analytics/server";
import {
  ApiError,
  apiError,
  apiOk,
  methodNotAllowed,
  withApiRoute,
} from "@repo/api";
import { createAdminClient } from "@repo/auth/server";
import { parseError } from "@repo/observability/error";
import { log } from "@repo/observability/log";
import type { Stripe } from "@repo/payments";
import { stripe } from "@repo/payments";
import { headers } from "next/headers";
import { env } from "@/env";

const getUserFromCustomerId = async (customerId: string) => {
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers();

    return data.users.find(
      (user) => user.user_metadata?.stripeCustomerId === customerId
    );
  } catch {
    return undefined;
  }
};

const handleCheckoutSessionCompleted = async (
  data: Stripe.Checkout.Session
) => {
  if (!data.customer) {
    return;
  }

  const customerId =
    typeof data.customer === "string" ? data.customer : data.customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics?.capture({
    event: "User Subscribed",
    distinctId: user.id,
  });
};

const handleSubscriptionScheduleCanceled = async (
  data: Stripe.SubscriptionSchedule
) => {
  if (!data.customer) {
    return;
  }

  const customerId =
    typeof data.customer === "string" ? data.customer : data.customer.id;
  const user = await getUserFromCustomerId(customerId);

  if (!user) {
    return;
  }

  analytics?.capture({
    event: "User Unsubscribed",
    distinctId: user.id,
  });
};

export const POST = withApiRoute(
  async (request: Request): Promise<Response> => {
    if (!(stripe && env.STRIPE_WEBHOOK_SECRET)) {
      return apiError(
        "not_configured",
        "Stripe webhook is not configured",
        503
      );
    }

    const body = await request.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    if (!signature) {
      throw new ApiError(
        "missing_signature",
        "Missing stripe-signature header",
        400
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      log.warn(parseError(error));
      throw new ApiError("invalid_signature", "Invalid webhook signature", 400);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      }
      case "subscription_schedule.canceled": {
        await handleSubscriptionScheduleCanceled(event.data.object);
        break;
      }
      default: {
        log.warn(`Unhandled event type ${event.type}`);
      }
    }

    await analytics?.shutdown();

    return apiOk({ received: true, type: event.type });
  }
);

export const GET = (): Response => methodNotAllowed(["POST"]);
