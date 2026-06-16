"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CockpitQueueRowKey } from "./workspace-cockpit-data";

export interface WorkspaceKeyboardState {
  readonly commandOpen: boolean;
  readonly selectedQueueRowKey: CockpitQueueRowKey | null;
  readonly shortcutsOpen: boolean;
}

export interface WorkspaceKeyboardActions {
  readonly openCommandPalette: () => void;
  readonly openShortcutsDialog: () => void;
  readonly registerQueueRowKeys: (keys: readonly CockpitQueueRowKey[]) => void;
  readonly setCommandOpen: (open: boolean) => void;
  readonly setShortcutsOpen: (open: boolean) => void;
}

export interface WorkspaceKeyboardContextValue {
  readonly actions: WorkspaceKeyboardActions;
  readonly state: WorkspaceKeyboardState;
}

const WorkspaceKeyboardContext =
  createContext<WorkspaceKeyboardContextValue | null>(null);

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    target.isContentEditable ||
    target.closest("[contenteditable='true']") !== null
  );
}

interface WorkspaceKeyboardProviderProperties {
  readonly children: ReactNode;
  readonly onEditSelectedRow?: (rowKey: CockpitQueueRowKey) => void;
}

export function WorkspaceKeyboardProvider({
  children,
  onEditSelectedRow,
}: WorkspaceKeyboardProviderProperties) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [queueRowKeys, setQueueRowKeys] = useState<readonly CockpitQueueRowKey[]>(
    []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onEditSelectedRowRef = useRef(onEditSelectedRow);
  const queueRowKeysRef = useRef(queueRowKeys);
  const selectedIndexRef = useRef(selectedIndex);
  const commandOpenRef = useRef(commandOpen);
  const shortcutsOpenRef = useRef(shortcutsOpen);

  onEditSelectedRowRef.current = onEditSelectedRow;
  queueRowKeysRef.current = queueRowKeys;
  selectedIndexRef.current = selectedIndex;
  commandOpenRef.current = commandOpen;
  shortcutsOpenRef.current = shortcutsOpen;

  const selectedQueueRowKey = queueRowKeys[selectedIndex] ?? null;

  const registerQueueRowKeys = useCallback(
    (keys: readonly CockpitQueueRowKey[]) => {
      queueRowKeysRef.current = keys;
      selectedIndexRef.current = 0;
      setQueueRowKeys(keys);
      setSelectedIndex(0);
    },
    []
  );

  const openCommandPalette = useCallback(() => {
    setCommandOpen(true);
  }, []);

  const openShortcutsDialog = useCallback(() => {
    setShortcutsOpen(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (commandOpenRef.current || shortcutsOpenRef.current) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "?" || (event.shiftKey && key === "/")) {
        event.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (queueRowKeysRef.current.length === 0) {
        return;
      }

      if (key === "j") {
        event.preventDefault();
        setSelectedIndex((current) => {
          const next = Math.min(
            queueRowKeysRef.current.length - 1,
            current + 1
          );
          selectedIndexRef.current = next;
          return next;
        });
        return;
      }

      if (key === "k") {
        event.preventDefault();
        setSelectedIndex((current) => {
          const next = Math.max(0, current - 1);
          selectedIndexRef.current = next;
          return next;
        });
        return;
      }

      if (key === "e") {
        const rowKey =
          queueRowKeysRef.current[selectedIndexRef.current] ?? null;

        if (rowKey) {
          event.preventDefault();
          onEditSelectedRowRef.current?.(rowKey);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const actions = useMemo<WorkspaceKeyboardActions>(
    () => ({
      openCommandPalette,
      openShortcutsDialog,
      registerQueueRowKeys,
      setCommandOpen,
      setShortcutsOpen,
    }),
    [openCommandPalette, openShortcutsDialog, registerQueueRowKeys]
  );

  const state = useMemo<WorkspaceKeyboardState>(
    () => ({
      commandOpen,
      selectedQueueRowKey,
      shortcutsOpen,
    }),
    [commandOpen, selectedQueueRowKey, shortcutsOpen]
  );

  const value = useMemo(
    () => ({
      actions,
      state,
    }),
    [actions, state]
  );

  return (
    <WorkspaceKeyboardContext.Provider value={value}>
      {children}
    </WorkspaceKeyboardContext.Provider>
  );
}

export function useWorkspaceKeyboardContext() {
  const context = useContext(WorkspaceKeyboardContext);

  if (!context) {
    throw new Error(
      "useWorkspaceKeyboardContext must be used within WorkspaceKeyboardProvider."
    );
  }

  return context;
}

export function useWorkspaceKeyboard() {
  const { actions, state } = useWorkspaceKeyboardContext();

  return {
    ...state,
    ...actions,
  };
}

export function useOptionalWorkspaceKeyboard() {
  const context = useContext(WorkspaceKeyboardContext);

  if (!context) {
    return null;
  }

  return {
    ...context.state,
    ...context.actions,
  };
}
