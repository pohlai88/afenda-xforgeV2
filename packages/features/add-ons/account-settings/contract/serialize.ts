import type {
  ActiveSessionDto,
  ActiveSessionRecord,
  UserPreferencesDto,
  UserPreferencesRecord,
  UserProfileDto,
  UserProfileRecord,
} from "./account-settings.types";

export const toUserProfileDto = (record: UserProfileRecord): UserProfileDto => ({
  id: record.id,
  userId: record.userId,
  displayName: record.displayName,
  email: record.email,
  avatarUrl: record.avatarUrl,
  updatedAt: record.updatedAt.toISOString(),
});

export const toUserPreferencesDto = (
  record: UserPreferencesRecord
): UserPreferencesDto => ({
  userId: record.userId,
  emailNotifications: record.emailNotifications,
  inAppNotifications: record.inAppNotifications,
  theme: record.theme,
  updatedAt: record.updatedAt.toISOString(),
});

export const toActiveSessionDto = (
  record: ActiveSessionRecord
): ActiveSessionDto => ({
  id: record.id,
  userId: record.userId,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  ip: record.ip,
  userAgent: record.userAgent,
  isCurrent: record.isCurrent,
});
