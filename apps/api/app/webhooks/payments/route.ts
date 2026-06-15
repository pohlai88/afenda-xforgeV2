import { analytics } from "@repo/analytics/server";
import {
  ApiError,
  apiError,
  apiOk,
  methodNotAllowed,
  withApiRoute,
} from "@repo/api";
import { stripe } from "@repo/payments";
import { verifyStripeWebhookPayload } from "@repo/payments/stripe-webhooks";
import { handleInboundWebhook } from "@repo/webhooks/inbound";
import { env } from "@/env";
import "@/lib/webhook-handlers";

export const POST = withApiRoute(
  async (request: Request): Promise<Response> => {
    const stripeClient = stripe;

    if (!(stripeClient && env.STRIPE_WEBHOOK_SECRET)) {
      return apiError(
        "not_configured",
        "Stripe webhook is not configured",
        503
      );
    }

    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

    const result = await handleInboundWebhook("stripe", request, {
      stripe: {
        secret: webhookSecret,
        verify: verifyStripeWebhookPayload,
      },
    });

    if (!result.ok) {
      if (
        result.status === 400 &&
        result.error === "Missing stripe-signature header"
      ) {
        throw new ApiError("missing_signature", result.error, 400);
      }

      if (result.status === 400) {
        throw new ApiError("invalid_signature", result.error, 400);
      }

      if (result.status === 503) {
        return apiError("not_configured", result.error, 503);
      }

      return apiError("bad_request", result.error, 400);
    }

    await analytics?.shutdown();

    return apiOk({ received: true, type: result.type });
  }
);

export const GET = (): Response => methodNotAllowed(["POST"]);
