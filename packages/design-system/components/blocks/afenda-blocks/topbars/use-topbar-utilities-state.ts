"use client";

import { TOPBAR_MAX_PINNED_UTILITY_SLOTS } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import {
  buildCatalogMaps,
  buildPinnedActions,
  buildPinnedOrder,
  resolveDefaultEnabledIds,
} from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-utilities-helpers";
import { useCallback, useMemo, useState } from "react";
import type {
  TopbarUtilitiesRailProps,
  TopbarUtilityAction,
} from "./topbar-types";

interface UseTopbarUtilitiesStateOptions {
  readonly catalog: TopbarUtilitiesRailProps["catalog"];
  readonly defaultEnabledIds?: readonly string[];
  readonly defaultOrder?: readonly string[];
  readonly enabledIds?: readonly string[];
  readonly maxPinnedSlots?: number;
  readonly onEnabledChange?: (ids: readonly string[]) => void;
  readonly onOrderChange?: (order: readonly string[]) => void;
  readonly order?: readonly string[];
}

interface TopbarUtilitiesInternalState {
  readonly enabledIds: readonly string[];
  readonly order: readonly string[];
}

function createInitialTopbarUtilitiesState(
  catalog: TopbarUtilitiesRailProps["catalog"],
  defaultEnabledIds?: readonly string[],
  defaultOrder?: readonly string[]
): TopbarUtilitiesInternalState {
  const { catalogIds } = buildCatalogMaps(catalog);
  const enabledIds = resolveDefaultEnabledIds(
    catalog,
    defaultEnabledIds
  ).filter((id) => catalogIds.has(id));

  return {
    enabledIds,
    order: defaultOrder ?? enabledIds,
  };
}

export function useTopbarUtilitiesState({
  catalog,
  defaultEnabledIds,
  defaultOrder,
  enabledIds: controlledEnabledIds,
  maxPinnedSlots = TOPBAR_MAX_PINNED_UTILITY_SLOTS,
  onEnabledChange,
  onOrderChange,
  order: controlledOrder,
}: UseTopbarUtilitiesStateOptions) {
  const { catalogById } = useMemo(() => buildCatalogMaps(catalog), [catalog]);

  const [internalState, setInternalState] =
    useState<TopbarUtilitiesInternalState>(() =>
      createInitialTopbarUtilitiesState(
        catalog,
        defaultEnabledIds,
        defaultOrder
      )
    );

  const resolvedEnabledIds = controlledEnabledIds ?? internalState.enabledIds;
  const resolvedOrder = controlledOrder ?? internalState.order;

  const pinnedOrder = useMemo(
    () => buildPinnedOrder(resolvedOrder, resolvedEnabledIds, maxPinnedSlots),
    [maxPinnedSlots, resolvedEnabledIds, resolvedOrder]
  );

  const pinnedActions = useMemo(
    (): readonly TopbarUtilityAction[] =>
      buildPinnedActions(catalogById, pinnedOrder),
    [catalogById, pinnedOrder]
  );

  const commitEnabledIds = useCallback(
    (nextEnabledIds: readonly string[]) => {
      const capped = nextEnabledIds.slice(0, maxPinnedSlots);

      if (controlledEnabledIds === undefined) {
        setInternalState((current) => ({ ...current, enabledIds: capped }));
      }

      onEnabledChange?.(capped);
    },
    [controlledEnabledIds, maxPinnedSlots, onEnabledChange]
  );

  const commitOrder = useCallback(
    (nextOrder: readonly string[]) => {
      if (controlledOrder === undefined) {
        setInternalState((current) => ({ ...current, order: nextOrder }));
      }

      onOrderChange?.(nextOrder);
    },
    [controlledOrder, onOrderChange]
  );

  const handleEnabledChange = useCallback(
    (id: string, enabled: boolean) => {
      if (enabled) {
        if (resolvedEnabledIds.length >= maxPinnedSlots) {
          return;
        }

        const nextEnabled = [...resolvedEnabledIds, id];
        const nextOrder = resolvedOrder.includes(id)
          ? resolvedOrder
          : [...resolvedOrder, id];

        commitEnabledIds(nextEnabled);
        commitOrder(nextOrder);
        return;
      }

      commitEnabledIds(resolvedEnabledIds.filter((entry) => entry !== id));
    },
    [
      commitEnabledIds,
      commitOrder,
      maxPinnedSlots,
      resolvedEnabledIds,
      resolvedOrder,
    ]
  );

  return {
    commitOrder,
    handleEnabledChange,
    pinnedActions,
    pinnedOrder,
    resolvedEnabledIds,
    resolvedOrder,
  };
}
