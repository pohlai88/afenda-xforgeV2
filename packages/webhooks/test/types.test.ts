import { describe, expect, it } from "vitest";
import {
  isWebhookDeliveryStatus,
  WEBHOOK_DELIVERY_STATUSES,
  webhookDeliveryStatusSchema,
} from "../types";

describe("webhook delivery status types", () => {
  it("exports delivery statuses aligned with the database enum", () => {
    expect(WEBHOOK_DELIVERY_STATUSES).toEqual([
      "pending",
      "delivered",
      "retrying",
      "failed",
    ]);
  });

  it("narrows valid delivery statuses", () => {
    expect(isWebhookDeliveryStatus("failed")).toBe(true);
    expect(isWebhookDeliveryStatus("bogus")).toBe(false);
    expect(isWebhookDeliveryStatus(null)).toBe(false);
  });

  it("rejects invalid status filter values", () => {
    expect(webhookDeliveryStatusSchema.safeParse("failed").success).toBe(true);
    expect(webhookDeliveryStatusSchema.safeParse("bogus").success).toBe(false);
  });
});
