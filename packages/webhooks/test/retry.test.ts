import { describe, expect, it } from "vitest";
import {
  classifyHttpFailure,
  getNextAttemptAt,
  MAX_CLIENT_ERROR_ATTEMPTS,
  MAX_TRANSIENT_ATTEMPTS,
} from "../lib/outbound/retry";

describe("classifyHttpFailure", () => {
  it("treats 5xx as transient", () => {
    expect(classifyHttpFailure(500)).toBe("transient");
    expect(classifyHttpFailure(503)).toBe("transient");
  });

  it("treats 4xx as client errors", () => {
    expect(classifyHttpFailure(400)).toBe("client");
    expect(classifyHttpFailure(404)).toBe("client");
  });

  it("treats network failures as transient", () => {
    expect(classifyHttpFailure(null)).toBe("transient");
  });
});

describe("getNextAttemptAt", () => {
  it("returns null after max transient attempts", () => {
    expect(getNextAttemptAt(MAX_TRANSIENT_ATTEMPTS, "transient")).toBeNull();
  });

  it("returns null after max client error attempts", () => {
    expect(getNextAttemptAt(MAX_CLIENT_ERROR_ATTEMPTS, "client")).toBeNull();
  });

  it("schedules a future retry before max transient attempts", () => {
    const next = getNextAttemptAt(1, "transient");

    expect(next).not.toBeNull();
    expect(next!.getTime()).toBeGreaterThan(Date.now());
  });

  it("schedules client-error retries with a short delay", () => {
    const next = getNextAttemptAt(0, "client");

    expect(next).not.toBeNull();
    expect(next!.getTime()).toBeGreaterThan(Date.now());
    expect(next!.getTime()).toBeLessThan(Date.now() + 2 * 60_000);
  });
});
