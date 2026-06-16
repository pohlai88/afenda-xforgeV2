import {
  flattenSidebarNavGroups,
  type SidebarCardSection,
  type SidebarNavGroup,
  type SidebarNavItem,
  type SidebarQuickAction,
} from "@repo/design-system/design-system";
import {
  BirdIcon,
  BugIcon,
  Columns3CogIcon,
  DogIcon,
  FactoryIcon,
  FishIcon,
  SearchIcon,
  ShoppingCartIcon,
  SquareKanbanIcon,
  TrendingUpIcon,
  UserRoundCogIcon,
  UsersIcon,
  WalletCardsIcon,
  WarehouseIcon,
} from "lucide-react";

export const workspaceQuickActions: readonly SidebarQuickAction[] = [];

export const workspacePinnedNavGroups: readonly SidebarNavGroup[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        id: "orbit-case",
        label: "Orbit Case",
        href: "/orbit-case",
        icon: BugIcon,
        match: "prefix",
        shortcut: "⌘N",
        description:
          "Start a case for inquiry, approval, complaint, incident, request, investigation, or opportunity.",
      },
      {
        id: "nexus-net",
        label: "Nexus Net",
        href: "/",
        icon: BirdIcon,
        match: "exact",
        description:
          "Open the operational map, local workspace widgets, and tenant shortcuts.",
      },
      {
        id: "arcana-vault",
        label: "Arcana Vault",
        href: "/arcana-vault",
        icon: DogIcon,
        match: "prefix",
        description:
          "Open the user-owned room for drafts, notes, bookmarks, pins, and private files.",
      },
      {
        id: "codex-drive",
        label: "Codex Drive",
        href: "/codex-drive",
        icon: FishIcon,
        match: "prefix",
        description:
          "Retrieve uploaded, shared, downloaded, and bucket-backed objects.",
      },
    ],
  },
];

export const workspaceNavGroups: readonly SidebarNavGroup[] = [
  {
    id: "applications",
    label: "Applications",
    items: [
      {
        id: "crm",
        label: "CRM",
        href: "/applications/crm",
        icon: UsersIcon,
        match: "prefix",
        description: "Customer relationships, accounts, and activity records.",
      },
      {
        id: "sales",
        label: "Sales",
        href: "/applications/sales",
        icon: TrendingUpIcon,
        match: "prefix",
        description: "Pipeline, opportunities, quotes, and revenue work.",
      },
      {
        id: "procurement",
        label: "Procurement",
        href: "/applications/procurement",
        icon: ShoppingCartIcon,
        match: "prefix",
        description: "Requests, suppliers, purchases, and approvals.",
      },
      {
        id: "inventory",
        label: "Inventory",
        href: "/applications/inventory",
        icon: WarehouseIcon,
        match: "prefix",
        description: "Stock, locations, movements, and fulfillment signals.",
      },
      {
        id: "manufacturing",
        label: "Manufacturing",
        href: "/applications/manufacturing",
        icon: FactoryIcon,
        match: "prefix",
        description: "Production planning, work orders, and shop-floor status.",
      },
      {
        id: "hrm",
        label: "HRM",
        href: "/applications/hrm",
        icon: UserRoundCogIcon,
        match: "prefix",
        description: "People, roles, membership, and workforce operations.",
      },
      {
        id: "finance",
        label: "Finance",
        href: "/applications/finance",
        icon: WalletCardsIcon,
        match: "prefix",
        description: "Controls, approvals, payments, and finance records.",
      },
      {
        id: "projects",
        label: "Projects",
        href: "/applications/projects",
        icon: SquareKanbanIcon,
        match: "prefix",
        description: "Project boards, delivery work, and execution tracking.",
      },
    ],
  },
];

export const workspaceSystemCardSections: readonly SidebarCardSection[] = [
  {
    id: "system",
    label: "System",
    href: "/system/administration",
    icon: Columns3CogIcon,
    match: "prefix",
    description: "System controls, operator governance, and account settings.",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        href: "/system/notifications",
        match: "prefix",
        description: "Alerts, mentions, and operator updates.",
      },
      {
        id: "approvals",
        label: "Approvals",
        href: "/system/approvals",
        match: "prefix",
        description: "Approval queues and control gates.",
      },
      {
        id: "administration",
        label: "Administration",
        href: "/system/administration",
        match: "prefix",
        description: "Tenant policy and system controls.",
      },
    ],
    menuItems: [
      {
        id: "notifications",
        label: "Notifications",
        href: "/system/notifications",
        match: "prefix",
        description: "Alerts and subscriptions",
      },
      {
        id: "approvals",
        label: "Approvals",
        href: "/system/approvals",
        match: "prefix",
        description: "Queues and sign-offs",
      },
      {
        id: "administration",
        label: "Administration",
        href: "/system/administration",
        match: "prefix",
        shortcut: "⌘,",
        description: "Tenant policy and controls",
      },
      {
        id: "account-security",
        label: "Account security",
        href: "/account/security",
        match: "prefix",
        description: "Sign-in, passkeys, and MFA",
      },
      {
        id: "organization",
        label: "Organization",
        href: "/account/organization",
        match: "prefix",
        description: "Workspaces and members",
      },
    ],
  },
];

export const workspacePaletteNavItems: readonly SidebarNavItem[] = [
  ...flattenSidebarNavGroups(workspacePinnedNavGroups),
  ...flattenSidebarNavGroups(workspaceNavGroups),
  {
    id: "system-settings",
    label: "System settings",
    href: "/system/administration",
    icon: Columns3CogIcon,
    match: "prefix",
    shortcut: "⌘,",
    description:
      "Open system settings, account security, and organization controls.",
  },
  {
    id: "search",
    label: "Search workspace",
    href: "/search?q=workspace",
    icon: SearchIcon,
    shortcut: "⌘K",
    description: "Find records, evidence, and routes.",
  },
];
