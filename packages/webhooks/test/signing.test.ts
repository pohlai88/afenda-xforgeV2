import { describe, expect, it } from "vitest";
import { generateWebhookSecret } from "../lib/secrets";
import {
  buildSignedContent,
  signStandardWebhook,
  signStandardWebhookHeader,
} from "../lib/signing";

describe("signStandardWebhook", () => {
  const secret = generateWebhookSecret();
  const id = "evt_abc";
  const timestamp = "1710000000";
  const body = '{"type":"cms.document.published"}';

  it("returns a stable v1 base64 signature", () => {
    const signature = signStandardWebhook(secret, { id, timestamp, body });

    expect(signature).toMatch(/^v1,[A-Za-z0-9+/]+=*$/);
    expect(signature).toBe(
      signStandardWebhook(secret, { id, timestamp, body })
    );
  });

  it("signs id.timestamp.body content", () => {
    const signedContent = buildSignedContent(id, timestamp, body);
    expect(signedContent).toBe(`${id}.${timestamp}.${body}`);
  });

  it("joins multiple secrets for rotation", () => {
    const otherSecret = generateWebhookSecret();
    const header = signStandardWebhookHeader([secret, otherSecret], {
      id,
      timestamp,
      body,
    });

    expect(header.split(" ")).toHaveLength(2);
    expect(header).toContain("v1,");
  });
});
