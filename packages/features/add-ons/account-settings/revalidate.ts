export const ACCOUNT_SETTINGS_CACHE_TAG_ALL = "account-settings:all" as const;

export const accountSettingsProfileTag = (userId: string): string =>
  `account-settings:profile:${userId}`;

export const accountSettingsPreferencesTag = (userId: string): string =>
  `account-settings:preferences:${userId}`;

export interface AccountSettingsCacheTagInput {
  userId: string;
}

export const getAccountSettingsCacheTags = (
  input: AccountSettingsCacheTagInput
): readonly string[] => [
  ACCOUNT_SETTINGS_CACHE_TAG_ALL,
  accountSettingsProfileTag(input.userId),
  accountSettingsPreferencesTag(input.userId),
];
