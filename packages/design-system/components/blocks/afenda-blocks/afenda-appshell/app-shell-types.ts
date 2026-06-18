import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface AfendaAppShellProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  readonly children?: ReactNode;
  readonly contentHeader?: ReactNode;
  readonly contentLeftRail?: ReactNode;
  readonly contentRightRail?: ReactNode;
  readonly footer?: ReactNode;
  readonly sidebar?: ReactNode;
  readonly topbar?: ReactNode;
}

export interface AfendaAppSidebarProps
  extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  readonly children?: ReactNode;
}

export interface AfendaAppTopbarProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
  readonly children?: ReactNode;
}

export interface AfendaAppFooterProps
  extends Omit<ComponentPropsWithoutRef<"footer">, "children"> {
  readonly children?: ReactNode;
}

export interface AfendaAppContentProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  readonly children?: ReactNode;
  readonly header?: ReactNode;
  readonly leftRail?: ReactNode;
  readonly rightRail?: ReactNode;
}

export interface AfendaAppContentHeaderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  readonly children?: ReactNode;
}

export interface AfendaAppContentLeftRailProps
  extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  readonly children?: ReactNode;
}

export interface AfendaAppContentRightRailProps
  extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  readonly children?: ReactNode;
}
