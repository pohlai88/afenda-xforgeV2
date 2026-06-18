import {
  TOPBAR_UTILITY_CATALOG,
  TOPBAR_UTILITY_DEFAULT_PINNED,
  TOPBAR_UTILITY_MAX_PINNED,
  isTopbarUtilityId,
  type TopbarUtilityId,
} from "./topbar-utilities-catalog";

export interface TopbarUtilitiesState {
  readonly order: TopbarUtilityId[];
  readonly visible: TopbarUtilityId[];
}

export interface TopbarUtilitiesScope {
  readonly tenantId: string;
  readonly userId: string;
}

const LEGACY_STORAGE_KEY = "afenda.workspace.topbar.utilities";
const STORAGE_KEY_PREFIX = "afenda.workspace.topbar.utilities";

export const DEFAULT_TOPBAR_UTILITIES_SCOPE: TopbarUtilitiesScope = {
  tenantId: "anonymous",
  userId: "anonymous",
};

const listeners = new Set<() => void>();

function allCatalogIds(): TopbarUtilityId[] {
  return TOPBAR_UTILITY_CATALOG.map((entry) => entry.id);
}

export function getTopbarUtilitiesStorageKey(
  scope: TopbarUtilitiesScope
): string {
  return `${STORAGE_KEY_PREFIX}:${scope.tenantId}:${scope.userId}`;
}

function isTopbarUtilitiesStorageKey(key: string | null): boolean {
  return (
    key === LEGACY_STORAGE_KEY ||
    (key?.startsWith(`${STORAGE_KEY_PREFIX}:`) ?? false)
  );
}

function normalizeOrder(value: unknown): TopbarUtilityId[] {
  const catalogIds = allCatalogIds();
  const seen = new Set<TopbarUtilityId>();
  const normalized: TopbarUtilityId[] = [];

  if (Array.isArray(value)) {
    for (const entry of value) {
      if (typeof entry !== "string" || !isTopbarUtilityId(entry)) {
        continue;
      }

      if (seen.has(entry)) {
        continue;
      }

      seen.add(entry);
      normalized.push(entry);
    }
  }

  for (const id of catalogIds) {
    if (!seen.has(id)) {
      normalized.push(id);
    }
  }

  return normalized;
}

export function normalizeTopbarVisibleUtilities(
  value: unknown,
  order: readonly TopbarUtilityId[]
): TopbarUtilityId[] {
  if (!Array.isArray(value)) {
    return [...TOPBAR_UTILITY_DEFAULT_PINNED];
  }

  if (value.length === 0) {
    return [];
  }

  const visibleSet = new Set<TopbarUtilityId>();

  for (const entry of value) {
    if (typeof entry !== "string" || !isTopbarUtilityId(entry)) {
      continue;
    }

    visibleSet.add(entry);
  }

  return order
    .filter((id) => visibleSet.has(id))
    .slice(0, TOPBAR_UTILITY_MAX_PINNED);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeState(value: unknown): TopbarUtilitiesState {
  if (Array.isArray(value)) {
    const visible = normalizeTopbarVisibleUtilities(value, allCatalogIds());
    const order = normalizeOrder([
      ...visible,
      ...allCatalogIds().filter((id) => !visible.includes(id)),
    ]);

    return {
      order,
      visible: normalizeTopbarVisibleUtilities(value, order),
    };
  }

  if (isRecord(value)) {
    const order = normalizeOrder(value.order);
    const visible = normalizeTopbarVisibleUtilities(value.visible, order);

    return { order, visible };
  }

  return {
    order: normalizeOrder(allCatalogIds()),
    visible: [...TOPBAR_UTILITY_DEFAULT_PINNED],
  };
}

const TOPBAR_UTILITIES_SERVER_SNAPSHOT = normalizeState(null);

const snapshotCache = new Map<
  string,
  { marker: string; snapshot: TopbarUtilitiesState }
>();

function readRawStorage(scope: TopbarUtilitiesScope): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = getTopbarUtilitiesStorageKey(scope);
  const scoped = window.localStorage.getItem(storageKey);

  if (scoped) {
    return scoped;
  }

  const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!legacy) {
    return null;
  }

  window.localStorage.setItem(storageKey, legacy);
  return legacy;
}

