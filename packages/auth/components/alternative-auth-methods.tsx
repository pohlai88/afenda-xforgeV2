"use client";

import {
  Button,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import { useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { isPasskeyOriginSupported } from "../auth-ui-settings";
import { completeAuthNavigation } from "../client-navigation";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { buildAuthCallbackRedirect } from "../oauth-redirect";
import {
  getPreferredSignInMethod,
  setPreferredSignInMethod,
} from "../sign-in-preference";
import { GoogleIcon, PasskeyIcon } from "./auth-icons";
import { AuthDivider } from "./auth-divider";

type AlternativeAuthMethodsProperties = {
  mode: "sign-in" | "sign-up";
  onError?: (message: string) => void;
};

const buildOAuthRedirect = () => buildAuthCallbackRedirect("/");

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

  if (!showGoogle && !showPasskey) {
    return null;
  }

  const handleGoogle = async () => {
    setLoadingProvider("google");
    onError?.("");
    setPreferredSignInMethod("google");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildOAuthRedirect(),
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
    onError?.("");

    const { error } = await supabase.auth.signInWithPasskey();

    const failure = fromSupabaseError(error);

    if (failure) {
      onError?.(failure.error);
      setLoadingProvider(null);
      return;
    }

    completeAuthNavigation("/");
  };

  return (
    <div className="flex flex-col gap-3">
      {showGoogle ? (
        <Button
          className="w-full"
          disabled={loadingProvider !== null}
          onClick={handleGoogle}
          type="button"
          variant="secondary"
        >
          <GoogleIcon className="size-4" />
          {loadingProvider === "google" ? "Connecting…" : "Continue with Google"}
        </Button>
      ) : null}
      {showPasskey ? (
        <div className="flex flex-col gap-1.5">
          <Button
            className="w-full"
            disabled={loadingProvider !== null || !passkeyOriginSupported}
            onClick={handlePasskey}
            type="button"
            variant="secondary"
          >
            <PasskeyIcon className="size-4" />
            {loadingProvider === "passkey"
              ? "Waiting for passkey…"
              : "Continue with passkey"}
          </Button>
          {!passkeyOriginSupported ? (
            <p className={cn("text-text-secondary", recipe("captionText"))}>
              Passkeys are not available on this origin. On localhost against a hosted
              Supabase project, use email or Google sign-in, or test passkeys on a
              preview/production URL (
              {settings.passkey.rpOrigins.join(", ") || "none configured"}).
            </p>
          ) : null}
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
