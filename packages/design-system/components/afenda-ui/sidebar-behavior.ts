export type SidebarBehaviorMode = "expanded" | "hover" | "icon";

export interface SidebarBehaviorOption {
  readonly description?: string;
  readonly id: SidebarBehaviorMode;
  readonly label: string;
}

export const SIDEBAR_BEHAVIOR_COOKIE_NAME = "afenda_sidebar_behavior";

export const SIDEBAR_BEHAVIOR_OPTIONS: readonly SidebarBehaviorOption[] = [
  {
    id: "expanded",
    label: "Expanded",
    description: "Keep the navigation rail fully open.",
  },
  {
    id: "icon",
    label: "Collapsed",
    description: "Pin the sidebar to icon width.",
  },
  {
    id: "hover",
    label: "Expand on hover",
    description: "Stay collapsed until the pointer enters the rail.",
  },
] as const;

export function isSidebarBehaviorMode(
  value: string | undefined
): value is SidebarBehaviorMode {
  return value === "expanded" || value === "icon" || value === "hover";
}

/** Resolve persisted sidebar behavior from a raw cookie value (server or client). */
export function resolveSidebarBehaviorMode(
  cookieValue: string | undefined
): SidebarBehaviorMode {
  return isSidebarBehaviorMode(cookieValue) ? cookieValue : "expanded";
}

export function readSidebarBehaviorCookie(): SidebarBehaviorMode | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${SIDEBAR_BEHAVIOR_COOKIE_NAME}=([^;]*)`)
  );
  const value = match?.[1];

  return isSidebarBehaviorMode(value) ? value : null;
}

export function persistSidebarBehaviorMode(mode: SidebarBehaviorMode): void {
  // biome-ignore lint/suspicious/noDocumentCookie: sidebar behavior is a non-sensitive UI preference used before Cookie Store API support is universal.
  document.cookie = [
    `${SIDEBAR_BEHAVIOR_COOKIE_NAME}=${mode}`,
    "path=/",
    "max-age=2592000",
    "SameSite=Lax",
  ].join("; ");
}

export function resolveInitialSidebarOpen(
  behaviorMode: SidebarBehaviorMode,
  defaultOpen: boolean
): boolean {
  if (behaviorMode === "expanded") {
    return true;
  }

  if (behaviorMode === "icon" || behaviorMode === "hover") {
    return false;
  }

  return defaultOpen;
}

export function resolveEffectiveSidebarOpen({
  behaviorMode,
  hoverPeek,
  open: _open,
}: {
  readonly behaviorMode: SidebarBehaviorMode;
  readonly hoverPeek: boolean;
  readonly open: boolean;
}): boolean {
  if (behaviorMode === "expanded") {
    return true;
  }

  if (behaviorMode === "hover") {
    return hoverPeek;
  }

  return false;
}
