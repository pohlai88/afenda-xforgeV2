"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AfendaAppContentLayoutContextValue {
  readonly bottomDrawerOpen: boolean;
  readonly leftRailOpen: boolean;
  readonly rightRailOpen: boolean;
  readonly setBottomDrawerOpen: (open: boolean) => void;
  readonly setLeftRailOpen: (open: boolean) => void;
  readonly setRightRailOpen: (open: boolean) => void;
  readonly toggleBottomDrawer: () => void;
  readonly toggleLeftRail: () => void;
  readonly toggleRightRail: () => void;
}

const AfendaAppContentLayoutContext =
  createContext<AfendaAppContentLayoutContextValue | null>(null);

interface AfendaAppContentLayoutProviderProps {
  readonly children: ReactNode;
  readonly defaultBottomDrawerOpen?: boolean;
  readonly defaultLeftRailOpen?: boolean;
  readonly defaultRightRailOpen?: boolean;
}

export function AfendaAppContentLayoutProvider({
  children,
  defaultBottomDrawerOpen = false,
  defaultLeftRailOpen = true,
  defaultRightRailOpen = true,
}: AfendaAppContentLayoutProviderProps) {
  const [leftRailOpen, setLeftRailOpen] = useState(defaultLeftRailOpen);
  const [rightRailOpen, setRightRailOpen] = useState(defaultRightRailOpen);
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(
    defaultBottomDrawerOpen
  );

  const toggleLeftRail = useCallback(() => {
    setLeftRailOpen((current) => !current);
  }, []);

  const toggleRightRail = useCallback(() => {
    setRightRailOpen((current) => !current);
  }, []);

  const toggleBottomDrawer = useCallback(() => {
    setBottomDrawerOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      bottomDrawerOpen,
      leftRailOpen,
      rightRailOpen,
      setBottomDrawerOpen,
      setLeftRailOpen,
      setRightRailOpen,
      toggleBottomDrawer,
      toggleLeftRail,
      toggleRightRail,
    }),
    [
      bottomDrawerOpen,
      leftRailOpen,
      rightRailOpen,
      toggleBottomDrawer,
      toggleLeftRail,
      toggleRightRail,
    ]
  );

  return (
    <AfendaAppContentLayoutContext.Provider value={value}>
      {children}
    </AfendaAppContentLayoutContext.Provider>
  );
}

export function useAfendaAppContentLayout() {
  const context = useContext(AfendaAppContentLayoutContext);

  if (!context) {
    throw new Error(
      "useAfendaAppContentLayout must be used within AfendaAppContentLayoutProvider"
    );
  }

  return context;
}
