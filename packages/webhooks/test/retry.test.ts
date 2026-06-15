import { describe, expect, it } from "vitest";
import { getNextAttemptAt, MAX_WEBHOOK_ATTEMPTS } from "../lib/retry";

describe("getNextAttemptAt", () => {
  it("returns null after max attempts", () => {
    expect(getNextAttemptAt(MAX_WEBHOOK_ATTEMPTS)).toBeNull();
  });

  it("schedules a future retry before max attempts", () => {
    const next = getNextAttemptAt(0);

    expect(next).not.toBeNull();
    expect(next!.getTime()).toBeGreaterThan(Date.now());
  });
});
