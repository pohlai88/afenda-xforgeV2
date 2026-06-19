import type { AfendaAppSidebarNavLayoutDescriptor } from "../afenda-appshell/sidebar/sidebar-nav-descriptors";
import type { AccountSettingsNavIconKey } from "./account-settings-nav.registry";

export const accountSettingsNavDescriptor: AfendaAppSidebarNavLayoutDescriptor<AccountSettingsNavIconKey> =
  {
    main: {
      groupSlot: "app-sidebar-main-nav",
      label: "Main Navigation",
      items: [
        {
          id: "account-overview",
          kind: "icon",
          label: "Overview",
          href: "/account/organization",
          iconKey: "home",
        },
      ],
    },
    scroll: [
      {
  groupSlot: "app-sidebar-erp-nav",
      label: "Account",
      items: [
          {
            id: "account-profile",
            kind: "icon",
            label: "Profile",
            href: "/account/profile",
            iconKey: "user",
          },
          {
            id: "account-preferences",
            kind: "icon",
            label: "Preferences",
            href: "/account/preferences",
            iconKey: "sliders",
          },
          {
            id: "account-security",
            kind: "icon",
            label: "Security",
            href: "/account/security",
            iconKey: "shield",
          },
        ],
      },
      {
        groupSlot: "app-sidebar-portal-nav",
        label: "Organization",
        items: [
          {
            id: "account-organization",
            kind: "icon",
            label: "Organization",
            href: "/account/organization",
            iconKey: "building",
          },
          {
            id: "account-members",
            kind: "icon",
            label: "Members",
            href: "/account/members",
            iconKey: "users",
          },
          {
            id: "account-billing",
            kind: "icon",
            label: "Billing",
            href: "/account/billing",
            iconKey: "credit-card",
          },
        ],
      },
    ],
    footer: {
      groupSlot: "app-sidebar-settings-nav",
      label: "Settings Footer",
      items: [
        {
          id: "back-to-app",
          kind: "icon",
          label: "Back to App",
          href: "/dashboard",
          iconKey: "arrow-left",
        },
      ],
    },
  };
