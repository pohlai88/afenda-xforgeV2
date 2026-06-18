import type { AfendaAppSidebarNavLayoutDescriptor } from "@repo/design-system";
import type { AuthenticatedAppSidebarNavIconKey } from "./sidebar-nav.registry";

const APP_SIDEBAR_PRIMARY_ICON_BASE = "/primary";

/** Server-safe sidebar nav config (no Lucide imports). */
export const authenticatedAppSidebarNavDescriptor: AfendaAppSidebarNavLayoutDescriptor<AuthenticatedAppSidebarNavIconKey> =
  {
    main: {
      groupSlot: "app-sidebar-main-nav",
      label: "Main Navigation",
      items: [
        {
          id: "orbit-case",
          kind: "product",
          label: "Orbit Case",
          href: "/orbit-case",
          iconSrc: `${APP_SIDEBAR_PRIMARY_ICON_BASE}/orbit-case.png`,
        },
        {
          id: "nexus-net",
          kind: "product",
          label: "Nexus Net",
          href: "/dashboard",
          iconSrc: `${APP_SIDEBAR_PRIMARY_ICON_BASE}/nexus-net.png`,
        },
        {
          id: "arcana-vault",
          kind: "product",
          label: "Arcana Vault",
          href: "/arcana-vault",
          iconSrc: `${APP_SIDEBAR_PRIMARY_ICON_BASE}/arcana-vault.png`,
        },
        {
          id: "codex-drive",
          kind: "product",
          label: "Codex Drive",
          href: "/codex-drive",
          iconSrc: `${APP_SIDEBAR_PRIMARY_ICON_BASE}/codex-drive.png`,
        },
      ],
    },
    scroll: [
      {
        groupSlot: "app-sidebar-erp-nav",
        label: "ERP Navigation",
        items: [
          { id: "erp-crm", kind: "icon", label: "CRM", href: "/applications/crm", iconKey: "users" },
          {
            id: "erp-sales",
            kind: "icon",
            label: "Sales",
            href: "/applications/sales",
            iconKey: "trending-up",
          },
          {
            id: "erp-procurement",
            kind: "icon",
            label: "Procurement",
            href: "/applications/procurement",
            iconKey: "shopping-cart",
          },
          {
            id: "erp-inventory",
            kind: "icon",
            label: "Inventory",
            href: "/applications/inventory",
            iconKey: "package",
          },
          {
            id: "erp-manufacturing",
            kind: "icon",
            label: "Manufacturing",
            href: "/applications/manufacturing",
            iconKey: "factory",
          },
          {
            id: "erp-hrm",
            kind: "icon",
            label: "HRM",
            href: "/applications/hrm",
            iconKey: "user-circle",
          },
          {
            id: "erp-finance",
            kind: "icon",
            label: "Finance",
            href: "/applications/finance",
            iconKey: "wallet",
          },
          {
            id: "erp-projects",
            kind: "icon",
            label: "Projects",
            href: "/applications/projects",
            iconKey: "folder-kanban",
          },
        ],
      },
      {
        groupSlot: "app-sidebar-portal-nav",
        label: "Portal Navigation",
        items: [
          {
            id: "portal-employee",
            kind: "icon",
            label: "Employee Portal",
            href: "/portal/employee",
            iconKey: "id-card",
          },
          {
            id: "portal-supplier",
            kind: "icon",
            label: "Supplier Portal",
            href: "/portal/supplier",
            iconKey: "handshake",
          },
          {
            id: "portal-customer",
            kind: "icon",
            label: "Customer Portal",
            href: "/portal/customer",
            iconKey: "users",
          },
          {
            id: "portal-investor",
            kind: "icon",
            label: "Investor Portal",
            href: "/portal/investor",
            iconKey: "landmark",
          },
          {
            id: "portal-franchise",
            kind: "icon",
            label: "Franchise Portal",
            href: "/portal/franchise",
            iconKey: "store",
          },
        ],
      },
    ],
    footer: {
      groupSlot: "app-sidebar-settings-nav",
      label: "Settings Navigation",
      items: [
        {
          id: "settings-admin",
          kind: "icon",
          label: "Admin Setting",
          href: "/system/administration",
          iconKey: "shield",
        },
        {
          id: "settings-account",
          kind: "icon",
          label: "Account Setting",
          href: "/account/organization",
          iconKey: "settings",
        },
      ],
    },
  };
