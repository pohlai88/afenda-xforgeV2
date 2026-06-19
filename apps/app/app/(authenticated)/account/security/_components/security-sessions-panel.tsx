"use client";

import type { ActiveSessionInfo } from "@repo/design-system";
import { AccountSettingsSecurity } from "@repo/design-system";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { revokeActiveSession } from "@/app/actions/account/settings";

export function SecuritySessionsPanel({
  sessions,
}: {
  readonly sessions: readonly ActiveSessionInfo[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRevokeSession(sessionId: string) {
    startTransition(async () => {
      const result = await revokeActiveSession(sessionId);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <AccountSettingsSecurity
      isSaving={isPending}
      onRevokeSession={handleRevokeSession}
      sessions={sessions}
    />
  );
}
