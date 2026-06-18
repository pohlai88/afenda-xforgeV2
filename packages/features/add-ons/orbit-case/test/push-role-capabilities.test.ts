import { describe, expect, it } from "vitest";
import { ORBIT_PUSH_CAPABILITIES } from "../contract/push.schema";
import {
  ORBIT_PUSH_ROLE_CAPABILITIES,
  orbitPushCapabilitiesJsonForRole,
} from "../contract/push-role-capabilities";

describe("ORBIT_PUSH_ROLE_CAPABILITIES", () => {
  it("matches owner capabilities to ORBIT_PUSH_CAPABILITIES", () => {
    expect([...ORBIT_PUSH_ROLE_CAPABILITIES.owner]).toEqual([
      ...ORBIT_PUSH_CAPABILITIES,
    ]);
  });

  it("serializes owner JWT claims aligned with migration 0028", () => {
    expect(orbitPushCapabilitiesJsonForRole("owner")).toBe(
      '["meeting","task","approval","budget","purchase","investigation","complaint","lead","risk","project","capa","contract-review"]'
    );
  });

  it("serializes editor and member JWT claims aligned with migration 0028", () => {
    expect(orbitPushCapabilitiesJsonForRole("editor")).toBe(
      '["budget","meeting","approval","task"]'
    );
    expect(orbitPushCapabilitiesJsonForRole("member")).toBe(
      '["meeting","task"]'
    );
  });
});
