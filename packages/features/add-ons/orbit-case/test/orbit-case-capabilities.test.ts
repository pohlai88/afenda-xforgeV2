import { describe, expect, it } from "vitest";
import { resolveOrbitPushCapabilities } from "../contract/capabilities";

describe("resolveOrbitPushCapabilities", () => {
  it("prefers JWT claim capabilities within the live role ceiling", () => {
    expect(resolveOrbitPushCapabilities("member", ["meeting"])).toEqual([
      "meeting",
    ]);
  });

  it("falls back to role defaults when JWT grants exceed the role ceiling", () => {
    expect(resolveOrbitPushCapabilities("member", ["budget"])).toEqual([
      "meeting",
      "task",
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

  it("caps stale JWT grants that exceed the live org role ceiling", () => {
    expect(
      resolveOrbitPushCapabilities("member", ["budget", "approval", "meeting"])
    ).toEqual(["meeting"]);
  });

  it("uses valid JWT subset for owner without requiring re-sign-in", () => {
    expect(resolveOrbitPushCapabilities("owner", ["budget", "meeting"])).toEqual(
      ["budget", "meeting"]
    );
  });
});
