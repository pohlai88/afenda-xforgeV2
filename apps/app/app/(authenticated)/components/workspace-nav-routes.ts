import {
  flattenSidebarNavGroups,
  type SidebarNavGroup,
  type SidebarNavItem,
  type SidebarQuickAction,
} from "@repo/design-system/design-system";
import {
  BellIcon,
  BoxesIcon,
  FactoryIcon,
  FolderOpenIcon,
  HouseIcon,
  PlusIcon,
  SettingsIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SquareKanbanIcon,
  TrendingUpIcon,
  UserRoundCogIcon,
  UsersIcon,
  WalletCardsIcon,
  WarehouseIcon,
  WaypointsIcon,
} from "lucide-react";

export const workspaceQuickActions: readonly SidebarQuickAction[] = [
  {
    id: "orbit-case",
    href: "/orbit-case",
    icon: PlusIcon,
    shortcut: "⌘N",
    topic: "Orbit Case",
    description:
      "Start a case for inquiry, approval, complaint, incident, request, investigation, or opportunity.",
  },
];

export const workspaceNavGroups: readonly SidebarNavGroup[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        id: "nexus-net",
        label: "Nexus Net",
        href: "/",
        icon: WaypointsIcon,
        match: "exact",
        description:
          "Open the operational map, local workspace widgets, and tenant shortcuts.",
      },
      {
        id: "arcana-vault",
        label: "Arcana Vault",
        href: "/arcana-vault",
        icon: HouseIcon,
        match: "prefix",
        description:
          "Open the user-owned room for drafts, notes, bookmarks, pins, and private files.",
      },
      {
        id: "codex-drive",
        label: "Codex Drive",
        href: "/codex-drive",
        icon: BoxesIcon,
        match: "prefix",
        description:
          "Retrieve uploaded, shared, downloaded, and bucket-backed objects.",
      },
    ],
  },
  {
    id: "applications",
    label: "Applications",
    items: [
      {
        id: "crm",
        label: "CRM",
        href: "/cms",
        icon: UsersIcon,
        match: "prefix",
        description: "Customer relationships, accounts, and activity records.",
      },
      {
        id: "sales",
        label: "Sales",
        href: "/dashboard",
        icon: TrendingUpIcon,
        match: "prefix",
        description: "Pipeline, opportunities, quotes, and revenue work.",
      },
      {
        id: "procurement",
        label: "Procurement",
        href: "/webhooks",
        icon: ShoppingCartIcon,
        match: "prefix",
        description: "Requests, suppliers, purchases, and approvals.",
      },
      {
        id: "inventory",
        label: "Inventory",
        href: "/dashboard",
        icon: WarehouseIcon,
        match: "prefix",
        description: "Stock, locations, movements, and fulfillment signals.",
      },
      {
        id: "manufacturing",
        label: "Manufacturing",
        href: "/dashboard",
        icon: FactoryIcon,
        match: "prefix",
        description: "Production planning, work orders, and shop-floor status.",
      },
      {
        id: "hrm",
        label: "HRM",
        href: "/account/organization",
        icon: UserRoundCogIcon,
        match: "prefix",
        description: "People, roles, membership, and workforce operations.",
      },
      {
        id: "finance",
        label: "Finance",
        href: "/dashboard",
        icon: WalletCardsIcon,
        match: "prefix",
        description: "Controls, approvals, payments, and finance records.",
      },
      {
        id: "projects",
        label: "Projects",
        href: "/dashboard",
        icon: SquareKanbanIcon,
        match: "prefix",
        description: "Project boards, delivery work, and execution tracking.",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        href: "/search?q=notifications",
        icon: BellIcon,
        match: "prefix",
        description: "Alerts, mentions, subscriptions, and operator updates.",
      },
      {
        id: "approvals",
        label: "Approvals",
        href: "/dashboard",
        icon: ShieldCheckIcon,
        match: "prefix",
        description: "Approval queues, sign-off work, and control gates.",
      },
      {
        id: "administration",
        label: "Administration",
        href: "/account/security",
        icon: SettingsIcon,
        match: "prefix",
        shortcut: "⌘,",
        description: "Account security, tenant policy, and system settings.",
      },
    ],
  },
];

export const workspacePaletteNavItems: readonly SidebarNavItem[] = [
  {
    id: "orbit-case",
    label: "Orbit Case",
    href: "/orbit-case",
    icon: PlusIcon,
    shortcut: "⌘N",
    description:
      "Start a case for inquiry, approval, complaint, incident, request, investigation, or opportunity.",
  },
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
