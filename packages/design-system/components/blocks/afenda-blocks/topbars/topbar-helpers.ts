import type { TopbarSidebarControlProps } from "./topbar-types";

export function resolveTopbarSidebarControl(
  sidebarControl?: boolean | TopbarSidebarControlProps
): TopbarSidebarControlProps | null {
  if (sidebarControl === true) {
    return {};
  }

  if (sidebarControl === false || sidebarControl === undefined) {
    return null;
  }

  return sidebarControl;
}
