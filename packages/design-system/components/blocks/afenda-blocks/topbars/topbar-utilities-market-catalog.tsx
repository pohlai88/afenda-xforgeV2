"use client";

import {
  ActivityIcon,
  BellIcon,
  CalendarDaysIcon,
  BugPlayIcon,
  FileClockIcon,
  FilesIcon,
  HatGlassesIcon,
  HelpCircleIcon,
  KeyboardIcon,
  LightbulbIcon,
  MessageSquareIcon,
  MessageSquareWarningIcon,
  MonitorCogIcon,
  PlugIcon,
  ProportionsIcon,
  ScaleIcon,
  SettingsIcon,
  UploadIcon,
  WorkflowIcon,
} from "lucide-react";
import type { TopbarUtilitiesMarketItem } from "./topbar-types";

const pinUtility = (
  item: Omit<TopbarUtilitiesMarketItem, "draggable">
): TopbarUtilitiesMarketItem => ({
  ...item,
  draggable: true,
});

export const DEFAULT_ERP_UTILITIES_MARKET_ITEMS: readonly TopbarUtilitiesMarketItem[] =
  [
    pinUtility({
      id: "help",
      label: "Help",
      description: "Operator docs and runbooks.",
      icon: <HelpCircleIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "feedback",
      label: "Feedback",
      description: "Send product feedback to the team.",
      icon: (
        <MessageSquareWarningIcon aria-hidden="true" className="size-4" />
      ),
    }),
    pinUtility({
      id: "advisor-center",
      label: "Advisor center",
      description: "Guided suggestions, nudges, and operator tips.",
      icon: <LightbulbIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "notifications",
      label: "Alerts",
      description: "Review alerts and delivery status.",
      icon: <BellIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "tasks",
      label: "Tasks",
      description: "Open assigned tasks and queues.",
      icon: <BugPlayIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "calendar",
      label: "Calendar",
      description: "Close dates, approvals, and milestones.",
      icon: <CalendarDaysIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "reports",
      label: "Reports",
      description: "Operational and financial reports.",
      icon: <ProportionsIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "messenger",
      label: "Messenger",
      description: "Team messages, handoffs, and operator chat.",
      icon: <MessageSquareIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "search",
      label: "Search",
      description: "Find records, evidence, and routes.",
      icon: <HatGlassesIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "evidence",
      label: "Evidence",
      description: "Audit packets and supporting files.",
      icon: <FilesIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "posting",
      label: "Posting",
      description: "Batch posting and reconciliation.",
      icon: <ScaleIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "audit-trail",
      label: "Audit trail",
      description: "Immutable activity and change history.",
      icon: <FileClockIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "workflows",
      label: "Workflows",
      description: "Approval flows and automation.",
      icon: <WorkflowIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "import-export",
      label: "Import",
      description: "Bulk import and export jobs.",
      icon: <UploadIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "integrations",
      label: "Integrations",
      description: "Connectors, webhooks, and APIs.",
      icon: <PlugIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "diagnostics",
      label: "Diagnostics",
      description: "Service health, connectivity, and operational checks.",
      icon: <ActivityIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "settings",
      label: "Settings",
      description: "Workspace and tenant configuration.",
      icon: <SettingsIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "display-settings",
      label: "Display",
      description: "Density, theme, and operator display preferences.",
      icon: <MonitorCogIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "shortcuts",
      label: "Shortcuts",
      description: "Keyboard shortcuts reference.",
      icon: <KeyboardIcon aria-hidden="true" className="size-4" />,
      shortcut: "?",
    }),
  ];
