"use client";

import {
  TOPBAR_MAX_PINNED_UTILITY_SLOTS,
  TOPBAR_MAX_TOTAL_UTILITY_SLOTS,
} from "./topbar-constants";
import {
  topbarUtilitiesFixedClusterClass,
  topbarUtilitiesPinnedClass,
} from "./topbar-recipes";
import { cn } from "../../../../../lib/utils";
import { useMemo, useState } from "react";
import { TopbarActionsMenu } from "./topbar-actions-menu";
import type { TopbarUtilitiesRailProps } from "./topbar-types";
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
  notifications,
  onEnabledChange,
  onOrderChange,
  onRequestUtility,
  order,
  requestUtilityFeaturesLabel,
  requestUtilityNameLabel,
  requestUtilityNote,
  requestUtilitySendLabel,
  requestUtilityTitle,
  shortcuts,
  themeToggle,
}: TopbarUtilitiesRailProps) {
  const {
    commitOrder,
    handleEnabledChange,
    pinnedActions,
    pinnedOrder,
    resolvedEnabledIds,
    resolvedOrder,
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
  const [marketOpen, setMarketOpen] = useState(false);
  const resolvedPinnedActions = useMemo(
    () =>
      pinnedActions.map((action) =>
        action.id === "search"
          ? {
              ...action,
              onSelect: () => setMarketOpen(true),
            }
          : action
      ),
    [pinnedActions]
  );

  const hasPinnedUtilities = resolvedPinnedActions.length > 0;

  return (
    <div
      aria-label="Topbar utilities"
      className={cn("flex min-w-0 items-center", className)}
      data-slot="app-topbar-utilities-rail"
      role="toolbar"
    >
      {hasPinnedUtilities ? (
        <TopbarUtilitiesBar
          actions={resolvedPinnedActions}
          className={topbarUtilitiesPinnedClass}
          draggable
          maxActions={maxPinnedSlots}
          notifications={notifications}
          onOrderChange={commitOrder}
          order={pinnedOrder}
          shortcuts={shortcuts}
        />
      ) : null}
      <div
        className={cn(
          hasPinnedUtilities && topbarUtilitiesFixedClusterClass,
          "flex shrink-0 items-center gap-0.5"
        )}
        data-slot="app-topbar-utilities-fixed"
      >
        {themeToggle}
        <TopbarUtilitiesMarket
          catalog={catalog}
          enabledIds={resolvedEnabledIds}
          maxPinnedSlots={maxPinnedSlots}
          maxTotalSlots={maxTotalSlots}
          onEnabledChange={handleEnabledChange}
          onOpenChange={setMarketOpen}
          onOrderChange={commitOrder}
          onRequestUtility={onRequestUtility}
          open={marketOpen}
          order={resolvedOrder}
          requestUtilityFeaturesLabel={requestUtilityFeaturesLabel}
          requestUtilityNameLabel={requestUtilityNameLabel}
          requestUtilityNote={requestUtilityNote}
          requestUtilitySendLabel={requestUtilitySendLabel}
          requestUtilityTitle={requestUtilityTitle}
        />
        {actionsMenu ? <TopbarActionsMenu {...actionsMenu} /> : null}
      </div>
    </div>
  );
}
