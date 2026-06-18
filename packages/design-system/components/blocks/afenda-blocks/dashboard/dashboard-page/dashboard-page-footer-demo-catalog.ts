/** @internal Storybook / dashboard-01 demo only — page footer fixtures. */

import { DEFAULT_CONTENT_LAYOUT_FOOTER_COPYRIGHT } from "../../content-layout/content-layout-constants";
import { DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS } from "../../content-layout/content-layout-demo-catalog";
import type { ContentLayoutFooterProps } from "../../content-layout/content-layout-types";

export const DEMO_DASHBOARD_PAGE_FOOTER_PROPS = {
  copyright: DEFAULT_CONTENT_LAYOUT_FOOTER_COPYRIGHT,
  links: DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS,
} satisfies ContentLayoutFooterProps;
