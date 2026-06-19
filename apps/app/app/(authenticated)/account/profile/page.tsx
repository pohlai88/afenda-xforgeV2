import { currentUser } from "@repo/auth/server";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/account/settings";
import { ProfileForm } from "./_components/profile-form";

export const metadata: Metadata = createMetadata({
  title: "Profile",
  description: "Update your display name and avatar.",
});

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const result = await getProfile();

  const profile =
    result.ok && result.data
      ? result.data
      : {
          displayName: user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "User",
          email: user.email ?? "",
          avatarUrl: (user.user_metadata?.avatar_url as string | null) ?? null,
        };

  return (
    <ProfileForm
      profile={{
        displayName: profile.displayName,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
      }}
    />
  );
}
