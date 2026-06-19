import type { AfendaAppShellFooterLink } from "@repo/design-system";

/** Official authenticated shell footer links (server-safe). */
export const authenticatedAppShellFooterLinks = [
  {
    id: "footer-account",
    label: "Account",
    href: "/account/organization",
  },
  {
    id: "footer-security",
    label: "Security",
    href: "/account/security",
  },
] as const satisfies readonly AfendaAppShellFooterLink[];

export type AuthenticatedAppShellFooterLink =
  (typeof authenticatedAppShellFooterLinks)[number];
