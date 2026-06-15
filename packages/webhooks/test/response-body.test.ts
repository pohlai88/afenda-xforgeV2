import { describe, expect, it } from "vitest";
import { WEBHOOK_RESPONSE_BODY_MAX_LENGTH } from "../lib/constants";
import { truncateResponseBody } from "../lib/response-body";

describe("truncateResponseBody", () => {
  it("truncates long subscriber response bodies", () => {
    const longBody = "x".repeat(WEBHOOK_RESPONSE_BODY_MAX_LENGTH + 10);

    expect(truncateResponseBody(longBody).length).toBe(
      WEBHOOK_RESPONSE_BODY_MAX_LENGTH
    );
  });

  it("returns short bodies unchanged", () => {
    expect(truncateResponseBody("ok")).toBe("ok");
  });
});
