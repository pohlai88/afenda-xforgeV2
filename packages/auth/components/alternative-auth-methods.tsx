"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import { useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { isPasskeyOriginSupported } from "../auth-ui-settings";
import { createClient } from "../client";
import { completeAuthenticatedNavigation } from "../client-navigation";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { buildAuthCallbackRedirect } from "../redirects";
import { setPreferredSignInMethod } from "../sign-in-preference";
import { AuthDivider } from "./auth-divider";
import { PasskeyOriginNotice } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { GoogleIcon, PasskeyIcon } from "./auth-icons";

type AlternativeAuthMethodsProperties = {
  mode: "sign-in" | "sign-up";
  onError?: (message: string | null) => void;
};

export const AlternativeAuthMethods = ({
  mode,
  onError,
}: AlternativeAuthMethodsProperties) => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "passkey" | null
  >(null);

  const showGoogle = settings.google;
  const showPasskey = settings.passkey.enabled;
  const passkeyOriginSupported = isPasskeyOriginSupported(settings.passkey);
  const showDivider = (showGoogle || showPasskey) && settings.email;

  if (!(showGoogle || showPasskey)) {
    return null;
  }

  const googleLabel =
    mode === "sign-up" ? "Sign up with Google" : "Continue with Google";
  const passkeyLabel =
    mode === "sign-up" ? "Sign up with passkey" : "Continue with passkey";

  const handleGoogle = async () => {
    setLoadingProvider("google");
    onError?.(null);
    setPreferredSignInMethod("google");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildAuthCallbackRedirect("/"),
      },
    });

    const failure = fromSupabaseError(error);

    if (failure) {
      onError?.(failure.error);
      setLoadingProvider(null);
    }
  };

  const handlePasskey = async () => {
    setLoadingProvider("passkey");
    onError?.(null);

    const { error } = await supabase.auth.signInWithPasskey();

    const failure = fromSupabaseError(error);

    if (failure) {
      onError?.(failure.error);
      setLoadingProvider(null);
      return;
    }

    await completeAuthenticatedNavigation("/");
  };

  return (
    <div className="flex flex-col gap-3">
      {showGoogle ? (
        <AuthPendingButton
          className="w-full"
          disabled={loadingProvider !== null && loadingProvider !== "google"}
          leading={<GoogleIcon className="size-4" />}
          onClick={handleGoogle}
          pending={loadingProvider === "google"}
          pendingLabel="Connecting…"
          type="button"
          variant="secondary"
        >
          {googleLabel}
        </AuthPendingButton>
      ) : null}
      {showPasskey ? (
        <div className="flex flex-col gap-1.5">
          <AuthPendingButton
            className="w-full"
            disabled={
              (loadingProvider !== null && loadingProvider !== "passkey") ||
              !passkeyOriginSupported
            }
            leading={<PasskeyIcon className="size-4" />}
            onClick={handlePasskey}
            pending={loadingProvider === "passkey"}
            pendingLabel="Waiting for passkey…"
            type="button"
            variant="secondary"
          >
            {passkeyLabel}
          </AuthPendingButton>
          {passkeyOriginSupported ? null : (
            <PasskeyOriginNotice rpOrigins={settings.passkey.rpOrigins} />
          )}
        </div>
      ) : null}
      {showDivider ? <AuthDivider /> : null}
    </div>
  );
};

type SignUpDisabledNoticeProperties = {
  className?: string;
};

export const SignUpDisabledNotice = ({
  className,
}: SignUpDisabledNoticeProperties) => {
  const { settings } = useAuthUiConfig();

  if (!settings.disableSignup) {
    return null;
  }

  return (
    <p className={cn("text-text-secondary", recipe("captionText"), className)}>
      New account registration is currently closed. Contact your administrator
      for access.
    </p>
  );
};
