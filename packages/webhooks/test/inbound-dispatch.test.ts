import { describe, expect, it, vi } from "vitest";
import {
  clearInboundHandlers,
  handleInboundWebhook,
  registerInboundHandler,
} from "../inbound";
import {
  STRIPE_EVENT_CHECKOUT_COMPLETED,
} from "../lib/registry/events";

describe("handleInboundWebhook", () => {
  it("returns 503 when stripe secret is missing", async () => {
    clearInboundHandlers();

    const result = await handleInboundWebhook(
      "stripe",
      new Request("http://localhost/webhooks/payments", { method: "POST" })
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(503);
    }
  });

  it("dispatches to a registered stripe handler", async () => {
    clearInboundHandlers();
    const handler = vi.fn();

    registerInboundHandler("stripe", STRIPE_EVENT_CHECKOUT_COMPLETED, handler);

    const body = JSON.stringify({ type: "checkout.session.completed" });
    const verify = vi.fn(() => ({
      type: "checkout.session.completed",
      data: { object: { customer: "cus_123" } },
    }));

    const result = await handleInboundWebhook(
      "stripe",
      new Request("http://localhost/webhooks/payments", {
        method: "POST",
        body,
        headers: { "stripe-signature": "sig_test" },
      }),
      {
        stripe: {
          secret: "whsec_test",
          verify,
        },
      }
    );

    expect(result.ok).toBe(true);
    expect(handler).toHaveBeenCalledOnce();
    expect(verify).toHaveBeenCalledWith(body, "sig_test", "whsec_test");
  });
});
