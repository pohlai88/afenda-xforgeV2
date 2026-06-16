"use client";

import {
  DEFAULT_CONTENT_LAYOUT_FOOTER_HEIGHT,
  DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT,
  DEFAULT_CONTENT_LAYOUT_MIN_WIDTH,
  DEFAULT_CONTENT_LAYOUT_RIGHT_SIDEBAR_WIDTH,
  DEFAULT_CONTENT_LAYOUT_TOPBAR_HEIGHT,
  EMPTY_CONTENT_LAYOUT_BREADCRUMBS,
} from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-constants";
import {
  contentLayoutDensityClassName,
  getContentLayoutBodyGridClassName,
  resolveContentLayoutInsetStyle,
} from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-helpers";
import {
  contentLayoutBlockShellClass,
  contentLayoutBodyClass,
  contentLayoutMainClass,
  contentLayoutStageFooterPlacementClass,
} from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-recipes";
import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";
import { cn } from "@repo/design-system/lib/utils";
import type { CSSProperties } from "react";
import { useMemo, useRef } from "react";
import { ContentLayoutBottomDrawer } from "./content-layout-bottom-drawer";
import { ContentLayoutBreadcrumbsTopbar } from "./content-layout-breadcrumbs-topbar";
import { ContentLayoutFooter } from "./content-layout-footer";
import { ContentLayoutResizeHandles } from "./content-layout-resize-handles";
import { ContentLayoutSidebar } from "./content-layout-sidebar";
import type { ContentLayoutBlockProps } from "./content-layout-types";
import { useContentLayoutResize } from "./use-content-layout-resize";

export function ContentLayoutBlock({
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
  const hasLeftSidebar = Boolean(leftSidebar);
  const hasRightSidebar = Boolean(rightSidebar);

  const { containerStyle, isResizing, startResize } = useContentLayoutResize({
    containerRef,
    enabled: isResizable,
    maxHeight: resizeConfig?.maxHeight,
    maxWidth: resizeConfig?.maxWidth,
    minHeight: resizeConfig?.minHeight ?? DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT,
    minWidth: resizeConfig?.minWidth ?? DEFAULT_CONTENT_LAYOUT_MIN_WIDTH,
    stageRef,
  });

  const insetStyle = useMemo(() => {
    if (isResizing) {
      return undefined;
    }

    return resolveContentLayoutInsetStyle(containerStyle, resizeConfig);
  }, [containerStyle, isResizing, resizeConfig]);

  const bodyGridClassName = useMemo(
    () =>
      getContentLayoutBodyGridClassName({
        hasLeftSidebar,
        hasRightSidebar,
      }),
    [hasLeftSidebar, hasRightSidebar]
  );

  const mainClassName = useMemo(
    () =>
      cn(
        contentLayoutMainClass,
        contentLayoutDensityClassName[density],
        contentClassName
      ),
    [contentClassName, density]
  );

  const panelStyle = useMemo(
    () =>
      ({
        "--content-layout-topbar-height": DEFAULT_CONTENT_LAYOUT_TOPBAR_HEIGHT,
        "--content-layout-footer-height": DEFAULT_CONTENT_LAYOUT_FOOTER_HEIGHT,
        ...style,
        ...insetStyle,
      }) as CSSProperties,
    [insetStyle, style]
  );

  const showFooter = footer !== null;
  const footerNode = showFooter ? (
    footer !== undefined ? (
      footer
    ) : (
      <ContentLayoutFooter
        className={contentLayoutStageFooterPlacementClass}
        copyright={footerCopyright}
        links={footerLinks}
      />
    )
  ) : null;

  const panel = (
    <div
      className={cn(contentLayoutBlockShellClass, className)}
      data-adjustable={isResizable ? "true" : "false"}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-resizing={isResizing ? "true" : "false"}
      data-slot="content-layout"
      data-state={state}
      data-tone={tone}
      ref={containerRef}
      style={panelStyle}
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
        {hasLeftSidebar ? (
          <ContentLayoutSidebar config={leftSidebarConfig} side="left">
            {leftSidebar}
          </ContentLayoutSidebar>
        ) : null}
        <main
          aria-label="Main content"
          className={mainClassName}
          data-slot="content-layout-main"
        >
          {children}
        </main>
        {hasRightSidebar ? (
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
      {isResizable ? (
        <ContentLayoutResizeHandles onResizeStart={startResize} />
      ) : null}
    </div>
  );

  if (externalStageRef) {
    return (
      <>
        {panel}
        {footerNode}
      </>
    );
  }

  return (
    <section
      className={cn(blockRecipe("blockStage"), "relative h-full min-h-0")}
      data-slot="content-layout-stage"
      ref={localStageRef}
    >
      {panel}
      {footerNode}
    </section>
  );
}
