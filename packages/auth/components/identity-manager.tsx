"use client";

import { Button, cn, recipe } from "@repo/design-system/design-system";
import type { UserIdentity } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
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
import { buildAuthCallbackRedirect } from "../redirects";
import {
  AuthConfigNotice,
  AuthErrorAlert,
  AuthSuccessAlert,
} from "./auth-feedback";
import { GoogleIcon } from "./auth-icons";
import { AuthPendingButton } from "./auth-pending-button";
import {
  AuthLoadingState,
  AuthSection,
  AuthSectionHeader,
} from "./auth-section";

export const IdentityManager = () => {
  const { settings } = useAuthUiConfig();
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const titleId = useId();
  const linkedHandled = useRef(false);
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
      const failure = fromSupabaseError(listError);
      setError(failure?.error ?? "Could not load linked sign-in methods.");
      setIdentities([]);
      setLoading(false);
      return;
    }

    setIdentities(data?.identities ?? []);
    setLoading(false);
  }, [supabase.auth]);

  useEffect(() => {
    loadIdentities().catch(() => undefined);
  }, [loadIdentities]);

  useEffect(() => {
    if (linkedHandled.current) {
      return;
    }

    const linked = searchParams.get("linked");

    if (linked === "google") {
      linkedHandled.current = true;
      setMessage("Google account linked successfully.");
      router.replace("/account/security");
      loadIdentities().catch(() => undefined);
    }
  }, [loadIdentities, router, searchParams]);

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
        redirectTo: buildAuthCallbackRedirect(
          "/account/security?linked=google"
        ),
      },
    });

    const failure = fromSupabaseError(linkError);

    if (failure) {
      setError(failure.error);
      setAction(null);
    }
  };

  let googleLinkingAction = (
    <p className={recipe("captionText")}>
      Manual linking is disabled — Google will link automatically when the email
      matches a verified address on sign-in.
    </p>
  );
  if (settings.security.manualLinkingEnabled) {
    googleLinkingAction = (
      <p className={recipe("captionText")}>
        Google is already linked or unavailable for this account.
      </p>
    );
  }
  if (canLinkGoogle) {
    googleLinkingAction = (
      <AuthPendingButton
        className="w-fit"
        disabled={action !== null && action !== "link"}
        leading={<GoogleIcon className="size-4" />}
        onClick={handleLinkGoogle}
        pending={action === "link"}
        pendingLabel="Redirecting to Google…"
        type="button"
        variant="secondary"
      >
        Link Google account
      </AuthPendingButton>
    );
  }

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

  let identitiesContent = (
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
  );
  if (identities.length === 0) {
    identitiesContent = (
      <p className={recipe("captionText")}>
        No identities found. Sign out and back in if this looks wrong.
      </p>
    );
  }
  if (loading) {
    identitiesContent = <AuthLoadingState label="Loading identities…" />;
  }

  return (
    <AuthSection aria-busy={loading} aria-labelledby={titleId}>
      <AuthSectionHeader
        description="Supabase automatically links providers that share a verified email address. Manual linking lets you attach a provider with a different email while signed in."
        title="Linked sign-in methods"
        titleId={titleId}
      />
      {settings.security.manualLinkingEnabled ? null : (
        <AuthConfigNotice>
          Manual identity linking is disabled in Supabase. Run{" "}
          <code className="text-xs">
            pnpm supabase:apply-identity-linking-config
          </code>{" "}
          or enable it under Authentication → Providers.
        </AuthConfigNotice>
      )}
      {settings.mailerAutoconfirm ? null : (
        <p className={recipe("captionText")}>
          Automatic linking requires a verified email — unconfirmed identities
          are removed when a matching verified account is found.
        </p>
      )}
      {settings.google && !hasGoogleIdentity ? (
        <div className="flex flex-col gap-3 rounded-[var(--xforge-radius-md)] border border-border-default px-4 py-3">
          <div className="flex flex-col gap-1">
            <h3 className={recipe("bodyMediumText")}>Google account</h3>
            <p className={recipe("captionText")}>
              Link Google to sign in with one click on this device. Automatic
              linking still applies when Google and email share a verified
              address.
            </p>
          </div>
          {googleLinkingAction}
        </div>
      ) : null}
      {error && !loading ? (
        <AuthErrorAlert
          message={error}
          onRetry={
            identities.length === 0 && action === null
              ? () => {
                  loadIdentities().catch(() => undefined);
                }
              : undefined
          }
        />
      ) : null}
      {message ? <AuthSuccessAlert message={message} /> : null}
      {identitiesContent}
      {!canUnlink && identities.length === 1 ? (
        <p className={recipe("captionText")}>
          Link another provider before unlinking your only sign-in method.
        </p>
      ) : null}
    </AuthSection>
  );
};
