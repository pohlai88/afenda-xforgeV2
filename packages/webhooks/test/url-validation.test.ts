import { describe, expect, it } from "vitest";
import { validateWebhookUrl } from "../lib/url-validation";

describe("validateWebhookUrl", () => {
  it("accepts public https URLs", () => {
    const url = validateWebhookUrl("https://example.com/webhooks");

    expect(url.hostname).toBe("example.com");
  });

  it("rejects localhost targets", () => {
    expect(() => validateWebhookUrl("https://localhost/hook")).toThrow(
      "private networks"
    );
  });

  it("rejects private IPv4 targets", () => {
    expect(() => validateWebhookUrl("https://192.168.1.1/hook")).toThrow(
      "private networks"
    );
  });
});
