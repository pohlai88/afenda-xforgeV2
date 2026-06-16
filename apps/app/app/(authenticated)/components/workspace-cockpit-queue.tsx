"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import type { CockpitQueueRowKey } from "./workspace-cockpit-data";
import { useWorkspaceKeyboardContext } from "./workspace-keyboard-provider";

interface CockpitQueueContextValue {
  readonly isRowSelected: (rowKey: CockpitQueueRowKey) => boolean;
  readonly registerRowRef: (
    rowKey: CockpitQueueRowKey,
    element: HTMLTableRowElement | null
  ) => void;
}

const CockpitQueueContext = createContext<CockpitQueueContextValue | null>(null);

interface CockpitQueueScopeProperties {
  readonly children: ReactNode;
  readonly rowKeys: readonly CockpitQueueRowKey[];
}

export function CockpitQueueScope({
  children,
  rowKeys,
}: CockpitQueueScopeProperties) {
  const { actions, state } = useWorkspaceKeyboardContext();
  const rowRefs = useRef(new Map<CockpitQueueRowKey, HTMLTableRowElement>());

  useEffect(() => {
    actions.registerQueueRowKeys(rowKeys);
    return () => actions.registerQueueRowKeys([]);
  }, [actions, rowKeys]);

  useEffect(() => {
    if (!state.selectedQueueRowKey) {
      return;
    }

    rowRefs.current
      .get(state.selectedQueueRowKey)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [state.selectedQueueRowKey]);

  const registerRowRef = useCallback(
    (rowKey: CockpitQueueRowKey, element: HTMLTableRowElement | null) => {
      if (element) {
        rowRefs.current.set(rowKey, element);
        return;
      }

      rowRefs.current.delete(rowKey);
    },
    []
  );

  const isRowSelected = useCallback(
    (rowKey: CockpitQueueRowKey) => state.selectedQueueRowKey === rowKey,
    [state.selectedQueueRowKey]
  );

  const value = useMemo(
    () => ({
      isRowSelected,
      registerRowRef,
    }),
    [isRowSelected, registerRowRef]
  );

  return (
    <CockpitQueueContext.Provider value={value}>
      {children}
    </CockpitQueueContext.Provider>
  );
}

function useCockpitQueue() {
  const context = useContext(CockpitQueueContext);

  if (!context) {
    throw new Error("useCockpitQueue must be used within CockpitQueueScope.");
  }

  return context;
}

export function useCockpitQueueRow(rowKey: CockpitQueueRowKey) {
  const { isRowSelected, registerRowRef } = useCockpitQueue();

  return {
    selected: isRowSelected(rowKey),
    setRowRef: (element: HTMLTableRowElement | null) =>
      registerRowRef(rowKey, element),
  };
}
