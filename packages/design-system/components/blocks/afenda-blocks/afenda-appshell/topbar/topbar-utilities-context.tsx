"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";
import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { toast } from "sonner";
import {
  TOPBAR_UTILITY_CATALOG,
  TOPBAR_UTILITY_DEFAULT_PINNED,
  getTopbarUtilityDefinition,
  type TopbarUtilityId,
} from "./topbar-utilities-catalog";
import {
  DEFAULT_TOPBAR_UTILITIES_SCOPE,
  getTopbarUtilitiesServerSnapshot,
  getTopbarVisibleUtilityIds,
  normalizeTopbarUtilitiesState,
  readTopbarUtilitiesState,
  subscribeTopbarUtilities,
  writeTopbarUtilitiesState,
  type TopbarUtilitiesScope,
  type TopbarUtilitiesState,
} from "./topbar-utilities-storage";
import { topbarUtilitiesContextWrapClass } from "./topbar-recipes";

export interface TopbarUtilitiesController {
  readonly feedbackMenuOpen: boolean;
  readonly handleUtilityAction: (utilityId: TopbarUtilityId) => void;
  readonly persistUtilitiesState: (state: TopbarUtilitiesState) => void;
  readonly preview: boolean;
  readonly setFeedbackMenuOpen: (open: boolean) => void;
  readonly tenantId: string;
  readonly userId: string;
  readonly utilitiesState: TopbarUtilitiesState;
  readonly visibleIds: readonly TopbarUtilityId[];
}

const TopbarUtilitiesContext = createContext<TopbarUtilitiesController | null>(
  null
);

export function useTopbarUtilities(): TopbarUtilitiesController {
  const context = useContext(TopbarUtilitiesContext);

  if (!context) {
    throw new Error(
      "useTopbarUtilities must be used within TopbarUtilitiesProvider."
    );
  }

  return context;
}

export function TopbarUtilitiesProvider({
  children,
  preview = false,
  tenantId = DEFAULT_TOPBAR_UTILITIES_SCOPE.tenantId,
  userId = DEFAULT_TOPBAR_UTILITIES_SCOPE.userId,
}: {
  readonly children: ReactNode;
  readonly preview?: boolean;
  readonly tenantId?: string;
  readonly userId?: string;
}): ReactElement {
  const controller = useTopbarUtilitiesControllerValue({
    preview,
    tenantId,
    userId,
  });

  return (
    <TopbarUtilitiesContext.Provider value={controller}>
      <span
        className={cn(blockRecipe("blockShell"), topbarUtilitiesContextWrapClass)}
        data-slot="app-topbar-utilities-context"
      >
        {children}
      </span>
    </TopbarUtilitiesContext.Provider>
  );
}

function useTopbarUtilitiesControllerValue({
  preview = false,
  tenantId = DEFAULT_TOPBAR_UTILITIES_SCOPE.tenantId,
  userId = DEFAULT_TOPBAR_UTILITIES_SCOPE.userId,
}: {
  readonly preview?: boolean;
  readonly tenantId?: string;
  readonly userId?: string;
}): TopbarUtilitiesController {
  const [feedbackMenuOpen, setFeedbackMenuOpen] = useState(false);
  const scope = useMemo<TopbarUtilitiesScope>(
    () => ({ tenantId, userId }),
    [tenantId, userId]
  );
  const utilitiesStateFromStore = useSyncExternalStore(
    subscribeTopbarUtilities,
    () => readTopbarUtilitiesState(scope),
    getTopbarUtilitiesServerSnapshot
  );
  const [previewUtilitiesState, setPreviewUtilitiesState] =
    useState<TopbarUtilitiesState>(() => ({
      order: [...TOPBAR_UTILITY_CATALOG.map((entry) => entry.id)],
      visible: [...TOPBAR_UTILITY_DEFAULT_PINNED],
    }));

  const utilitiesState = preview
    ? previewUtilitiesState
    : utilitiesStateFromStore;
  const visibleIds = getTopbarVisibleUtilityIds(utilitiesState);

  const persistUtilitiesState = useCallback(
    (next: TopbarUtilitiesState): void => {
      const normalized = normalizeTopbarUtilitiesState(next);

      if (preview) {
        setPreviewUtilitiesState(normalized);
        return;
      }

      writeTopbarUtilitiesState(normalized, scope);
    },
    [preview, scope]
  );

  const handleUtilityAction = useCallback((utilityId: TopbarUtilityId): void => {
    const definition = getTopbarUtilityDefinition(utilityId);

    switch (definition.action) {
      case "help":
        toast.message("Help is not wired yet.");
        return;
      case "feedback-menu":
        setFeedbackMenuOpen(true);
        return;
      case "keyboard-shortcuts":
        toast.message("Keyboard shortcuts panel is not wired yet.");
        return;
      case "notifications-menu":
        toast.message("Notifications panel is not wired yet.");
        return;
      case "search":
        toast.message("Quick search is not wired yet.");
        return;
      case "settings":
        toast.message(`${definition.label} is not wired yet.`);
        return;
      case "stub":
        toast.message(`${definition.label} is not wired yet.`);
        return;
      default: {
        const exhaustiveAction: never = definition.action;
        throw new Error(`Unhandled topbar utility action: ${exhaustiveAction}`);
      }
    }
  }, []);

  return useMemo(
    () => ({
      feedbackMenuOpen,
      handleUtilityAction,
      persistUtilitiesState,
      preview,
      setFeedbackMenuOpen,
      tenantId,
      userId,
      utilitiesState,
      visibleIds,
    }),
    [
      feedbackMenuOpen,
      handleUtilityAction,
      persistUtilitiesState,
      preview,
      tenantId,
      userId,
      utilitiesState,
      visibleIds,
    ]
  );
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
