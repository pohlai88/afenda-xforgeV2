"use client";

import {
  cn,
  recipe,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { fromSupabaseError } from "../auth-result";
import { createClient } from "../client";
import { getUserDisplayName } from "../metadata";
import { AuthErrorAlert } from "./auth-feedback";
import { AuthPendingButton } from "./auth-pending-button";
import { authLinkClass } from "./auth-section";

type Organization = {
  id: string;
  name: string;
};

type OrganizationSwitcherProperties = {
  organizations: Organization[];
  activeOrganizationId: string | null;
  onSwitch: (organizationId: string) => Promise<void>;
};

export const OrganizationSwitcher = ({
  organizations,
  activeOrganizationId,
  onSwitch,
}: OrganizationSwitcherProperties) => {
  const [isPending, startTransition] = useTransition();

  if (organizations.length === 0) {
    return <p className={recipe("captionText")}>No organizations</p>;
  }

  return (
    <Select
      disabled={isPending}
      onValueChange={(organizationId) => {
        if (!organizationId || organizationId === activeOrganizationId) {
          return;
        }

        startTransition(async () => {
          await onSwitch(organizationId);
        });
      }}
      value={activeOrganizationId ?? undefined}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

type UserButtonProperties = {
  email?: string | null;
  name?: string | null;
};

export const UserButton = ({ email, name }: UserButtonProperties) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    const { error: signOutError } = await supabase.auth.signOut();
    const failure = fromSupabaseError(signOutError);

    if (failure) {
      setError(failure.error);
      setLoading(false);
      return;
    }

    router.push("/sign-in");
    router.refresh();
  };

  const displayName = name ?? email ?? "User";

  return (
    <div className={cn("flex min-w-0 flex-1 flex-col", recipe("fieldGap"))}>
      <span className={cn("truncate", recipe("bodyMediumText"))}>
        {displayName}
      </span>
      {name && email ? (
        <span className={cn("truncate", recipe("captionText"))}>{email}</span>
      ) : null}
      {error ? <AuthErrorAlert message={error} /> : null}
      <Link className={authLinkClass} href="/account/security">
        Security settings
      </Link>
      <AuthPendingButton
        className="h-auto w-fit justify-start p-0"
        onClick={handleSignOut}
        pending={loading}
        pendingLabel="Signing out…"
        type="button"
        variant="link"
      >
        Sign out
      </AuthPendingButton>
    </div>
  );
};

export const useAuthUser = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const applyUser = (user: { email?: string | null; user_metadata?: Record<string, unknown> } | null | undefined) => {
      setEmail(user?.email ?? null);
      setName(getUserDisplayName(user?.user_metadata ?? undefined));
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      applyUser(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { email, name };
};
