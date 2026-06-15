import { describe, expect, it } from "vitest";
import {
  formatSigningSecretForDisplay,
  generateWebhookSecret,
  parseSigningSecret,
} from "../lib/secrets";

describe("webhook secrets", () => {
  it("returns a high-entropy base64 secret", () => {
    const secret = generateWebhookSecret();

    expect(secret.length).toBeGreaterThanOrEqual(32);
    expect(secret).not.toBe(generateWebhookSecret());
  });

  it("formats secrets for display with whsec_ prefix", () => {
    const stored = generateWebhookSecret();
    const display = formatSigningSecretForDisplay(stored);

    expect(display).toMatch(/^whsec_/);
    expect(parseSigningSecret(display)).toEqual(parseSigningSecret(stored));
  });
});
