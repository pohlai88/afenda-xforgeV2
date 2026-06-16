"use client";

import { cn } from "@repo/design-system/lib/utils";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { blockRecipe } from "../../block-recipes";
import { ContentLayoutBottomDrawer } from "./content-layout-bottom-drawer";
import { ContentLayoutBreadcrumbsTopbar } from "./content-layout-breadcrumbs-topbar";
import {
  DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT,
  DEFAULT_CONTENT_LAYOUT_MIN_WIDTH,
  DEFAULT_CONTENT_LAYOUT_RIGHT_SIDEBAR_WIDTH,
  DEFAULT_CONTENT_LAYOUT_TOPBAR_HEIGHT,
  EMPTY_CONTENT_LAYOUT_BREADCRUMBS,
} from "./content-layout-constants";
import { ContentLayoutFooter } from "./content-layout-footer";
import {
  contentLayoutDensityClassName,
  getContentLayoutBodyGridClassName,
  resolveContentLayoutInsetStyle,
} from "./content-layout-helpers";
import {
  contentLayoutBodyClass,
  contentLayoutMainClass,
  contentLayoutShellClass,
} from "./content-layout-recipes";
import { ContentLayoutResizeHandles } from "./content-layout-resize-handles";
import { ContentLayoutSidebar } from "./content-layout-sidebar";
import type { ContentLayoutBlockProps } from "./content-layout-types";
import { useContentLayoutResize } from "./use-content-layout-resize";

function ContentLayoutBlock({
  blockId,
  bottomDrawer,
  bottomDrawerConfig,
  breadcrumbItems = EMPTY_CONTENT_LAYOUT_BREADCRUMBS,
  breadcrumbTrailing,
  children,
  className,
  contentClassName,
  density = "default",
  footer,
  footerCopyright,
  footerLinks,
  intent = "operation",
  leftSidebar,
  leftSidebarConfig,
  resizeConfig,
  rightSidebar,
  rightSidebarConfig,
  stageRef: externalStageRef,
  state = "ready",
  tone = "neutral",
  style,
  ...props
}: ContentLayoutBlockProps) {
  const localStageRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = externalStageRef ?? localStageRef;
  const isResizable = resizeConfig?.adjustable ?? false;

  const { containerStyle, startResize } = useContentLayoutResize({
    containerRef,
    enabled: isResizable,
    maxHeight: resizeConfig?.maxHeight,
    maxWidth: resizeConfig?.maxWidth,
    minHeight: resizeConfig?.minHeight ?? DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT,
    minWidth: resizeConfig?.minWidth ?? DEFAULT_CONTENT_LAYOUT_MIN_WIDTH,
    stageRef,
  });

  const insetStyle = resolveContentLayoutInsetStyle(containerStyle, resizeConfig);
  const bodyGridClassName = getContentLayoutBodyGridClassName({
    hasLeftSidebar: Boolean(leftSidebar),
    hasRightSidebar: Boolean(rightSidebar),
  });

  const panel = (
    <div
      className={cn(contentLayoutShellClass, className)}
      data-adjustable={isResizable ? "true" : "false"}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="content-layout"
      data-state={state}
      data-tone={tone}
      ref={containerRef}
      style={
        {
          "--content-layout-topbar-height": DEFAULT_CONTENT_LAYOUT_TOPBAR_HEIGHT,
          ...style,
          ...insetStyle,
        } as CSSProperties
      }
      {...props}
    >
      <ContentLayoutBreadcrumbsTopbar
        items={breadcrumbItems}
        trailing={breadcrumbTrailing}
      />
      <div
        className={cn(contentLayoutBodyClass, bodyGridClassName)}
        data-slot="content-layout-body"
      >
        {leftSidebar ? (
          <ContentLayoutSidebar config={leftSidebarConfig} side="left">
            {leftSidebar}
          </ContentLayoutSidebar>
        ) : null}
        <main
          aria-label="Main content"
          className={cn(
            contentLayoutMainClass,
            contentLayoutDensityClassName[density],
            contentClassName
          )}
          data-slot="content-layout-main"
          tabIndex={0}
        >
          {children}
        </main>
        {rightSidebar ? (
          <ContentLayoutSidebar
            config={rightSidebarConfig}
            defaultWidth={DEFAULT_CONTENT_LAYOUT_RIGHT_SIDEBAR_WIDTH}
            side="right"
          >
            {rightSidebar}
          </ContentLayoutSidebar>
        ) : null}
      </div>
      {bottomDrawer ? (
        <ContentLayoutBottomDrawer config={bottomDrawerConfig}>
          {bottomDrawer}
        </ContentLayoutBottomDrawer>
      ) : null}
      {footer ?? (
        <ContentLayoutFooter copyright={footerCopyright} links={footerLinks} />
      )}
      {isResizable ? (
        <ContentLayoutResizeHandles onResizeStart={startResize} />
      ) : null}
    </div>
  );

  if (externalStageRef) {
    return panel;
  }

  return (
    <section
      className={cn(blockRecipe("blockStage"), "relative h-full min-h-0")}
      data-slot="content-layout-stage"
      ref={localStageRef}
    >
      {panel}
    </section>
  );
}

export { ContentLayoutBlock };
