import type { SidebarBehaviorMode } from "../../../afenda-ui/sidebar-behavior";

function resolveAppShellSidebarExpanded(
  behaviorMode: SidebarBehaviorMode,
  hoverPeek: boolean
): boolean {
  if (behaviorMode === "expanded") {
    return true;
  }

  if (behaviorMode === "hover") {
    return hoverPeek;
  }

  return false;
}

function resolveAppShellSidebarActiveWidth(
  behaviorMode: SidebarBehaviorMode,
  hoverPeek: boolean
): string {
  return resolveAppShellSidebarExpanded(behaviorMode, hoverPeek)
    ? "var(--app-shell-sidebar-width)"
    : "var(--app-shell-sidebar-icon-rail-width)";
}

export { resolveAppShellSidebarActiveWidth, resolveAppShellSidebarExpanded };
