"use client";

import { useCallback, useMemo, useState } from "react";
import { TOPBAR_MAX_PINNED_UTILITY_SLOTS } from "./topbar-constants";
import {
  buildCatalogMaps,
  buildPinnedActions,
  buildPinnedOrder,
  resolveDefaultEnabledIds,
} from "./topbar-utilities-helpers";
import type { TopbarUtilitiesRailProps, TopbarUtilityAction } from "./topbar-types";

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
  const { catalogById } = useMemo(
    () => buildCatalogMaps(catalog),
    [catalog]
  );

  const [internalEnabledIds, setInternalEnabledIds] = useState<readonly string[]>(
    () => {
      const { catalogIds } = buildCatalogMaps(catalog);

      return resolveDefaultEnabledIds(catalog, defaultEnabledIds).filter((id) =>
        catalogIds.has(id)
      );
    }
  );
  const [internalOrder, setInternalOrder] = useState<readonly string[]>(() => {
    const { catalogIds } = buildCatalogMaps(catalog);
    const initialEnabled = resolveDefaultEnabledIds(
      catalog,
      defaultEnabledIds
    ).filter((id) => catalogIds.has(id));

    return defaultOrder ?? initialEnabled;
  });

  const resolvedEnabledIds = controlledEnabledIds ?? internalEnabledIds;
  const resolvedOrder = controlledOrder ?? internalOrder;

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
        setInternalEnabledIds(capped);
      }

      onEnabledChange?.(capped);
    },
    [controlledEnabledIds, maxPinnedSlots, onEnabledChange]
  );

  const commitOrder = useCallback(
    (nextOrder: readonly string[]) => {
      if (controlledOrder === undefined) {
        setInternalOrder(nextOrder);
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
    handleEnabledChange,
    commitOrder,
    pinnedActions,
    pinnedOrder,
    resolvedEnabledIds,
  };
}
