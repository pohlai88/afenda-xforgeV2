import { describe, expect, it } from "vitest";
import { formatSigningSecretForDisplay, generateWebhookSecret } from "../lib/secrets";
import { signStandardWebhook } from "../lib/signing";
import { verifyStandardWebhook } from "../lib/verify";

describe("verifyStandardWebhook", () => {
  const storedSecret = generateWebhookSecret();
  const displaySecret = formatSigningSecretForDisplay(storedSecret);
  const body = JSON.stringify({
    type: "cms.document.published",
    timestamp: "2026-06-15T08:00:00.000Z",
    organizationId: "org_test",
    data: { collection: "blog", locale: "en", slug: "post", title: "Post" },
  });
  const id = "evt_test123";
  const timestamp = Math.floor(Date.now() / 1000).toString();

  it("accepts a valid signature", () => {
    const signature = signStandardWebhook(storedSecret, {
      id,
      timestamp,
      body,
    });

    const result = verifyStandardWebhook({
      secret: displaySecret,
      rawBody: body,
      headers: {
        "webhook-id": id,
        "webhook-timestamp": timestamp,
        "webhook-signature": signature,
      },
      toleranceSeconds: 300,
    });

    expect(result).toEqual({
      ok: true,
      id,
      timestamp: Number(timestamp),
    });
  });

  it("rejects a wrong secret", () => {
    const signature = signStandardWebhook(storedSecret, {
      id,
      timestamp,
      body,
    });

    const result = verifyStandardWebhook({
      secret: formatSigningSecretForDisplay(generateWebhookSecret()),
      rawBody: body,
      headers: {
        "webhook-id": id,
        "webhook-timestamp": timestamp,
        "webhook-signature": signature,
      },
      toleranceSeconds: 300,
    });

    expect(result).toEqual({ ok: false, error: "Invalid signature" });
  });

  it("rejects a stale timestamp", () => {
    const staleTimestamp = "1710000000";
    const signature = signStandardWebhook(storedSecret, {
      id,
      timestamp: staleTimestamp,
      body,
    });

    const result = verifyStandardWebhook({
      secret: displaySecret,
      rawBody: body,
      headers: {
        "webhook-id": id,
        "webhook-timestamp": staleTimestamp,
        "webhook-signature": signature,
      },
      toleranceSeconds: 1,
    });

    expect(result).toEqual({ ok: false, error: "Timestamp outside tolerance" });
  });

  it("rejects a tampered body", () => {
    const signature = signStandardWebhook(storedSecret, {
      id,
      timestamp,
      body,
    });

    const result = verifyStandardWebhook({
      secret: displaySecret,
      rawBody: `${body} `,
      headers: {
        "webhook-id": id,
        "webhook-timestamp": timestamp,
        "webhook-signature": signature,
      },
      toleranceSeconds: 300,
    });

    expect(result).toEqual({ ok: false, error: "Invalid signature" });
  });

  it("rejects an invalid signing secret", () => {
    const result = verifyStandardWebhook({
      secret: "whsec_",
      rawBody: body,
      headers: {
        "webhook-id": id,
        "webhook-timestamp": timestamp,
        "webhook-signature": "v1,abc",
      },
      toleranceSeconds: 300,
    });

    expect(result).toEqual({
      ok: false,
      error: "Invalid webhook signing secret",
    });
  });

  it("normalizes mixed-case header names", () => {
    const signature = signStandardWebhook(storedSecret, {
      id,
      timestamp,
      body,
    });

    const result = verifyStandardWebhook({
      secret: displaySecret,
      rawBody: body,
      headers: new Headers({
        "Webhook-Id": id,
        "Webhook-Timestamp": timestamp,
        "Webhook-Signature": signature,
      }),
      toleranceSeconds: 300,
    });

    expect(result.ok).toBe(true);
  });

  it("accepts dual signatures during rotation", () => {
    const previousSecret = generateWebhookSecret();
    const currentSignature = signStandardWebhook(storedSecret, {
      id,
      timestamp,
      body,
    });
    const previousSignature = signStandardWebhook(previousSecret, {
      id,
      timestamp,
      body,
    });

    const result = verifyStandardWebhook({
      secret: formatSigningSecretForDisplay(previousSecret),
      rawBody: body,
      headers: {
        "webhook-id": id,
        "webhook-timestamp": timestamp,
        "webhook-signature": `${currentSignature} ${previousSignature}`,
      },
      toleranceSeconds: 300,
    });

    expect(result.ok).toBe(true);
  });
});
