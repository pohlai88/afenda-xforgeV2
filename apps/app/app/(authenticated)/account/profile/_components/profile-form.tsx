"use client";

import type { AccountSettingsProfileData } from "@repo/design-system";
import { AccountSettingsProfile } from "@repo/design-system";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { saveProfile } from "@/app/actions/account/settings";

export function ProfileForm({
  profile,
}: {
  readonly profile: AccountSettingsProfileData;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSave(
    data: Pick<AccountSettingsProfileData, "displayName" | "avatarUrl">
  ) {
    startTransition(async () => {
      const result = await saveProfile({
        displayName: data.displayName,
        avatarUrl: data.avatarUrl ?? undefined,
      });

      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <AccountSettingsProfile
      isSaving={isPending}
      onSave={handleSave}
      profile={profile}
    />
  );
}
