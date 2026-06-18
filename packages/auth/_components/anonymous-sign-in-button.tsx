"use client";

import { cn, recipe } from "@repo/design-system";
import { useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { completeAuthenticatedNavigation } from "../client-navigation";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { AuthCaptcha, useCaptchaOptions } from "./auth-captcha";
import { AuthErrorAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";

interface AnonymousSignInButtonProperties {
  onError?: (message: string | null) => void;
}

export const AnonymousSignInButton = ({
  onError,
}: AnonymousSignInButtonProperties) => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaOptions = useCaptchaOptions(captchaToken);

  if (!settings.anonymous) {
    return null;
  }

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setFormError(null);
    onError?.(null);

    if (settings.security.captchaEnabled && !captchaToken) {
      setFormError("Complete the CAPTCHA before continuing.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInAnonymously({
      options: captchaOptions,
    });

    const failure = fromSupabaseError(error);

    if (failure) {
      setFormError(failure.error);
      onError?.(failure.error);
      setLoading(false);
      return;
    }

    await completeAuthenticatedNavigation("/");
  };

  return (
    <div className={cn("flex flex-col gap-3", recipe("sectionGap"))}>
      {formError ? <AuthErrorAlert message={formError} /> : null}
      {settings.security.captchaEnabled ? (
        <AuthCaptcha onTokenChange={setCaptchaToken} />
      ) : null}
      <AuthPendingButton
        className="w-full"
        onClick={handleAnonymousSignIn}
        pending={loading}
        pendingLabel="Continuing…"
        type="button"
        variant="secondary"
      >
        Continue as guest
      </AuthPendingButton>
      <p
        className={cn("text-center text-text-secondary", recipe("captionText"))}
      >
        Guest sessions are temporary. Link an email later from account settings.
      </p>
    </div>
  );
};
