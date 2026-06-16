import { DEFAULT_CONTENT_LAYOUT_FOOTER_COPYRIGHT } from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-constants";
import { DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS } from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-demo-catalog";
import type { ContentLayoutFooterProps } from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-types";

export const DEMO_DASHBOARD_PAGE_FOOTER_PROPS = {
  copyright: DEFAULT_CONTENT_LAYOUT_FOOTER_COPYRIGHT,
  links: DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS,
} satisfies ContentLayoutFooterProps;
