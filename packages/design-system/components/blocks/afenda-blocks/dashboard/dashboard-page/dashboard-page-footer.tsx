"use client";

import { ContentLayoutFooter } from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-footer";
import type { ContentLayoutFooterProps } from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-types";
import { cn } from "@repo/design-system/lib/utils";
import { memo } from "react";
import { dashboardPageFooterClass } from "./dashboard-page-footer-recipes";

export const DashboardPageFooter = memo(function DashboardPageFooter({
  className,
  ...props
}: ContentLayoutFooterProps) {
  return (
    <ContentLayoutFooter
      className={cn(dashboardPageFooterClass, className)}
      {...props}
    />
  );
});
