"use client";

import {
  getActiveOrganizations,
  switchActiveOrganization,
} from "@repo/auth/actions/organizations";
import {
  DEFAULT_DASHBOARD_NAV_TOPBAR_ENABLED_UTILITY_IDS,
  DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
  OperatorAppTopbar,
  type TopbarActionMenuItem,
  type TopbarScopeSwitcherConfig,
  type TopbarUtilitiesMarketItem,
} from "@repo/design-system/design-system";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useOptionalWorkspaceKeyboard } from "./workspace-keyboard-provider";
import { useWorkspaceSession } from "./workspace-session-context";

export const AppTopbar = () => {
  const keyboard = useOptionalWorkspaceKeyboard();
  const { state } = useWorkspaceSession();
  const [organizations, setOrganizations] = useState<
    { id: string; name: string }[]
  >([]);
  const [enabledUtilityIds, setEnabledUtilityIds] = useState<readonly string[]>(
    [...DEFAULT_DASHBOARD_NAV_TOPBAR_ENABLED_UTILITY_IDS]
  );
  const [utilityOrder, setUtilityOrder] = useState<readonly string[]>([
    ...DEFAULT_DASHBOARD_NAV_TOPBAR_ENABLED_UTILITY_IDS,
  ]);
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
          if (item.id === "shortcuts") {
            keyboard?.openShortcutsDialog();
          }
        },
      })),
    [keyboard]
  );

  return (
    <OperatorAppTopbar
      scopeSwitchers={[organizationSwitcher]}
      sidebarControl
      utilitiesRail={{
        catalog: utilitiesCatalog,
        defaultEnabledIds: DEFAULT_DASHBOARD_NAV_TOPBAR_ENABLED_UTILITY_IDS,
        enabledIds: enabledUtilityIds,
        actionsMenu: {
          actions: actionsMenuItems,
        },
        onEnabledChange: setEnabledUtilityIds,
        onOrderChange: setUtilityOrder,
        order: utilityOrder,
      }}
    />
  );
};
