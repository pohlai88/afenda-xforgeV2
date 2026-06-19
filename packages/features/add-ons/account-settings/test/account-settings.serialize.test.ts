import { describe, expect, it } from "vitest";
import type {
  ActiveSessionRecord,
  UserPreferencesRecord,
  UserProfileRecord,
} from "../contract/account-settings.types";
import {
  toActiveSessionDto,
  toUserPreferencesDto,
  toUserProfileDto,
} from "../contract/serialize";

describe("toUserProfileDto", () => {
  it("serializes updatedAt to ISO string", () => {
    const record: UserProfileRecord = {
      id: "user_1",
      userId: "user_1",
      displayName: "Jane Doe",
      email: "jane@example.com",
      avatarUrl: null,
      updatedAt: new Date("2026-06-19T12:00:00.000Z"),
    };

    expect(toUserProfileDto(record)).toEqual({
      id: "user_1",
      userId: "user_1",
      displayName: "Jane Doe",
      email: "jane@example.com",
      avatarUrl: null,
      updatedAt: "2026-06-19T12:00:00.000Z",
    });
  });
});

describe("toUserPreferencesDto", () => {
  it("preserves preference flags", () => {
    const record: UserPreferencesRecord = {
      userId: "user_1",
      emailNotifications: false,
      inAppNotifications: true,
      theme: "light",
      updatedAt: new Date("2026-06-19T12:00:00.000Z"),
    };

    expect(toUserPreferencesDto(record).emailNotifications).toBe(false);
    expect(toUserPreferencesDto(record).theme).toBe("light");
  });
});

describe("toActiveSessionDto", () => {
  it("serializes session timestamps", () => {
    const record: ActiveSessionRecord = {
      id: "session_1",
      userId: "user_1",
      createdAt: new Date("2026-06-19T10:00:00.000Z"),
      updatedAt: new Date("2026-06-19T11:00:00.000Z"),
      ip: "127.0.0.1",
      userAgent: "TestAgent",
      isCurrent: true,
    };

    expect(toActiveSessionDto(record).createdAt).toBe(
      "2026-06-19T10:00:00.000Z"
    );
  });
});
