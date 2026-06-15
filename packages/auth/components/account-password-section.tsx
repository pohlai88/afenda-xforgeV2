"use client";

import { cn, recipe } from "@repo/design-system/design-system";
import { useCallback, useEffect, useState } from "react";
import type { UserIdentity } from "@supabase/supabase-js";
import { createClient } from "../client";
import { hasEmailPasswordIdentity } from "../identities";
import { SetAccountPassword } from "./set-account-password";
import { UpdatePasswordForm } from "./update-password-form";

/** Set password (OAuth-only) or change password (email identity) on account security. */
export const AccountPasswordSection = () => {
  const supabase = createClient();
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIdentities = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUserIdentities();
    setIdentities(data?.identities ?? []);
    setLoading(false);
  }, [supabase.auth]);

  useEffect(() => {
    void loadIdentities();
  }, [loadIdentities]);

  if (loading) {
    return null;
  }

  if (hasEmailPasswordIdentity(identities)) {
    return (
      <section className={cn("flex flex-col", recipe("sectionGap"))}>
        <div className="flex flex-col gap-1">
          <h2 className="font-medium text-text-primary">Password</h2>
          <p className={recipe("captionText")}>
            Change your account password. You may need your current password or
            a confirmation code from email depending on project settings.
          </p>
        </div>
        <UpdatePasswordForm
          onSuccess={() => {
            void loadIdentities();
          }}
          variant="account"
        />
      </section>
    );
  }

  return <SetAccountPassword onSuccess={loadIdentities} />;
};
