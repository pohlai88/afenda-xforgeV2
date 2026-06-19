export type AccountSettingsTheme = "light" | "dark" | "system";

export interface UserProfileRecord {
  readonly id: string;
  readonly userId: string;
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string | null;
  readonly updatedAt: Date;
}

export interface UserProfileDto {
  readonly id: string;
  readonly userId: string;
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string | null;
  readonly updatedAt: string;
}

export interface UserPreferencesRecord {
  readonly userId: string;
  readonly emailNotifications: boolean;
  readonly inAppNotifications: boolean;
  readonly theme: AccountSettingsTheme;
  readonly updatedAt: Date;
}

export interface UserPreferencesDto {
  readonly userId: string;
  readonly emailNotifications: boolean;
  readonly inAppNotifications: boolean;
  readonly theme: AccountSettingsTheme;
  readonly updatedAt: string;
}

export interface ActiveSessionRecord {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly ip: string | null;
  readonly userAgent: string | null;
  readonly isCurrent: boolean;
}

export interface ActiveSessionDto {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly ip: string | null;
  readonly userAgent: string | null;
  readonly isCurrent: boolean;
}
