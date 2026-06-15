import { analytics } from "@repo/analytics/server";
import { createAdminClient } from "@repo/auth/server";
import type { Stripe } from "@repo/payments";
import { registerInboundHandler } from "@repo/webhooks/inbound";
import {
  STRIPE_EVENT_CHECKOUT_COMPLETED,
  STRIPE_EVENT_SUBSCRIPTION_SCHEDULE_CANCELED,
} from "@repo/webhooks/registry/events";

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

registerInboundHandler<Stripe.Checkout.Session>(
  "stripe",
  STRIPE_EVENT_CHECKOUT_COMPLETED,
  async (event) => {
    const session = event.data;

    if (!session.customer) {
      return;
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer.id;
    const user = await getUserFromCustomerId(customerId);

    if (!user) {
      return;
    }

    analytics?.capture({
      event: "User Subscribed",
      distinctId: user.id,
    });
  }
);

registerInboundHandler<Stripe.SubscriptionSchedule>(
  "stripe",
  STRIPE_EVENT_SUBSCRIPTION_SCHEDULE_CANCELED,
  async (event) => {
    const schedule = event.data;

    if (!schedule.customer) {
      return;
    }

    const customerId =
      typeof schedule.customer === "string"
        ? schedule.customer
        : schedule.customer.id;
    const user = await getUserFromCustomerId(customerId);

    if (!user) {
      return;
    }

    analytics?.capture({
      event: "User Unsubscribed",
      distinctId: user.id,
    });
  }
);
