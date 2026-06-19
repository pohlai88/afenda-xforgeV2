import "server-only";

import { createClient, currentUser } from "@repo/auth/server";
import type { UpdateProfileInput } from "../../contract/account-settings.schema";
import type { UserProfileRecord } from "../../contract/account-settings.types";

type AuthUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

const readDisplayName = (user: AuthUser): string => {
  const metadata = user.user_metadata;

  if (typeof metadata.display_name === "string" && metadata.display_name.trim()) {
    return metadata.display_name.trim();
  }

  if (typeof metadata.full_name === "string" && metadata.full_name.trim()) {
    return metadata.full_name.trim();
  }

  return user.email?.split("@")[0] ?? "User";
};

const readAvatarUrl = (user: AuthUser): string | null => {
  const metadata = user.user_metadata;

  if (typeof metadata.avatar_url === "string" && metadata.avatar_url.trim()) {
    return metadata.avatar_url.trim();
  }

  return null;
};

const toProfileRecord = (user: AuthUser): UserProfileRecord => ({
  id: user.id,
  userId: user.id,
  displayName: readDisplayName(user),
  email: user.email ?? "",
  avatarUrl: readAvatarUrl(user),
  updatedAt: user.updated_at ? new Date(user.updated_at) : new Date(),
});

export const readUserProfile = async (
  userId: string
): Promise<UserProfileRecord | null> => {
  const user = await currentUser();

  if (!user || user.id !== userId) {
    return null;
  }

  return toProfileRecord(user);
};

export const updateUserProfile = async (
  userId: string,
  input: UpdateProfileInput
): Promise<UserProfileRecord> => {
  const user = await currentUser();

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized profile update");
  }

  const supabase = await createClient();
  const metadata = {
    ...user.user_metadata,
    display_name: input.displayName,
    ...(input.avatarUrl !== undefined ? { avatar_url: input.avatarUrl } : {}),
  };

  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Failed to update profile");
  }

  return toProfileRecord(data.user);
};
