import type {
  ContentLayoutBreadcrumbItem,
  ContentLayoutFooterLink,
} from "./content-layout-types";

export const DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS: readonly ContentLayoutFooterLink[] =
  [
    { id: "docs", label: "Docs", href: "#docs" },
    { id: "purchase", label: "Purchase", href: "#purchase" },
    { id: "faq", label: "FAQ", href: "#faq" },
    { id: "support", label: "Support", href: "#support" },
    { id: "license", label: "License", href: "#license" },
  ];

export const DEMO_CONTENT_LAYOUT_BREADCRUMBS: readonly ContentLayoutBreadcrumbItem[] =
  [
    { id: "account-home", label: "Account home", active: true, menu: true },
    { id: "billing", label: "Billing", menu: true },
    { id: "security", label: "Security", menu: true },
    { id: "members", label: "Members & roles", menu: true },
    { id: "integrations", label: "Integrations" },
    { id: "notifications", label: "Notifications" },
    { id: "api-keys", label: "API keys" },
    { id: "more", label: "More", menu: true },
  ];

export const DEMO_CONTENT_LAYOUT_BOTTOM_DRAWER_LABEL = "Activity drawer";

export const DEMO_CONTENT_LAYOUT_DEFAULT_NAV_HREF = "#content-overview";
