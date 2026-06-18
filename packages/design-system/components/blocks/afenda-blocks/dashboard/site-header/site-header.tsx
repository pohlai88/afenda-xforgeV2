"use client";

import { Button } from "../../../../afenda-ui/button";
import { Separator } from "../../../../afenda-ui/separator";
import { SidebarTrigger } from "../../../../afenda-ui/sidebar";
import { resolveSidebarLinkRenderer } from "../../sidebars/sidebar-link-defaults";
import { cn } from "../../../../../lib/utils";
import { type CSSProperties, memo } from "react";
import {
  DEFAULT_DASHBOARD_SITE_HEADER_GITHUB_HREF,
  DEFAULT_DASHBOARD_SITE_HEADER_GITHUB_LABEL,
  DEFAULT_DASHBOARD_SITE_HEADER_HEIGHT,
  DEFAULT_DASHBOARD_SITE_HEADER_TITLE,
} from "./dashboard-site-header-constants";
import {
  siteHeaderActionsClass,
  siteHeaderGithubButtonClass,
  siteHeaderInnerClass,
  siteHeaderSeparatorClass,
  siteHeaderShellClass,
  siteHeaderTitleClass,
  siteHeaderTriggerClass,
} from "./dashboard-site-header-recipes";
import type { SiteHeaderProps } from "./dashboard-site-header-types";

export const SiteHeader = memo(function SiteHeader({
  actions,
  className,
  githubHref = DEFAULT_DASHBOARD_SITE_HEADER_GITHUB_HREF,
  githubLabel = DEFAULT_DASHBOARD_SITE_HEADER_GITHUB_LABEL,
  headerHeight = DEFAULT_DASHBOARD_SITE_HEADER_HEIGHT,
  renderLink,
  showSidebarTrigger = true,
  style,
  title = DEFAULT_DASHBOARD_SITE_HEADER_TITLE,
  triggerClassName,
}: SiteHeaderProps) {
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);
  const showGithubLink = githubHref !== false;

  return (
    <header
      className={cn(siteHeaderShellClass, className)}
      data-slot="site-header"
      style={
        {
          "--dashboard-site-header-height": headerHeight,
          ...style,
        } as CSSProperties
      }
    >
      <div className={siteHeaderInnerClass}>
        {showSidebarTrigger ? (
          <SidebarTrigger
            className={cn(siteHeaderTriggerClass, triggerClassName)}
          />
        ) : null}
        <Separator
          className={siteHeaderSeparatorClass}
          orientation="vertical"
        />
        <h1 className={siteHeaderTitleClass}>{title}</h1>
        <div className={siteHeaderActionsClass}>
          {actions}
          {showGithubLink && githubHref ? (
            <Button
              asChild
              className={siteHeaderGithubButtonClass}
              size="sm"
              variant="quiet"
            >
              {renderLink ? (
                linkRenderer({
                  className: "text-text-primary",
                  href: githubHref,
                  children: githubLabel,
                })
              ) : (
                <a
                  className="text-text-primary"
                  href={githubHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {githubLabel}
                </a>
              )}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
});
