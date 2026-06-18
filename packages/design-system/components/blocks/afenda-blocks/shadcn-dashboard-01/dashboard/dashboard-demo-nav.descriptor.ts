import type { AfendaAppSidebarNavLayoutDescriptor } from "../../afenda-appshell/sidebar/sidebar-nav-descriptors";
import type { DashboardDemoSidebarNavIconKey } from "./dashboard-demo-nav.registry";

/** Serializable nav fixture for dashboard demo pages (no Lucide imports). */
export const dashboardDemoSidebarNavDescriptor: AfendaAppSidebarNavLayoutDescriptor<DashboardDemoSidebarNavIconKey> =
  {
    main: {
      groupSlot: "app-sidebar-main-nav",
      label: "Main Navigation",
      items: [
        {
          id: "dashboard",
          kind: "icon",
          label: "Dashboard",
          href: "/dashboard",
          iconKey: "layout-dashboard",
        },
      ],
    },
    scroll: [
      {
        groupSlot: "app-sidebar-erp-nav",
        label: "ERP Navigation",
        items: [
          {
            id: "erp-preview",
            kind: "icon",
            label: "Preview Module",
            href: "/applications/preview",
            iconKey: "shield",
          },
        ],
      },
    ],
    footer: {
      groupSlot: "app-sidebar-settings-nav",
      label: "Settings Navigation",
      items: [
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
