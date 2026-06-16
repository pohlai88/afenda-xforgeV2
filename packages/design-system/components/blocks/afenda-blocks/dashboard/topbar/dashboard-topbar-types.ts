import type {
  TopbarBrandDiskProps,
  TopbarScopeSwitcherConfig,
  TopbarSidebarControlProps,
  TopbarUtilitiesRailProps,
} from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface DashboardNavTopbarProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
  readonly brand?: TopbarBrandDiskProps;
  readonly scopeSwitchers?: readonly TopbarScopeSwitcherConfig[];
  readonly sidebarControl?: boolean | TopbarSidebarControlProps;
  readonly trailing?: ReactNode;
  readonly utilitiesRail?: TopbarUtilitiesRailProps;
}
