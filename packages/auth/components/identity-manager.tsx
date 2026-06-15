"use client";

import {
  Alert,
  AlertDescription,
  Button,
  cn,
  recipe,
} from "@repo/design-system/design-system";
import type { UserIdentity } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { useAuthUiConfig } from "../context/auth-ui-config";
import {
  canUnlinkIdentity,
  formatIdentityLastUsed,
  getIdentityDisplayEmail,
  getIdentityProviderLabel,
  getLinkableOAuthProviders,
  isSsoIdentity,
} from "../identities";
import { buildAuthCallbackRedirect } from "../oauth-redirect";
import { GoogleIcon } from "./auth-icons";

export const IdentityManager = () => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<"link" | "unlink" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadIdentities = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: listError } = await supabase.auth.getUserIdentities();

    if (listError) {
      setError(listError.message);
      setIdentities([]);
      setLoading(false);
      return;
    }

    setIdentities(data?.identities ?? []);
    setLoading(false);
  }, [supabase.auth]);

  useEffect(() => {
    void loadIdentities();
  }, [loadIdentities]);

  useEffect(() => {
    const linked = searchParams.get("linked");

    if (linked === "google") {
      setMessage("Google account linked successfully.");
      router.replace("/account/security");
    }
  }, [router, searchParams]);

  const linkableProviders = getLinkableOAuthProviders(identities, {
    google: settings.google,
  });
  const hasGoogleIdentity = identities.some(
    (identity) => identity.provider === "google"
  );
  const canLinkGoogle =
    settings.google &&
    settings.security.manualLinkingEnabled &&
    linkableProviders.includes("google");
  const canUnlink = canUnlinkIdentity(identities);

  const handleLinkGoogle = async () => {
    setAction("link");
    setError(null);
    setMessage(null);

    const { error: linkError } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: buildAuthCallbackRedirect("/account/security?linked=google"),
      },
    });

    const failure = fromSupabaseError(linkError);

    if (failure) {
      setError(failure.error);
      setAction(null);
    }
  };

  const handleUnlink = async (identity: UserIdentity) => {
    if (isSsoIdentity(identity)) {
      setError("SAML SSO sign-in methods cannot be unlinked here.");
      return;
    }

    if (!canUnlink) {
      setError("Keep at least one sign-in method linked to your account.");
      return;
    }

    setAction("unlink");
    setError(null);
    setMessage(null);

    const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity);

    const failure = fromSupabaseError(unlinkError);

    if (failure) {
      setError(failure.error);
      setAction(null);
      return;
    }

    setMessage(`${getIdentityProviderLabel(identity.provider)} unlinked.`);
    setAction(null);
    await loadIdentities();
  };

  return (
    <section className={cn("flex flex-col", recipe("sectionGap"))}>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-text-primary">Linked sign-in methods</h2>
        <p className={recipe("captionText")}>
          Supabase automatically links providers that share a verified email
          address. Manual linking lets you attach a provider with a different
          email while signed in.
        </p>
      </div>
      {!settings.security.manualLinkingEnabled ? (
        <Alert tone="critical">
          <AlertDescription>
            Manual identity linking is disabled in Supabase. Run{" "}
            <code className="text-xs">pnpm supabase:apply-identity-linking-config</code>{" "}
            or enable it under Authentication → Providers.
          </AlertDescription>
        </Alert>
      ) : null}
      {!settings.mailerAutoconfirm ? (
        <p className={recipe("captionText")}>
          Automatic linking requires a verified email — unconfirmed identities
          are removed when a matching verified account is found.
        </p>
      ) : null}
      {settings.google && !hasGoogleIdentity ? (
        <div className="flex flex-col gap-3 rounded-[var(--xforge-radius-md)] border border-border-default px-4 py-3">
          <div className="flex flex-col gap-1">
            <h3 className={recipe("bodyMediumText")}>Google account</h3>
            <p className={recipe("captionText")}>
              Link Google to sign in with one click on this device. Automatic
              linking still applies when Google and email share a verified address.
            </p>
          </div>
          {canLinkGoogle ? (
            <Button
              className="w-fit"
              disabled={action !== null}
              onClick={handleLinkGoogle}
              type="button"
              variant="secondary"
            >
              <GoogleIcon className="size-4" />
              {action === "link" ? "Redirecting to Google…" : "Link Google account"}
            </Button>
          ) : !settings.security.manualLinkingEnabled ? (
            <p className={recipe("captionText")}>
              Manual linking is disabled — Google will link automatically when the
              email matches a verified address on sign-in.
            </p>
          ) : (
            <p className={recipe("captionText")}>
              Google is already linked or unavailable for this account.
            </p>
          )}
        </div>
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
        <p className={recipe("captionText")}>Loading identities…</p>
      ) : identities.length === 0 ? (
        <p className={recipe("captionText")}>
          No identities found. Sign out and back in if this looks wrong.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {identities.map((identity) => {
            const email = getIdentityDisplayEmail(identity);
            const lastUsed = formatIdentityLastUsed(identity.last_sign_in_at);

            return (
              <li
                className="flex items-center justify-between gap-3 rounded-[var(--xforge-radius-md)] border border-border-default px-3 py-2"
                key={identity.id}
              >
                <div className="min-w-0">
                  <p className={cn("truncate", recipe("bodyMediumText"))}>
                    {getIdentityProviderLabel(identity.provider)}
                  </p>
                  {email ? (
                    <p className={cn("truncate", recipe("captionText"))}>{email}</p>
                  ) : null}
                  {lastUsed ? (
                    <p className={recipe("captionText")}>Last used {lastUsed}</p>
                  ) : null}
                </div>
                {canUnlink && !isSsoIdentity(identity) ? (
                  <Button
                    disabled={action !== null}
                    onClick={() => handleUnlink(identity)}
                    size="sm"
                    type="button"
                    variant="quiet"
                  >
                    Unlink
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      {!canUnlink && identities.length === 1 ? (
        <p className={recipe("captionText")}>
          Link another provider before unlinking your only sign-in method.
        </p>
      ) : null}
    </section>
  );
};
