import type {
  AfendaAppShellFooterLink,
  AfendaAppSidebarNavLayoutDescriptor,
  SidebarNavUserMenuGroup,
} from "@repo/design-system";
import type { StoryAppShellSidebarNavIconKey } from "./afenda-appshell.registry";

export const storyAppShellSidebarNavDescriptor: AfendaAppSidebarNavLayoutDescriptor<StoryAppShellSidebarNavIconKey> =
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

export const storyAppShellFooterLinks: readonly AfendaAppShellFooterLink[] = [
  { href: "/docs", id: "footer-docs", label: "Docs" },
  { href: "/support", id: "footer-support", label: "Support" },
];

export const storyAppShellUserMenuGroups = [
  {
    key: "account",
    items: [
      {
        id: "account-organization",
        label: "Account",
        href: "/account/organization",
      },
      {
        id: "account-security",
        label: "Security",
        href: "/account/security",
      },
    ],
  },
] as const satisfies readonly SidebarNavUserMenuGroup[];

export const storyAppShellUser = {
  name: "Storybook Operator",
  email: "operator@afenda.app",
  avatar: "/erp-icon/erp-user-avatar.png",
} as const;
