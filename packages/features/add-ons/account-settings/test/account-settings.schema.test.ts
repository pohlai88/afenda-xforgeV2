import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  updatePreferencesSchema,
  updateProfileSchema,
} from "../contract/account-settings.schema";

describe("updateProfileSchema", () => {
  it("accepts valid profile input", () => {
    const parsed = updateProfileSchema.parse({
      displayName: "Jane Doe",
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(parsed.displayName).toBe("Jane Doe");
    expect(parsed.avatarUrl).toBe("https://example.com/avatar.png");
  });

  it("rejects empty display name", () => {
    expect(() =>
      updateProfileSchema.parse({ displayName: "   " })
    ).toThrow();
  });
});

describe("updatePreferencesSchema", () => {
  it("accepts partial preferences", () => {
    const parsed = updatePreferencesSchema.parse({
      theme: "dark",
    });

    expect(parsed.theme).toBe("dark");
  });

  it("rejects invalid theme", () => {
    expect(() =>
      updatePreferencesSchema.parse({ theme: "neon" })
    ).toThrow();
  });
});

describe("changePasswordSchema", () => {
  it("requires minimum new password length", () => {
    expect(() =>
      changePasswordSchema.parse({
        currentPassword: "old-password",
        newPassword: "short",
      })
    ).toThrow();
  });
});
