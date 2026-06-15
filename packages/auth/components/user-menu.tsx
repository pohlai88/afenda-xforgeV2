"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "../client";
import { getUserDisplayName } from "../metadata";

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
  const activeOrganization = organizations.find(
    (organization) => organization.id === activeOrganizationId
  );

  return (
    <select
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
      disabled={isPending}
      onChange={(event) => {
        const organizationId = event.target.value;

        if (!organizationId || organizationId === activeOrganizationId) {
          return;
        }

        startTransition(async () => {
          await onSwitch(organizationId);
        });
      }}
      value={activeOrganizationId ?? ""}
    >
      {organizations.length === 0 ? (
        <option value="">No organizations</option>
      ) : null}
      {organizations.map((organization) => (
        <option key={organization.id} value={organization.id}>
          {organization.name}
        </option>
      ))}
      {activeOrganization ? null : organizations.length > 0 ? (
        <option disabled value="">
          Select organization
        </option>
      ) : null}
    </select>
  );
};

type UserButtonProperties = {
  email?: string | null;
  name?: string | null;
};

export const UserButton = ({ email, name }: UserButtonProperties) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="truncate font-medium text-sm">
        {name ?? email ?? "User"}
      </span>
      {name && email ? (
        <span className="truncate text-muted-foreground text-xs">{email}</span>
      ) : null}
      <button
        className="text-left text-muted-foreground text-xs hover:text-foreground disabled:opacity-50"
        disabled={loading}
        onClick={handleSignOut}
        type="button"
      >
        {loading ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
};

export const useAuthUser = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setName(getUserDisplayName(user?.user_metadata ?? undefined));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setEmail(user?.email ?? null);
      setName(getUserDisplayName(user?.user_metadata ?? undefined));
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { email, name };
};
