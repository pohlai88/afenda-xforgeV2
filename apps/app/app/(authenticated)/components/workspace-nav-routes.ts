import {
  flattenSidebarNavGroups,
  type SidebarNavGroup,
  type SidebarNavItem,
  type SidebarQuickAction,
} from "@repo/design-system/design-system";
import {
  AnchorIcon,
  BookOpenIcon,
  Building2Icon,
  LayoutDashboardIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
} from "lucide-react";

export const workspaceQuickActions: readonly SidebarQuickAction[] = [
  {
    id: "search",
    href: "/search?q=workspace",
    icon: SearchIcon,
    shortcut: "⌘K",
    topic: "Search",
    description: "Find records, evidence, and routes.",
  },
  {
    id: "content",
    href: "/cms",
    icon: PlusIcon,
    shortcut: "⌘N",
    topic: "New content",
    description: "Create or edit CMS documents.",
  },
  {
    id: "settings",
    href: "/account/security",
    icon: SettingsIcon,
    shortcut: "⌘,",
    topic: "Security",
    description: "Account security and session controls.",
  },
];

export const workspaceNavGroups: readonly SidebarNavGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        id: "overview",
        label: "Overview",
        href: "/",
        icon: LayoutDashboardIcon,
        match: "exact",
        description: "Workspace cockpit and activity summary.",
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "cms",
        label: "Content",
        href: "/cms",
        icon: BookOpenIcon,
        match: "prefix",
        description: "Manage localized CMS documents.",
      },
      {
        id: "webhooks",
        label: "Webhooks",
        href: "/webhooks",
        icon: AnchorIcon,
        match: "prefix",
        description: "Endpoints, deliveries, and event routing.",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      {
        id: "organization",
        label: "Organization",
        href: "/account/organization",
        icon: Building2Icon,
        match: "prefix",
        description: "Tenant scope and membership.",
      },
      {
        id: "security",
        label: "Security",
        href: "/account/security",
        icon: ShieldIcon,
        match: "prefix",
        shortcut: "⌘,",
        description: "Credentials, MFA, and session policy.",
      },
    ],
  },
];

export const workspacePaletteNavItems: readonly SidebarNavItem[] = [
  ...flattenSidebarNavGroups(workspaceNavGroups),
  {
    id: "search",
    label: "Search workspace",
    href: "/search?q=workspace",
    icon: SearchIcon,
    shortcut: "⌘K",
    description: "Find records, evidence, and routes.",
  },
];
