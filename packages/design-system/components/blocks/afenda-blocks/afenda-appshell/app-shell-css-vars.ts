import type { CSSProperties } from "react";

export interface AfendaAppShellCssVars extends CSSProperties {
  readonly "--app-shell-footer-height"?: string;
  readonly "--app-shell-rail-width"?: string;
  readonly "--app-shell-sidebar-active-width"?: string;
  readonly "--app-shell-sidebar-icon-rail-width"?: string;
  readonly "--app-shell-sidebar-width"?: string;
  readonly "--app-shell-topbar-height"?: string;
}

export interface AfendaAppContentCssVars extends CSSProperties {
  readonly "--app-shell-bottom-drawer-height"?: string;
  readonly "--app-shell-content-header-trigger-size"?: string;
  readonly "--app-shell-content-left-rail-width"?: string;
  readonly "--app-shell-content-right-rail-width"?: string;
}
