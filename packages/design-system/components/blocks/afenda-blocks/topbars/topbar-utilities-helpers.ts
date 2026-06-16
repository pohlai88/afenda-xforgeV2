import type { TopbarUtilitiesMarketItem, TopbarUtilityAction } from "./topbar-types";
import { TOPBAR_MAX_PINNED_UTILITY_SLOTS } from "./topbar-constants";

export function resolveDefaultEnabledIds(
  catalog: readonly TopbarUtilitiesMarketItem[],
  defaultEnabledIds?: readonly string[]
): readonly string[] {
  if (defaultEnabledIds) {
    return defaultEnabledIds.slice(0, TOPBAR_MAX_PINNED_UTILITY_SLOTS);
  }

  return catalog
    .slice(0, TOPBAR_MAX_PINNED_UTILITY_SLOTS)
    .map((item) => item.id);
}

export function buildCatalogMaps(
  catalog: readonly TopbarUtilitiesMarketItem[]
): {
  readonly catalogById: ReadonlyMap<string, TopbarUtilityAction>;
  readonly catalogIds: ReadonlySet<string>;
} {
  const catalogById = new Map<string, TopbarUtilityAction>();

  for (const item of catalog) {
    catalogById.set(item.id, item);
  }

  return {
    catalogById,
    catalogIds: new Set(catalogById.keys()),
  };
}

export function buildPinnedOrder(
  order: readonly string[],
  enabledIds: readonly string[],
  maxPinnedSlots: number
): readonly string[] {
  const enabledSet = new Set(enabledIds);

  return order.filter((id) => enabledSet.has(id)).slice(0, maxPinnedSlots);
}

export function buildPinnedActions(
  catalogById: ReadonlyMap<string, TopbarUtilityAction>,
  pinnedOrder: readonly string[]
): readonly TopbarUtilityAction[] {
  const pinned: TopbarUtilityAction[] = [];

  for (const id of pinnedOrder) {
    const action = catalogById.get(id);

    if (action) {
      pinned.push(action);
    }
  }

  return pinned;
}
