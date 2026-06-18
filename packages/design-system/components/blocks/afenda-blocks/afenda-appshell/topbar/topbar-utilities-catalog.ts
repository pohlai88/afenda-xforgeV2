import {
  Activity,
  Bell,
  Calendar,
  CircleQuestionMark,
  ClipboardList,
  DatabaseBackup,
  Keyboard,
  Lightbulb,
  LineChart,
  MessageSquareWarning,
  MessagesSquare,
  MonitorCog,
  ScanSearch,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { createElement, type ReactElement } from "react";
import { topbarUtilityIconClass } from "./topbar-recipes";

export const TOPBAR_UTILITY_MAX_PINNED = 6;

export type TopbarUtilityId =
  | "advisor-center"
  | "calendar"
  | "clipboard-list"
  | "display-settings"
  | "feedback"
  | "help"
  | "keyboard-shortcuts"
  | "line-chart"
  | "messenger"
  | "network-diagnosis"
  | "notifications"
  | "search"
  | "settings"
  | "storage-backup";

export type TopbarUtilityActionKind =
  | "feedback-menu"
  | "help"
  | "keyboard-shortcuts"
  | "notifications-menu"
  | "search"
  | "settings"
  | "stub";

export interface TopbarUtilityDefinition {
  readonly action: TopbarUtilityActionKind;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly id: TopbarUtilityId;
  readonly label: string;
}

export const TOPBAR_UTILITY_CATALOG: readonly TopbarUtilityDefinition[] = [
  {
    action: "help",
    description: "Open help and support resources.",
    id: "help",
    label: "Help",
    icon: CircleQuestionMark,
  },
  {
    action: "stub",
    description: "Tips and guided suggestions.",
    id: "advisor-center",
    label: "Advisor center",
    icon: Lightbulb,
  },
  {
    action: "keyboard-shortcuts",
    description: "View and customize workspace shortcuts.",
    id: "keyboard-shortcuts",
    label: "Keyboard shortcuts",
    icon: Keyboard,
  },
  {
    action: "stub",
    description: "Check connectivity and service health.",
    id: "network-diagnosis",
    label: "Network diagnosis",
    icon: Activity,
  },
  {
    action: "stub",
    description: "Open team messages and chats.",
    id: "messenger",
    label: "Messenger",
    icon: MessagesSquare,
  },
  {
    action: "stub",
    description: "View your schedule and events.",
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
  },
  {
    action: "stub",
    description: "Track tasks and follow-ups.",
    id: "clipboard-list",
    label: "Tasks",
    icon: ClipboardList,
  },
  {
    action: "stub",
    description: "Open analytics and reports.",
    id: "line-chart",
    label: "Analytics",
    icon: LineChart,
  },
  {
    action: "settings",
    description: "Workspace appearance and preferences.",
    id: "settings",
    label: "Workspace settings",
    icon: Settings2,
  },
  {
    action: "settings",
    description: "Theme and personal display preferences.",
    id: "display-settings",
    label: "Display settings",
    icon: MonitorCog,
  },
  {
    action: "feedback-menu",
    description: "Send bugs or product ideas.",
    id: "feedback",
    label: "Feedback",
    icon: MessageSquareWarning,
  },
  {
    action: "stub",
    description: "Manage files and backups.",
    id: "storage-backup",
    label: "Storage and backup",
    icon: DatabaseBackup,
  },
  {
    action: "notifications-menu",
    description: "Alerts, inbox, and notification settings.",
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    action: "search",
    description: "Search commands and navigate the workspace.",
    id: "search",
    label: "Quick search",
    icon: ScanSearch,
  },
];

export const TOPBAR_UTILITY_DEFAULT_PINNED: readonly TopbarUtilityId[] = [
  "keyboard-shortcuts",
  "network-diagnosis",
  "messenger",
  "notifications",
  "search",
];

const utilityCatalogById = new Map(
  TOPBAR_UTILITY_CATALOG.map((entry) => [entry.id, entry])
);

const utilityCatalogIds = new Set<string>(
  TOPBAR_UTILITY_CATALOG.map((entry) => entry.id)
);

export function isTopbarUtilityId(value: string): value is TopbarUtilityId {
  return utilityCatalogIds.has(value);
}

export function getTopbarUtilityDefinition(
  id: TopbarUtilityId
): TopbarUtilityDefinition {
  const definition = utilityCatalogById.get(id);

  if (!definition) {
    throw new Error(`Unknown topbar utility: ${id}`);
  }

  return definition;
}

export function renderTopbarUtilityIcon(id: TopbarUtilityId): ReactElement {
  const definition = getTopbarUtilityDefinition(id);

  return createElement(definition.icon, {
    className: topbarUtilityIconClass,
  });
}

export function getTopbarUtilitySlotId(id: TopbarUtilityId): string {
  return `app-topbar-utility-${id}`;
}
