"use client";

import {
  Alert,
  AlertDescription,
  Button,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import { useCallback, useEffect, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { isPasskeyOriginSupported } from "../auth-ui-settings";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import { PasskeyIcon } from "./auth-icons";

type PasskeyRecord = {
  id: string;
  friendly_name?: string;
  created_at: string;
  last_used_at?: string;
};

export const PasskeyManager = () => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const [passkeys, setPasskeys] = useState<PasskeyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<"register" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadPasskeys = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: listError } = await supabase.auth.passkey.list();

    if (listError) {
      setError(listError.message);
      setPasskeys([]);
      setLoading(false);
      return;
    }

    setPasskeys(data ?? []);
    setLoading(false);
  }, [supabase.auth.passkey]);

  useEffect(() => {
    if (!settings.passkey.enabled) {
      setLoading(false);
      return;
    }

    void loadPasskeys();
  }, [loadPasskeys, settings.passkey.enabled]);

  const handleRegister = async () => {
    setAction("register");
    setError(null);
    setMessage(null);

    const { data, error: registerError } =
      await supabase.auth.registerPasskey();

    const failure = fromSupabaseError(registerError);

    if (failure) {
      setError(failure.error);
      setAction(null);
      return;
    }

    setMessage(
      data?.friendly_name
        ? `Registered ${data.friendly_name}.`
        : "Passkey registered."
    );
    setAction(null);
    await loadPasskeys();
  };

  const handleDelete = async (passkeyId: string) => {
    setAction("delete");
    setError(null);
    setMessage(null);

    const { error: deleteError } = await supabase.auth.passkey.delete({
      passkeyId,
    });

    const failure = fromSupabaseError(deleteError);

    if (failure) {
      setError(failure.error);
      setAction(null);
      return;
    }

    setMessage("Passkey removed.");
    setAction(null);
    await loadPasskeys();
  };

  if (!settings.passkey.enabled) {
    return null;
  }

  const passkeyOriginSupported = isPasskeyOriginSupported(settings.passkey);

  return (
    <section className={cn("flex flex-col", recipe("sectionGap"))}>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-text-primary">Passkeys</h2>
        <p className={recipe("captionText")}>
          Sign in with biometrics or a security key on this device.
        </p>
      </div>
      {!passkeyOriginSupported ? (
        <Alert tone="critical">
          <AlertDescription>
            Passkeys are not available on this origin. Hosted Supabase projects cannot
            register loopback origins (localhost) with a production RP ID. Test on{" "}
            {settings.passkey.rpOrigins.join(", ") || "your production URL"}, or use
            email / Google sign-in locally.
          </AlertDescription>
        </Alert>
      ) : null}
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
      {loading ? (
        <p className={recipe("captionText")}>Loading passkeys…</p>
      ) : passkeys.length === 0 ? (
        <p className={recipe("captionText")}>
          No passkeys registered for this account yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {passkeys.map((passkey) => (
            <li
              className="flex items-center justify-between gap-3 rounded-[var(--xforge-radius-md)] border border-border-default px-3 py-2"
              key={passkey.id}
            >
              <div className="flex min-w-0 items-center gap-2">
                <PasskeyIcon className="size-4 shrink-0 text-text-secondary" />
                <div className="min-w-0">
                  <p className={cn("truncate", recipe("bodyMediumText"))}>
                    {passkey.friendly_name ?? "Passkey"}
                  </p>
                  {passkey.last_used_at ? (
                    <p className={recipe("captionText")}>
                      Last used{" "}
                      {new Date(passkey.last_used_at).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              </div>
              <Button
                disabled={action !== null}
                onClick={() => handleDelete(passkey.id)}
                size="sm"
                type="button"
                variant="quiet"
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button
        className="w-fit"
        disabled={action !== null || !passkeyOriginSupported}
        onClick={handleRegister}
        type="button"
        variant="secondary"
      >
        {action === "register" ? "Waiting for passkey…" : "Add passkey"}
      </Button>
    </section>
  );
};
