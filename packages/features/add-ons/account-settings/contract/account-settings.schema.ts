import { z } from "zod";

export const accountSettingsThemeSchema = z.enum(["light", "dark", "system"]);

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  avatarUrl: z.string().url().nullable().optional(),
});

export const updatePreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  inAppNotifications: z.boolean().optional(),
  theme: accountSettingsThemeSchema.optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>;
