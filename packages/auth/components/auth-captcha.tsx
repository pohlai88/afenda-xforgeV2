"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import { useEffect, useId, useRef, useState } from "react";
import { getCaptchaSiteKey } from "../keys";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { AuthConfigNotice } from "./auth-feedback";

type AuthCaptchaProperties = {
  className?: string;
  onTokenChange: (token: string | null) => void;
};

type HCaptchaWindow = Window & {
  hcaptcha?: {
    render: (
      container: HTMLElement,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback": () => void;
        "error-callback": () => void;
      }
    ) => string;
    reset: (widgetId?: string) => void;
  };
};

type TurnstileWindow = Window & {
  turnstile?: {
    render: (
      container: HTMLElement,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback": () => void;
        "error-callback": () => void;
      }
    ) => string;
    reset: (widgetId?: string) => void;
  };
};

const loadScript = (src: string, id: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

export const AuthCaptcha = ({
  className,
  onTokenChange,
}: AuthCaptchaProperties) => {
  const { settings } = useAuthUiConfig();
  const containerId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const siteKey = getCaptchaSiteKey();
  const provider = settings.security.captchaProvider?.toLowerCase() ?? "hcaptcha";

  useEffect(() => {
    onTokenChange(null);
  }, [onTokenChange, provider, siteKey]);

  useEffect(() => {
    if (!(settings.security.captchaEnabled && siteKey && containerRef.current)) {
      return;
    }

    let cancelled = false;

    const mountWidget = async () => {
      setLoadError(null);

      try {
        if (provider.includes("turnstile")) {
          await loadScript(
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
            "afenda-turnstile-script"
          );

          if (cancelled || !containerRef.current) {
            return;
          }

          const turnstile = (window as TurnstileWindow).turnstile;

          if (!turnstile) {
            setLoadError("Turnstile failed to initialize.");
            return;
          }

          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => onTokenChange(token),
            "expired-callback": () => onTokenChange(null),
            "error-callback": () => onTokenChange(null),
          });
          return;
        }

        await loadScript(
          "https://js.hcaptcha.com/1/api.js?render=explicit",
          "afenda-hcaptcha-script"
        );

        if (cancelled || !containerRef.current) {
          return;
        }

        const hcaptcha = (window as HCaptchaWindow).hcaptcha;

        if (!hcaptcha) {
          setLoadError("hCaptcha failed to initialize.");
          return;
        }

        widgetIdRef.current = hcaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onTokenChange(token),
          "expired-callback": () => onTokenChange(null),
          "error-callback": () => onTokenChange(null),
        });
      } catch {
        if (!cancelled) {
          setLoadError("Could not load CAPTCHA widget.");
        }
      }
    };

    void mountWidget();

    return () => {
      cancelled = true;
      onTokenChange(null);
    };
  }, [
    onTokenChange,
    provider,
    settings.security.captchaEnabled,
    siteKey,
  ]);

  if (!settings.security.captchaEnabled) {
    return null;
  }

  if (!siteKey) {
    return (
      <AuthConfigNotice>
        CAPTCHA is enabled in Supabase but{" "}
        <code className={recipe("captionText")}>NEXT_PUBLIC_CAPTCHA_SITE_KEY</code>{" "}
        is not set. Add the site key to show the widget.
      </AuthConfigNotice>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div id={containerId} ref={containerRef} />
      {loadError ? (
        <p className={cn("text-text-secondary", recipe("captionText"))}>
          {loadError}
        </p>
      ) : null}
    </div>
  );
};

export const useCaptchaOptions = (token: string | null) => {
  const { settings } = useAuthUiConfig();

  if (!(settings.security.captchaEnabled && token)) {
    return undefined;
  }

  return { captchaToken: token };
};
