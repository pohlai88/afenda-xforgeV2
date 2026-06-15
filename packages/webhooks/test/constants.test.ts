import { describe, expect, it } from "vitest";
import {
  DEFAULT_WEBHOOK_SIGNATURE_TOLERANCE_SEC,
  WEBHOOK_RESPONSE_BODY_MAX_LENGTH,
  WEBHOOK_SECRET_ROTATION_GRACE_MS,
} from "../lib/constants";

describe("webhook constants", () => {
  it("exports stable operational defaults", () => {
    expect(DEFAULT_WEBHOOK_SIGNATURE_TOLERANCE_SEC).toBe(300);
    expect(WEBHOOK_SECRET_ROTATION_GRACE_MS).toBe(24 * 60 * 60 * 1000);
    expect(WEBHOOK_RESPONSE_BODY_MAX_LENGTH).toBe(1024);
  });
});
