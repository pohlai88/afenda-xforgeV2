import {
  ClipboardCheckIcon,
  FileClockIcon,
  FilesIcon,
  LockIcon,
  PlusIcon,
  ScaleIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";
import type {
  SidebarLabelGroup,
  SidebarNavGroup,
  SidebarQuickAction,
} from "./sidebar-types";

export const DEMO_ERP_SIDEBAR_QUICK_ACTIONS: readonly SidebarQuickAction[] = [
  {
    id: "new-case",
    href: "#approval-workspace",
    icon: PlusIcon,
    shortcut: "⌘N",
    topic: "New case",
    description: "Start an approval or control case.",
  },
  {
    id: "search",
    href: "#approval-workspace",
    icon: SearchIcon,
    shortcut: "⌘K",
    topic: "Search",
    description: "Find records, evidence, and routes.",
  },
  {
    id: "favourite",
    href: "#approval-workspace",
    icon: StarIcon,
    shortcut: "⌘1",
    topic: "Favourite",
    description: "Jump to your pinned workspace view.",
  },
];

export const DEMO_ERP_SIDEBAR_NAV_GROUPS: readonly SidebarNavGroup[] = [
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "approvals",
        label: "Approvals",
        href: "#approval-workspace",
        icon: ClipboardCheckIcon,
        selected: true,
        badge: "14",
        description: "Open assigned approvals and sign-off queues.",
      },
      {
        id: "evidence",
        label: "Evidence",
        href: "#approval-workspace",
        icon: FilesIcon,
        badge: "84%",
        description: "Audit packets and supporting files.",
      },
      {
        id: "posting",
        label: "Batch posting",
        href: "#approval-workspace",
        icon: ScaleIcon,
        description: "Batch posting and reconciliation runs.",
      },
      {
        id: "policy-locks",
        label: "Policy locks",
        href: "#approval-workspace",
        icon: LockIcon,
        description: "Frozen controls and policy exceptions.",
      },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    items: [
      {
        id: "audit",
        label: "Audit trail",
        href: "#approval-workspace",
        icon: FileClockIcon,
        description: "Immutable activity and change history.",
      },
      {
        id: "settings",
        label: "Workspace settings",
        href: "#approval-workspace",
        icon: SettingsIcon,
        description: "Workspace and tenant configuration.",
      },
    ],
  },
];

export const DEMO_ERP_SIDEBAR_LABEL_GROUPS: readonly SidebarLabelGroup[] = [
  {
    id: "workflow-labels",
    label: "Labels",
    items: [
      { id: "live", label: "Live", tone: "positive" },
      { id: "review", label: "Review", tone: "warning" },
      { id: "blocked", label: "Blocked", tone: "critical" },
      { id: "sync", label: "Sync pending", tone: "info" },
    ],
  },
];