function refreshClientSnapshotFromStorage(
  scope: TopbarUtilitiesScope
): TopbarUtilitiesState {
  if (typeof window === "undefined") {
    return TOPBAR_UTILITIES_SERVER_SNAPSHOT;
  }

  const storageKey = getTopbarUtilitiesStorageKey(scope);
  const raw = readRawStorage(scope);
  const storageMarker = raw ?? "";

  const cached = snapshotCache.get(storageKey);

  if (cached && cached.marker === storageMarker) {
    return cached.snapshot;
  }

  if (!raw) {
    snapshotCache.set(storageKey, {
      marker: storageMarker,
      snapshot: TOPBAR_UTILITIES_SERVER_SNAPSHOT,
    });
    return TOPBAR_UTILITIES_SERVER_SNAPSHOT;
  }

  try {
    const snapshot = normalizeState(JSON.parse(raw));
    snapshotCache.set(storageKey, { marker: storageMarker, snapshot });
    return snapshot;
  } catch {
    snapshotCache.set(storageKey, {
      marker: storageMarker,
      snapshot: TOPBAR_UTILITIES_SERVER_SNAPSHOT,
    });
    return TOPBAR_UTILITIES_SERVER_SNAPSHOT;
  }
}

function invalidateSnapshotCache(storageKey?: string): void {
  if (storageKey) {
    snapshotCache.delete(storageKey);
    return;
  }

  snapshotCache.clear();
}

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function normalizeTopbarUtilitiesState(
  state: TopbarUtilitiesState
): TopbarUtilitiesState {
  return normalizeState(state);
}

export function getTopbarUtilitiesServerSnapshot(): TopbarUtilitiesState {
  return TOPBAR_UTILITIES_SERVER_SNAPSHOT;
}

export function subscribeTopbarUtilities(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  const onStorage = (event: StorageEvent): void => {
    if (!isTopbarUtilitiesStorageKey(event.key)) {
      return;
    }

    invalidateSnapshotCache(event.key ?? undefined);
    onStoreChange();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(onStoreChange);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function readTopbarUtilitiesState(
  scope: TopbarUtilitiesScope = DEFAULT_TOPBAR_UTILITIES_SCOPE
): TopbarUtilitiesState {
  return refreshClientSnapshotFromStorage(scope);
}

export function writeTopbarUtilitiesState(
  state: TopbarUtilitiesState,
  scope: TopbarUtilitiesScope = DEFAULT_TOPBAR_UTILITIES_SCOPE
): TopbarUtilitiesState {
  const normalized = normalizeState(state);

  if (typeof window !== "undefined") {
    const storageKey = getTopbarUtilitiesStorageKey(scope);
    const serialized = JSON.stringify(normalized);
    window.localStorage.setItem(storageKey, serialized);
    snapshotCache.set(storageKey, {
      marker: serialized,
      snapshot: normalized,
    });
    emitChange();
  }

  return normalized;
}

export function getTopbarVisibleUtilityIds(
  state: TopbarUtilitiesState
): TopbarUtilityId[] {
  const visibleSet = new Set(state.visible);

  return state.order.filter((id) => visibleSet.has(id));
}

export function reorderTopbarUtilityIds(
  orderedIds: readonly TopbarUtilityId[],
  sourceId: TopbarUtilityId,
  targetId: TopbarUtilityId
): TopbarUtilityId[] {
  if (sourceId === targetId) {
    return [...orderedIds];
  }

  const next = [...orderedIds];
  const sourceIndex = next.indexOf(sourceId);
  const targetIndex = next.indexOf(targetId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return next;
  }

  next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, sourceId);

  return next;
}

export function reorderTopbarVisibleUtilities(
  state: TopbarUtilitiesState,
  sourceId: TopbarUtilityId,
  targetId: TopbarUtilityId
): TopbarUtilitiesState {
  const visible = getTopbarVisibleUtilityIds(state);

  if (sourceId === targetId) {
    return state;
  }

  const sourceIndex = visible.indexOf(sourceId);
  const targetIndex = visible.indexOf(targetId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return state;
  }

  const reorderedVisible = reorderTopbarUtilityIds(visible, sourceId, targetId);
  const visibleSet = new Set(reorderedVisible);

  return {
    order: [
      ...reorderedVisible,
      ...state.order.filter((id) => !visibleSet.has(id)),
    ],
    visible: reorderedVisible,
  };
}
