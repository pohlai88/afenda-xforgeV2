"use client";

import type { UserIdentity } from "@supabase/supabase-js";
import { useCallback, useEffect, useId, useState } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { hasEmailPasswordIdentity } from "../identities";
import { AuthErrorAlert } from "./auth-feedback";
import {
  AuthLoadingState,
  AuthSection,
  AuthSectionHeader,
} from "./auth-section";
import { SetAccountPassword } from "./set-account-password";
import { UpdatePasswordForm } from "./update-password-form";

const sectionTitle = "Password";

const sectionDescription =
  "Change your account password. You may need your current password or a confirmation code from email depending on project settings.";

/** Set password (OAuth-only) or change password (email identity) on account security. */
export const AccountPasswordSection = () => {
  const supabase = createClient();
  const titleId = useId();
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIdentities = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: listError } = await supabase.auth.getUserIdentities();

    if (listError) {
      const failure = fromSupabaseError(listError);
      setError(failure?.error ?? "Could not load password settings.");
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

  if (!(loading || error || hasEmailPasswordIdentity(identities))) {
    return <SetAccountPassword onSuccess={loadIdentities} />;
  }

  return (
    <AuthSection aria-busy={loading} aria-labelledby={titleId}>
      <AuthSectionHeader
        description={sectionDescription}
        title={sectionTitle}
        titleId={titleId}
      />
      {error ? (
        <AuthErrorAlert
          message={error}
          onRetry={() => {
            loadIdentities().catch(() => undefined);
          }}
        />
      ) : null}
      {loading ? <AuthLoadingState label="Loading password settings…" /> : null}
      {loading || error ? null : (
        <UpdatePasswordForm onSuccess={loadIdentities} variant="account" />
      )}
    </AuthSection>
  );
};
