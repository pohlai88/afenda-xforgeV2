import { currentUser } from "@repo/auth/server";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPreferences } from "@/app/actions/account/settings";
import { PreferencesForm } from "./_components/preferences-form";

export const metadata: Metadata = createMetadata({
  title: "Preferences",
  description: "Manage your appearance and notification preferences.",
});

export default async function PreferencesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const result = await getPreferences();

  const preferences =
    result.ok && result.data
      ? result.data
      : {
          emailNotifications: true,
          inAppNotifications: true,
          theme: "system" as const,
        };

  return (
    <PreferencesForm
      preferences={{
        emailNotifications: preferences.emailNotifications,
        inAppNotifications: preferences.inAppNotifications,
        theme: preferences.theme,
      }}
    />
  );
}
