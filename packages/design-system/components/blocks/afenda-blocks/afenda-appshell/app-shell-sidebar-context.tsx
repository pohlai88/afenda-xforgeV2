"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  persistSidebarBehaviorMode,
  readSidebarBehaviorCookie,
  type SidebarBehaviorMode,
} from "../../../afenda-ui/sidebar-behavior";
import { blockRecipe } from "../../block-recipes";
import { cn } from "../../../../lib/utils";
import { appShellSidebarContextWrapClass } from "./app-shell-recipes";
import {
  resolveAppShellSidebarActiveWidth,
  resolveAppShellSidebarExpanded,
} from "./app-shell-sidebar-utils";

interface AppShellSidebarContextValue {
  readonly behaviorMode: SidebarBehaviorMode;
  readonly collapsed: boolean;
  readonly hoverPeek: boolean;
  readonly isExpanded: boolean;
  readonly setBehaviorMode: (mode: SidebarBehaviorMode) => void;
  readonly setCollapsed: (collapsed: boolean) => void;
  readonly setHoverPeek: (hoverPeek: boolean) => void;
  readonly sidebarActiveWidth: string;
  readonly toggleSidebar: () => void;
}

const AppShellSidebarContext = createContext<AppShellSidebarContextValue | null>(
  null
);

export function AppShellSidebarProvider({
  children,
  defaultBehaviorMode = "expanded",
}: {
  readonly children: ReactNode;
  readonly defaultBehaviorMode?: SidebarBehaviorMode;
}) {
  const [behaviorMode, setBehaviorModeState] =
    useState<SidebarBehaviorMode>(defaultBehaviorMode);
  const [hoverPeek, setHoverPeek] = useState(false);

  useEffect(() => {
    const fromCookie = readSidebarBehaviorCookie();

    if (fromCookie) {
      setBehaviorModeState(fromCookie);
    }
  }, []);

  const setBehaviorMode = useCallback((mode: SidebarBehaviorMode) => {
    setBehaviorModeState(mode);
    setHoverPeek(false);
    persistSidebarBehaviorMode(mode);
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setBehaviorMode(collapsed ? "icon" : "expanded");
  }, [setBehaviorMode]);

  const toggleSidebar = useCallback(() => {
    setBehaviorMode(behaviorMode === "expanded" ? "icon" : "expanded");
  }, [behaviorMode, setBehaviorMode]);

  const isExpanded = resolveAppShellSidebarExpanded(behaviorMode, hoverPeek);
  const sidebarActiveWidth = resolveAppShellSidebarActiveWidth(
    behaviorMode,
    hoverPeek
  );

  const value = useMemo(
    () => ({
      behaviorMode,
      collapsed: !isExpanded,
      hoverPeek,
      isExpanded,
      setBehaviorMode,
      setCollapsed,
      setHoverPeek,
      sidebarActiveWidth,
      toggleSidebar,
    }),
    [
      behaviorMode,
      hoverPeek,
      isExpanded,
      setBehaviorMode,
      setCollapsed,
      sidebarActiveWidth,
      toggleSidebar,
    ]
  );

  return (
    <AppShellSidebarContext.Provider value={value}>
      <span
        className={cn(blockRecipe("blockShell"), appShellSidebarContextWrapClass)}
        data-slot="app-shell-sidebar-context"
      >
        {children}
      </span>
    </AppShellSidebarContext.Provider>
  );
}

export function useAppShellSidebar(): AppShellSidebarContextValue {
  const context = useContext(AppShellSidebarContext);

  if (!context) {
    throw new Error("useAppShellSidebar must be used within AppShellSidebarProvider.");
  }

  return context;
}
