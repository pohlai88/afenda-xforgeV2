"use client";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
  recipe,
} from "@repo/design-system/design-system";
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

  if (organizations.length === 0) {
    return (
      <p className={recipe("captionText")}>No organizations</p>
    );
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
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
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
      <Button
        className="h-auto w-fit justify-start p-0"
        disabled={loading}
        onClick={handleSignOut}
        type="button"
        variant="link"
      >
        {loading ? "Signing out…" : "Sign out"}
      </Button>
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
    } = supabase.auth.onAuthStateChange(() => {
      void supabase.auth.getUser().then(({ data: { user } }) => {
        setEmail(user?.email ?? null);
        setName(getUserDisplayName(user?.user_metadata ?? undefined));
      });
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { email, name };
};
