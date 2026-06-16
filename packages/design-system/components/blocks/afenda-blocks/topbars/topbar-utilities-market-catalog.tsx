"use client";

import {
  ActivityIcon,
  BellIcon,
  BugPlayIcon,
  CalendarDaysIcon,
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
      searchAliases: ["support", "documentation", "runbook"],
      icon: <HelpCircleIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "feedback",
      label: "Feedback",
      description: "Send product feedback to the team.",
      searchAliases: ["bug", "idea", "request", "comment"],
      icon: <MessageSquareWarningIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "advisor-center",
      label: "Advisor center",
      description: "Guided suggestions, nudges, and operator tips.",
      searchAliases: ["tips", "assistant", "guidance", "nudges"],
      icon: <LightbulbIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "notifications",
      label: "Alerts",
      description: "Review alerts and delivery status.",
      searchAliases: ["notifications", "inbox", "notices", "status"],
      icon: <BellIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "tasks",
      label: "Tasks",
      description: "Open assigned tasks and queues.",
      searchAliases: ["queue", "work", "todo", "assigned"],
      icon: <BugPlayIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "calendar",
      label: "Calendar",
      description: "Close dates, approvals, and milestones.",
      searchAliases: ["schedule", "dates", "milestones"],
      icon: <CalendarDaysIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "reports",
      label: "Reports",
      description: "Operational and financial reports.",
      searchAliases: ["analytics", "reporting", "metrics"],
      icon: <ProportionsIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "messenger",
      label: "Messenger",
      description: "Team messages, handoffs, and operator chat.",
      searchAliases: ["chat", "messages", "dm", "conversation"],
      icon: <MessageSquareIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "search",
      label: "Search",
      description: "Find records, evidence, and routes.",
      searchAliases: ["find", "lookup", "records", "routes"],
      icon: <HatGlassesIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "evidence",
      label: "Evidence",
      description: "Audit packets and supporting files.",
      searchAliases: ["files", "documents", "audit", "attachments"],
      icon: <FilesIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "posting",
      label: "Posting",
      description: "Batch posting and reconciliation.",
      searchAliases: ["reconciliation", "batch", "ledger"],
      icon: <ScaleIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "audit-trail",
      label: "Audit trail",
      description: "Immutable activity and change history.",
      searchAliases: ["history", "activity", "log", "timeline"],
      icon: <FileClockIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "workflows",
      label: "Workflows",
      description: "Approval flows and automation.",
      searchAliases: ["approvals", "automation", "flow"],
      icon: <WorkflowIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "import-export",
      label: "Import",
      description: "Bulk import and export jobs.",
      searchAliases: ["export", "upload", "download", "bulk"],
      icon: <UploadIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "integrations",
      label: "Integrations",
      description: "Connectors, webhooks, and APIs.",
      searchAliases: ["connectors", "webhooks", "api", "apps"],
      icon: <PlugIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "diagnostics",
      label: "Diagnostics",
      description: "Service health, connectivity, and operational checks.",
      searchAliases: ["health", "network", "checks", "status"],
      icon: <ActivityIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "settings",
      label: "Settings",
      description: "Workspace and tenant configuration.",
      searchAliases: ["preferences", "config", "workspace", "tenant"],
      icon: <SettingsIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "display-settings",
      label: "Display",
      description: "Density, theme, and operator display preferences.",
      searchAliases: ["appearance", "theme", "density", "layout"],
      icon: <MonitorCogIcon aria-hidden="true" className="size-4" />,
    }),
    pinUtility({
      id: "shortcuts",
      label: "Shortcuts",
      description: "Keyboard shortcuts reference.",
      searchAliases: ["keyboard", "hotkeys", "commands"],
      icon: <KeyboardIcon aria-hidden="true" className="size-4" />,
      shortcut: "?",
    }),
  ];
