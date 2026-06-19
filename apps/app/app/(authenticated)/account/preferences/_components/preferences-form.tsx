"use client";

import type {
  AccountSettingsPreferencesData,
} from "@repo/design-system";
import { AccountSettingsPreferences } from "@repo/design-system";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { savePreferences } from "@/app/actions/account/settings";

export function PreferencesForm({
  preferences,
}: {
  readonly preferences: AccountSettingsPreferencesData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSave(data: AccountSettingsPreferencesData) {
    startTransition(async () => {
      const result = await savePreferences({
        emailNotifications: data.emailNotifications,
        inAppNotifications: data.inAppNotifications,
        theme: data.theme,
      });

      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <AccountSettingsPreferences
      isSaving={isPending}
      onSave={handleSave}
      preferences={preferences}
    />
  );
}
