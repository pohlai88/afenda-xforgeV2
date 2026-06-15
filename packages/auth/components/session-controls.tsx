"use client";

import {
  Alert,
  AlertDescription,
  Button,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import {
  formatJwtLifetime,
  formatSessionHours,
} from "../auth-ui-settings";

export const SessionControls = () => {
  const { settings } = useAuthUiConfig();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<"local" | "global" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { sessions } = settings;

  const handleSignOut = async (scope: "local" | "global") => {
    setLoading(scope);
    setError(null);
    setMessage(null);

    const { error: signOutError } = await supabase.auth.signOut({ scope });

    const failure = fromSupabaseError(signOutError);

    if (failure) {
      setError(failure.error);
      setLoading(null);
      return;
    }

    setMessage(
      scope === "global"
        ? "Signed out on all devices."
        : "Signed out on this device."
    );
    setLoading(null);
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <section className={cn("flex flex-col", recipe("sectionGap"))}>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-text-primary">Session policy</h2>
        <p className={recipe("captionText")}>
          Enforced by Supabase Auth on sign-in and token refresh. This app uses
          PKCE with cookie-backed sessions via{" "}
          <code className="text-xs">@supabase/ssr</code>.
        </p>
      </div>
      <dl className="rounded-[var(--xforge-radius-md)] border border-border-default px-4">
        <div className="flex flex-col gap-0.5 border-border-default border-b py-3">
          <dt className={recipe("captionText")}>Access token (JWT) lifetime</dt>
          <dd className={recipe("bodyMediumText")}>
            {formatJwtLifetime(sessions.jwtExpSeconds)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 border-border-default border-b py-3">
          <dt className={recipe("captionText")}>Session time-box</dt>
          <dd className={recipe("bodyMediumText")}>
            {formatSessionHours(sessions.timeboxHours)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 border-border-default border-b py-3">
          <dt className={recipe("captionText")}>Inactivity timeout</dt>
          <dd className={recipe("bodyMediumText")}>
            {formatSessionHours(sessions.inactivityTimeoutHours)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 border-border-default border-b py-3">
          <dt className={recipe("captionText")}>Single session per user</dt>
          <dd className={recipe("bodyMediumText")}>
            {sessions.singlePerUser ? "Enabled" : "Disabled"}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 border-border-default border-b py-3">
          <dt className={recipe("captionText")}>Refresh token rotation</dt>
          <dd className={recipe("bodyMediumText")}>
            {sessions.refreshTokenRotationEnabled
              ? `Enabled (${sessions.refreshTokenReuseIntervalSeconds}s reuse window for SSR)`
              : "Disabled"}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 py-3">
          <dt className={recipe("captionText")}>Flow</dt>
          <dd className={recipe("bodyMediumText")}>PKCE (recommended for Next.js)</dd>
        </div>
      </dl>
      {error ? (
        <Alert tone="critical">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {message ? (
        <Alert tone="positive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={loading !== null}
          onClick={() => handleSignOut("local")}
          type="button"
          variant="secondary"
        >
          {loading === "local" ? "Signing out…" : "Sign out this device"}
        </Button>
        <Button
          disabled={loading !== null}
          onClick={() => handleSignOut("global")}
          type="button"
          variant="quiet"
        >
          {loading === "global" ? "Signing out…" : "Sign out all devices"}
        </Button>
      </div>
    </section>
  );
};
