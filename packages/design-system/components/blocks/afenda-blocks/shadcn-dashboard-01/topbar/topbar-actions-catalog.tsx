"use client";

import {
  BellIcon,
  DownloadIcon,
  KeyboardIcon,
  MessageSquareWarningIcon,
  PanelLeftIcon,
  PrinterIcon,
  RefreshCwIcon,
} from "lucide-react";
import type { TopbarActionMenuItem } from "./topbar-types";

export const DEFAULT_ERP_ACTIONS_MENU_ITEMS: readonly TopbarActionMenuItem[] = [
  {
    id: "sidebar-control",
    label: "Sidebar layout",
    description: "Use the sidebar control in the topbar or footer rail.",
    icon: <PanelLeftIcon aria-hidden="true" className="size-4" />,
  },
  {
    id: "shortcuts",
    label: "Keyboard shortcuts",
    description: "Open the workspace shortcut reference.",
    icon: <KeyboardIcon aria-hidden="true" className="size-4" />,
    shortcut: "?",
  },
  {
    id: "refresh",
    label: "Refresh workspace",
    description: "Reload the current view and queue state.",
    icon: <RefreshCwIcon aria-hidden="true" className="size-4" />,
  },
  {
    id: "export",
    label: "Export view",
    description: "Export the current table or report.",
    icon: <DownloadIcon aria-hidden="true" className="size-4" />,
  },
  {
    id: "print",
    label: "Print",
    description: "Print the active screen or audit packet.",
    icon: <PrinterIcon aria-hidden="true" className="size-4" />,
  },
  {
    id: "notifications",
    label: "Notification settings",
    description: "Manage alert routing and delivery.",
    icon: <BellIcon aria-hidden="true" className="size-4" />,
    separatorBefore: true,
  },
  {
    id: "feedback",
    label: "Send feedback",
    description: "Share product feedback with the platform team.",
    icon: <MessageSquareWarningIcon aria-hidden="true" className="size-4" />,
  },
];
