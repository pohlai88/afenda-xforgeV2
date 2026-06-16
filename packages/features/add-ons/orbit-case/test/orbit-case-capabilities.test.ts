import { describe, expect, it } from "vitest";
import { resolveOrbitPushCapabilities } from "../contract/capabilities";

describe("resolveOrbitPushCapabilities", () => {
  it("prefers JWT claim capabilities over role defaults", () => {
    expect(resolveOrbitPushCapabilities("member", ["budget"])).toEqual([
      "budget",
    ]);
  });

  it("falls back to role defaults when claims are empty", () => {
    expect(resolveOrbitPushCapabilities("editor", [])).toEqual([
      "budget",
      "meeting",
      "approval",
      "task",
    ]);
  });

  it("ignores invalid claim values", () => {
    expect(
      resolveOrbitPushCapabilities("member", ["not-a-capability", "meeting"])
    ).toEqual(["meeting"]);
  });
});
