"use server";

import { withAuth } from "@repo/auth/guards";
import type { AuthActionResult } from "@repo/auth/types";
import type {
  UpdatePreferencesInput,
  UpdateProfileInput,
} from "@repo/account-settings";
import {
  updateProfileSchema,
  updatePreferencesSchema,
} from "@repo/account-settings";
import {
  readUserProfile,
  readUserPreferences,
  updateUserProfile,
  updateUserPreferences,
  listActiveSessions,
  revokeSession,
} from "@repo/account-settings/server";
import type {
  UserProfileRecord,
  UserPreferencesRecord,
  ActiveSessionRecord,
} from "@repo/account-settings/server";
import { revalidateTag } from "next/cache";
import {
  accountSettingsProfileTag,
  accountSettingsPreferencesTag,
} from "@repo/account-settings/revalidate";

export const getProfile = async (): Promise<
  AuthActionResult<UserProfileRecord | null>
> =>
  withAuth(({ userId }) => readUserProfile(userId));

export const saveProfile = async (
  input: UpdateProfileInput
): Promise<AuthActionResult<UserProfileRecord>> =>
  withAuth(async ({ userId }) => {
    const parsed = updateProfileSchema.parse(input);
    const record = await updateUserProfile(userId, parsed);
    revalidateTag(accountSettingsProfileTag(userId), "max");
    return record;
  });

export const getPreferences = async (): Promise<
  AuthActionResult<UserPreferencesRecord | null>
> =>
  withAuth(({ userId }) => readUserPreferences(userId));

export const savePreferences = async (
  input: UpdatePreferencesInput
): Promise<AuthActionResult<UserPreferencesRecord>> =>
  withAuth(async ({ userId }) => {
    const parsed = updatePreferencesSchema.parse(input);
    const record = await updateUserPreferences(userId, parsed);
    revalidateTag(accountSettingsPreferencesTag(userId), "max");
    return record;
  });

export const getSessions = async (): Promise<
  AuthActionResult<readonly ActiveSessionRecord[]>
> =>
  withAuth(({ userId }) => listActiveSessions(userId));

export const revokeActiveSession = async (
  sessionId: string
): Promise<AuthActionResult<boolean>> =>
  withAuth(({ userId }) => revokeSession(userId, sessionId));
