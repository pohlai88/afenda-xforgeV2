import "server-only";

import { createClient, currentUser } from "@repo/auth/server";
import type { UpdatePreferencesInput } from "../../contract/account-settings.schema";
import type {
  AccountSettingsTheme,
  UserPreferencesRecord,
} from "../../contract/account-settings.types";

type AuthUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

const DEFAULT_PREFERENCES: Omit<UserPreferencesRecord, "userId" | "updatedAt"> =
  {
    emailNotifications: true,
    inAppNotifications: true,
    theme: "system",
  };

const readTheme = (value: unknown): AccountSettingsTheme => {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return DEFAULT_PREFERENCES.theme;
};

const toPreferencesRecord = (user: AuthUser): UserPreferencesRecord => {
  const metadata = user.user_metadata;
  const preferences =
    typeof metadata.account_settings === "object" &&
    metadata.account_settings !== null
      ? (metadata.account_settings as Record<string, unknown>)
      : {};

  return {
    userId: user.id,
    emailNotifications:
      typeof preferences.emailNotifications === "boolean"
        ? preferences.emailNotifications
        : DEFAULT_PREFERENCES.emailNotifications,
    inAppNotifications:
      typeof preferences.inAppNotifications === "boolean"
        ? preferences.inAppNotifications
        : DEFAULT_PREFERENCES.inAppNotifications,
    theme: readTheme(preferences.theme),
    updatedAt: user.updated_at ? new Date(user.updated_at) : new Date(),
  };
};

export const readUserPreferences = async (
  userId: string
): Promise<UserPreferencesRecord | null> => {
  const user = await currentUser();

  if (!user || user.id !== userId) {
    return null;
  }

  return toPreferencesRecord(user);
};

export const updateUserPreferences = async (
  userId: string,
  input: UpdatePreferencesInput
): Promise<UserPreferencesRecord> => {
  const user = await currentUser();

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized preferences update");
  }

  const current = toPreferencesRecord(user);
  const nextPreferences = {
    emailNotifications:
      input.emailNotifications ?? current.emailNotifications,
    inAppNotifications:
      input.inAppNotifications ?? current.inAppNotifications,
    theme: input.theme ?? current.theme,
  };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      account_settings: nextPreferences,
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Failed to update preferences");
  }

  return toPreferencesRecord(data.user);
};
