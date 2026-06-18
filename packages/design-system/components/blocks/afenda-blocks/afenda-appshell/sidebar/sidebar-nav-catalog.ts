import {
  FactoryIcon,
  FolderKanbanIcon,
  HandshakeIcon,
  IdCardIcon,
  LandmarkIcon,
  PackageIcon,
  SettingsIcon,
  ShieldIcon,
  ShoppingCartIcon,
  StoreIcon,
  TrendingUpIcon,
  UserCircleIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const APP_SIDEBAR_PRIMARY_ICON_BASE = "/primary";

type AppSidebarNavIcon = LucideIcon;

interface AppSidebarNavItemBase {
  readonly description?: string;
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

interface AppSidebarNavProductItem extends AppSidebarNavItemBase {
  readonly iconSrc: string;
  readonly kind: "product";
}

interface AppSidebarNavIconItem extends AppSidebarNavItemBase {
  readonly icon: AppSidebarNavIcon;
  readonly kind: "icon";
}

type AppSidebarNavItem = AppSidebarNavProductItem | AppSidebarNavIconItem;

const APP_SIDEBAR_MAIN_NAV_ITEMS = [
  {
    id: "orbit-case",
    kind: "product",
    label: "Orbit Case",
    href: "/orbit-case",
    iconSrc: `${APP_SIDEBAR_PRIMARY_ICON_BASE}/orbit-case.png`,
    description:
      "Cases for inquiry, approval, complaint, incident, request, investigation, or opportunity.",
  },
  {
    id: "nexus-net",
    kind: "product",
    label: "Nexus Net",
    href: "/dashboard",
    iconSrc: `${APP_SIDEBAR_PRIMARY_ICON_BASE}/nexus-net.png`,
    description: "Operational map, workspace widgets, and tenant shortcuts.",
  },
  {
    id: "arcana-vault",
    kind: "product",
    label: "Arcana Vault",
    href: "/arcana-vault",
    iconSrc: `${APP_SIDEBAR_PRIMARY_ICON_BASE}/arcana-vault.png`,
    description: "Drafts, notes, bookmarks, pins, and private files.",
  },
  {
    id: "codex-drive",
    kind: "product",
    label: "Codex Drive",
    href: "/codex-drive",
    iconSrc: `${APP_SIDEBAR_PRIMARY_ICON_BASE}/codex-drive.png`,
    description: "Uploaded, shared, downloaded, and bucket-backed objects.",
  },
] as const satisfies readonly AppSidebarNavProductItem[];

const APP_SIDEBAR_ERP_NAV_ITEMS = [
  {
    id: "erp-crm",
    kind: "icon",
    label: "CRM",
    href: "/applications/crm",
    icon: UsersIcon,
    description: "Customer relationships, accounts, and activity records.",
  },
  {
    id: "erp-sales",
    kind: "icon",
    label: "Sales",
    href: "/applications/sales",
    icon: TrendingUpIcon,
    description: "Pipeline, opportunities, quotes, and revenue work.",
  },
  {
    id: "erp-procurement",
    kind: "icon",
    label: "Procurement",
    href: "/applications/procurement",
    icon: ShoppingCartIcon,
    description: "Requests, suppliers, purchases, and approvals.",
  },
  {
    id: "erp-inventory",
    kind: "icon",
    label: "Inventory",
    href: "/applications/inventory",
    icon: PackageIcon,
    description: "Stock, locations, movements, and fulfillment signals.",
  },
  {
    id: "erp-manufacturing",
    kind: "icon",
    label: "Manufacturing",
    href: "/applications/manufacturing",
    icon: FactoryIcon,
    description: "Production planning, work orders, and shop-floor status.",
  },
  {
    id: "erp-hrm",
    kind: "icon",
    label: "HRM",
    href: "/applications/hrm",
    icon: UserCircleIcon,
    description: "People, roles, membership, and workforce operations.",
  },
  {
    id: "erp-finance",
    kind: "icon",
    label: "Finance",
    href: "/applications/finance",
    icon: WalletIcon,
    description: "Controls, approvals, payments, and finance records.",
  },
  {
    id: "erp-projects",
    kind: "icon",
    label: "Projects",
    href: "/applications/projects",
    icon: FolderKanbanIcon,
    description: "Project boards, delivery work, and execution tracking.",
  },
] as const satisfies readonly AppSidebarNavIconItem[];

const APP_SIDEBAR_PORTAL_NAV_ITEMS = [
  {
    id: "portal-employee",
    kind: "icon",
    label: "Employee Portal",
    href: "/portal/employee",
    icon: IdCardIcon,
    description: "Workforce self-service, requests, and internal updates.",
  },
  {
    id: "portal-supplier",
    kind: "icon",
    label: "Supplier Portal",
    href: "/portal/supplier",
    icon: HandshakeIcon,
    description: "Supplier onboarding, orders, invoices, and collaboration.",
  },
  {
    id: "portal-customer",
    kind: "icon",
    label: "Customer Portal",
    href: "/portal/customer",
    icon: UsersIcon,
    description: "Customer accounts, orders, support, and shared records.",
  },
  {
    id: "portal-investor",
    kind: "icon",
    label: "Investor Portal",
    href: "/portal/investor",
    icon: LandmarkIcon,
    description: "Investor reporting, disclosures, and stakeholder updates.",
  },
  {
    id: "portal-franchise",
    kind: "icon",
    label: "Franchise Portal",
    href: "/portal/franchise",
    icon: StoreIcon,
    description: "Franchise operations, compliance, and network performance.",
  },
] as const satisfies readonly AppSidebarNavIconItem[];

const APP_SIDEBAR_SETTINGS_NAV_ITEMS = [
  {
    id: "settings-admin",
    kind: "icon",
    label: "Admin Setting",
    href: "/system/administration",
    icon: ShieldIcon,
    description: "Tenant policy, security controls, and system settings.",
  },
  {
    id: "settings-account",
    kind: "icon",
    label: "Account Setting",
    href: "/account/organization",
    icon: SettingsIcon,
    description: "Organization profile, membership, and account preferences.",
  },
] as const satisfies readonly AppSidebarNavIconItem[];

const APP_SIDEBAR_MAIN_NAV_LABEL = "Main Navigation";
const APP_SIDEBAR_ERP_NAV_LABEL = "ERP Navigation";
const APP_SIDEBAR_PORTAL_NAV_LABEL = "Portal Navigation";
const APP_SIDEBAR_SETTINGS_NAV_LABEL = "Settings Navigation";

const APP_SIDEBAR_DEMO_USER = {
  name: "Operator",
  email: "operator@afenda.app",
  avatar: "/erp-icon/erp-user-avatar.png",
} as const;

export type {
  AppSidebarNavIcon,
  AppSidebarNavIconItem,
  AppSidebarNavItem,
  AppSidebarNavProductItem,
};
export {
  APP_SIDEBAR_DEMO_USER,
  APP_SIDEBAR_ERP_NAV_ITEMS,
  APP_SIDEBAR_ERP_NAV_LABEL,
  APP_SIDEBAR_MAIN_NAV_ITEMS,
  APP_SIDEBAR_MAIN_NAV_LABEL,
  APP_SIDEBAR_PORTAL_NAV_ITEMS,
  APP_SIDEBAR_PORTAL_NAV_LABEL,
  APP_SIDEBAR_PRIMARY_ICON_BASE,
  APP_SIDEBAR_SETTINGS_NAV_ITEMS,
  APP_SIDEBAR_SETTINGS_NAV_LABEL,
};
