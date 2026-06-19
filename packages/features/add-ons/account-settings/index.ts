/** Client-safe barrel — DTOs, schemas, serializers. Server records: `@repo/account-settings/server`. */
export {
  accountSettingsThemeSchema,
  changePasswordSchema,
  revokeSessionSchema,
  updatePreferencesSchema,
  updateProfileSchema,
} from "./contract/account-settings.schema";
export type {
  ChangePasswordInput,
  RevokeSessionInput,
  UpdatePreferencesInput,
  UpdateProfileInput,
} from "./contract/account-settings.schema";
export type {
  AccountSettingsTheme,
  ActiveSessionDto,
  UserPreferencesDto,
  UserProfileDto,
} from "./contract/account-settings.types";
export {
  toActiveSessionDto,
  toUserPreferencesDto,
  toUserProfileDto,
} from "./contract/serialize";
export {
  ACCOUNT_SETTINGS_CACHE_TAG_ALL,
  accountSettingsPreferencesTag,
  accountSettingsProfileTag,
  getAccountSettingsCacheTags,
} from "./revalidate";
export type { AccountSettingsCacheTagInput } from "./revalidate";
