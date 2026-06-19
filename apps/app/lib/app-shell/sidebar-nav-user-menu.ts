import type { SidebarNavUserMenuGroup } from "@repo/design-system";

/** Server-safe sidebar user menu (href items only; sign-out handled client-side). */
export const authenticatedSidebarNavUserMenuGroups = [
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
  {
    key: "session",
    items: [
      {
        id: "sign-out",
        label: "Log out",
        destructive: true,
      },
    ],
  },
] as const satisfies readonly SidebarNavUserMenuGroup[];

export type AuthenticatedSidebarNavUserMenuItem =
  (typeof authenticatedSidebarNavUserMenuGroups)[number]["items"][number];

export const AUTHENTICATED_SIDEBAR_SIGN_OUT_MENU_ITEM_ID = "sign-out" as const;
