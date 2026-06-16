"use client";

import {
  getActiveOrganizations,
  switchActiveOrganization,
} from "@repo/auth/actions/organizations";
import { fromSupabaseError } from "@repo/auth/auth-result";
import { createClient } from "@repo/auth/client";
import {
  DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
  DropdownMenuItem,
  DropdownMenuSeparator,
  ModeToggle,
  OperatorAppTopbar,
  type TopbarActionMenuItem,
  type TopbarScopeSwitcherConfig,
  type TopbarUtilitiesMarketItem,
} from "@repo/design-system/design-system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { getInitials } from "./user-initials";
import { useOptionalWorkspaceKeyboard } from "./workspace-keyboard-provider";
import { useWorkspaceSession } from "./workspace-session-context";

const defaultEnabledUtilityIds = ["help", "feedback", "notifications"] as const;

export const AppTopbar = () => {
  const router = useRouter();
  const keyboard = useOptionalWorkspaceKeyboard();
  const { meta, state } = useWorkspaceSession();
  const [organizations, setOrganizations] = useState<
    { id: string; name: string }[]
  >([]);
  const [enabledUtilityIds, setEnabledUtilityIds] = useState<readonly string[]>(
    [...defaultEnabledUtilityIds]
  );
  const [utilityOrder, setUtilityOrder] = useState<readonly string[]>([
    ...defaultEnabledUtilityIds,
  ]);
  const [signingOut, setSigningOut] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getActiveOrganizations().then(setOrganizations);
  }, []);

  const organizationSwitcher = useMemo<TopbarScopeSwitcherConfig>(
    () => ({
      id: "company",
      label: "Organization",
      description: "Tenant scope for reads, writes, and audit evidence.",
      activeOptionId: state.activeOrganizationId ?? organizations[0]?.id ?? "",
      options: organizations.map((organization) => ({
        id: organization.id,
        label: organization.name,
      })),
      onSelect: (organizationId) => {
        if (organizationId === state.activeOrganizationId) {
          return;
        }

        startTransition(async () => {
          await switchActiveOrganization(organizationId);
          window.location.reload();
        });
      },
    }),
    [organizations, state.activeOrganizationId]
  );

  const actionsMenuItems = useMemo<readonly TopbarActionMenuItem[]>(
    () =>
      DEFAULT_ERP_ACTIONS_MENU_ITEMS.map((item) => ({
        ...item,
        onSelect: () => {
          if (item.id === "shortcuts") {
            keyboard?.openShortcutsDialog();
            return;
          }

          if (item.id === "refresh") {
            window.location.reload();
          }
        },
      })),
    [keyboard]
  );

  const utilitiesCatalog = useMemo<readonly TopbarUtilitiesMarketItem[]>(
    () =>
      DEFAULT_ERP_UTILITIES_MARKET_ITEMS.map((item) => ({
        ...item,
        onSelect: () => {
          if (item.id === "search") {
            keyboard?.openCommandPalette();
            return;
          }

          if (item.id === "shortcuts") {
            keyboard?.openShortcutsDialog();
          }
        },
      })),
    [keyboard]
  );

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    const failure = fromSupabaseError(error);

    if (failure) {
      setSigningOut(false);
      return;
    }

    router.push("/sign-in");
    router.refresh();
  };

  return (
    <OperatorAppTopbar
      commandPalette={{
        onOpen: () => keyboard?.openCommandPalette(),
        onSearch: (query) => {
          router.push(`/search?q=${encodeURIComponent(query)}`);
        },
        placeholder: "Search…",
        shortcut: "⌘K",
        description: "Jump to routes, records, and recent audit activity.",
      }}
      scopeSwitchers={[organizationSwitcher]}
      sidebarControl
      trailing={<ModeToggle />}
      utilitiesRail={{
        catalog: utilitiesCatalog,
        defaultEnabledIds: defaultEnabledUtilityIds,
        enabledIds: enabledUtilityIds,
        actionsMenu: {
          actions: actionsMenuItems,
        },
        onEnabledChange: setEnabledUtilityIds,
        onOrderChange: setUtilityOrder,
        order: utilityOrder,
        userMenu: {
          avatarFallback: getInitials(state.userName, state.userEmail),
          displayName: meta.displayName,
          email: state.userEmail,
          children: (
            <>
              <DropdownMenuItem asChild className="text-[12px]">
                <Link href="/account/security">Security settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-[12px]">
                <Link href="/account/organization">Organization</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-[12px]"
                disabled={signingOut}
                onSelect={() => {
                  void handleSignOut();
                }}
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </DropdownMenuItem>
            </>
          ),
        },
      }}
    />
  );
};
