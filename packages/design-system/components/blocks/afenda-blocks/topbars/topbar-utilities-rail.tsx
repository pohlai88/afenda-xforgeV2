"use client";

import { cn } from "@repo/design-system/lib/utils";
import {
  TOPBAR_MAX_PINNED_UTILITY_SLOTS,
  TOPBAR_MAX_TOTAL_UTILITY_SLOTS,
} from "./topbar-constants";
import { TopbarActionsMenu } from "./topbar-actions-menu";
import {
  topbarUtilitiesFixedClusterClass,
  topbarUtilitiesPinnedClass,
} from "./topbar-recipes";
import type { TopbarUtilitiesRailProps } from "./topbar-types";
import { TopbarUserMenu } from "./topbar-user-menu";
import { TopbarUtilitiesBar } from "./topbar-utilities-bar";
import { TopbarUtilitiesMarket } from "./topbar-utilities-market";
import { useTopbarUtilitiesState } from "./use-topbar-utilities-state";

export function TopbarUtilitiesRail({
  catalog,
  className,
  defaultEnabledIds,
  defaultOrder,
  enabledIds,
  maxPinnedSlots = TOPBAR_MAX_PINNED_UTILITY_SLOTS,
  maxTotalSlots = TOPBAR_MAX_TOTAL_UTILITY_SLOTS,
  actionsMenu,
  onEnabledChange,
  onOrderChange,
  onRequestUtility,
  order,
  requestUtilityFeaturesLabel,
  requestUtilityNameLabel,
  requestUtilityNote,
  requestUtilitySendLabel,
  requestUtilityTitle,
  userMenu,
}: TopbarUtilitiesRailProps) {
  const {
    commitOrder,
    handleEnabledChange,
    pinnedActions,
    pinnedOrder,
    resolvedEnabledIds,
  } = useTopbarUtilitiesState({
    catalog,
    defaultEnabledIds,
    defaultOrder,
    enabledIds,
    maxPinnedSlots,
    onEnabledChange,
    onOrderChange,
    order,
  });

  const hasPinnedUtilities = pinnedActions.length > 0;

  return (
    <div
      aria-label="Topbar utilities"
      className={cn("flex min-w-0 items-center", className)}
      data-slot="app-topbar-utilities-rail"
      role="toolbar"
    >
      {hasPinnedUtilities ? (
        <TopbarUtilitiesBar
          actions={pinnedActions}
          className={topbarUtilitiesPinnedClass}
          draggable
          maxActions={maxPinnedSlots}
          onOrderChange={commitOrder}
          order={pinnedOrder}
        />
      ) : null}
      <div
        className={cn(
          hasPinnedUtilities && topbarUtilitiesFixedClusterClass,
          "flex shrink-0 items-center gap-0.5"
        )}
        data-slot="app-topbar-utilities-fixed"
      >
        <TopbarUtilitiesMarket
          catalog={catalog}
          enabledIds={resolvedEnabledIds}
          maxPinnedSlots={maxPinnedSlots}
          maxTotalSlots={maxTotalSlots}
          onEnabledChange={handleEnabledChange}
          onRequestUtility={onRequestUtility}
          requestUtilityFeaturesLabel={requestUtilityFeaturesLabel}
          requestUtilityNameLabel={requestUtilityNameLabel}
          requestUtilityNote={requestUtilityNote}
          requestUtilitySendLabel={requestUtilitySendLabel}
          requestUtilityTitle={requestUtilityTitle}
        />
        <TopbarUserMenu {...userMenu} />
        {actionsMenu ? <TopbarActionsMenu {...actionsMenu} /> : null}
      </div>
    </div>
  );
}
