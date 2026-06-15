"use client";

import { recipe } from "@repo/design-system/design-system";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { formatJwtLifetime, formatSessionHours } from "../auth-ui-settings";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { AuthErrorAlert, AuthSuccessAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import {
  AuthConfigList,
  AuthConfigRow,
  AuthSection,
  AuthSectionHeader,
} from "./auth-section";

const SIGN_OUT_REDIRECT_MS = 1200;

export const SessionControls = () => {
  const { settings } = useAuthUiConfig();
  const router = useRouter();
  const supabase = createClient();
  const titleId = useId();
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState<"local" | "global" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { sessions } = settings;

  useEffect(
    () => () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    },
    []
  );

  const handleSignOut = async (scope: "local" | "global") => {
    setLoading(scope);
    setError(null);
    setMessage(null);

    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

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

    redirectTimeoutRef.current = setTimeout(() => {
      router.push("/sign-in");
      router.refresh();
    }, SIGN_OUT_REDIRECT_MS);
  };

  return (
    <AuthSection aria-labelledby={titleId}>
      <AuthSectionHeader
        description={
          <>
            Enforced by Supabase Auth on sign-in and token refresh. This app
            uses PKCE with cookie-backed sessions via{" "}
            <code className="text-xs">@supabase/ssr</code>.
          </>
        }
        title="Session policy"
        titleId={titleId}
      />
      <AuthConfigList>
        <AuthConfigRow
          label="Access token (JWT) lifetime"
          value={formatJwtLifetime(sessions.jwtExpSeconds)}
        />
        <AuthConfigRow
          label="Session time-box"
          value={formatSessionHours(sessions.timeboxHours)}
        />
        <AuthConfigRow
          label="Inactivity timeout"
          value={formatSessionHours(sessions.inactivityTimeoutHours)}
        />
        <AuthConfigRow
          label="Single session per user"
          value={sessions.singlePerUser ? "Enabled" : "Disabled"}
        />
        <AuthConfigRow
          label="Refresh token rotation"
          value={
            sessions.refreshTokenRotationEnabled
              ? `Enabled (${sessions.refreshTokenReuseIntervalSeconds}s reuse window for SSR)`
              : "Disabled"
          }
        />
        <AuthConfigRow label="Flow" value="PKCE (recommended for Next.js)" />
      </AuthConfigList>
      {error ? <AuthErrorAlert message={error} /> : null}
      {message ? <AuthSuccessAlert message={message} /> : null}
      <div className="flex flex-wrap gap-2">
        <AuthPendingButton
          disabled={loading !== null && loading !== "local"}
          onClick={() => void handleSignOut("local")}
          pending={loading === "local"}
          pendingLabel="Signing out…"
          type="button"
          variant="secondary"
        >
          Sign out this device
        </AuthPendingButton>
        <AuthPendingButton
          disabled={loading !== null && loading !== "global"}
          onClick={() => void handleSignOut("global")}
          pending={loading === "global"}
          pendingLabel="Signing out…"
          type="button"
          variant="quiet"
        >
          Sign out all devices
        </AuthPendingButton>
      </div>
    </AuthSection>
  );
};
