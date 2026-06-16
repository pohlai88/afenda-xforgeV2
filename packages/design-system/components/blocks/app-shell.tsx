"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type {
  ComponentProps,
  CSSProperties,
  ReactElement,
  ReactNode,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { blockRecipe } from "./block-recipes";
import type { BlockBaseProps, BlockDensity } from "./foundation";

type AppShellAuditDockPlacement = "bottom" | "right";
type AppShellSiteContainerMode = "floating" | "docked";
type AppShellSiteContainerResizeIntent = "resize-bottom" | "resize-right";

interface AppShellSidebarConfig {
  readonly className?: string;
  readonly collapsible?: ComponentProps<typeof Sidebar>["collapsible"];
  readonly variant?: ComponentProps<typeof Sidebar>["variant"];
  readonly width?: string;
  readonly wrapper?: (sidebar: ReactNode) => ReactNode;
}

interface AppShellSiteContainerConfig {
  readonly adjustable?: boolean;
  readonly bottom?: string;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly left?: string;
  readonly maxHeight?: number;
  readonly maxWidth?: number;
  readonly minHeight?: number;
  readonly minWidth?: number;
  readonly mode?: AppShellSiteContainerMode;
  readonly right?: string;
  readonly top?: string;
}

interface AppShellSiteContainerGeometry {
  readonly height: number;
  readonly snappedBottom: boolean;
  readonly snappedRight: boolean;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

type AuthenticatedAppShellBlockProps = Omit<
  ComponentProps<"section">,
  "title"
> &
  BlockBaseProps & {
    readonly appSidebar?: ReactNode;
    readonly appSidebarConfig?: AppShellSidebarConfig;
    readonly appTopbar?: ReactNode;
    readonly appTopbarHeight?: string;
    readonly auditDock?: ReactNode;
    readonly auditDockPlacement?: AppShellAuditDockPlacement;
    readonly auditEvidenceScopeSync?: ReactNode;
    readonly children?: ReactNode;
    readonly contentClassName?: string;
    readonly contentPadded?: boolean;
    readonly defaultOpen?: boolean;
    readonly enableSidebarKeyboardShortcut?: boolean;
    readonly siteBottomDrawer?: ReactNode;
    readonly siteContainerConfig?: AppShellSiteContainerConfig;
    readonly siteRightSidebar?: ReactNode;
    readonly siteSidebarConfig?: Omit<AppShellSidebarConfig, "wrapper">;
    readonly siteSidebarLeft?: ReactNode;
    readonly siteTopbar?: ReactNode;
  };

const DEFAULT_APP_TOPBAR_HEIGHT = "var(--xforge-layout-app-topbar)";
const DEFAULT_SITE_CONTAINER_BOTTOM = "var(--xforge-layout-site-inset)";
const DEFAULT_SITE_CONTAINER_LEFT = "var(--xforge-layout-site-inset)";
const DEFAULT_SITE_CONTAINER_MIN_HEIGHT = 360;
const DEFAULT_SITE_CONTAINER_MIN_WIDTH = 640;
const DEFAULT_SITE_CONTAINER_RIGHT = "var(--xforge-layout-site-inset)";
const DEFAULT_SITE_CONTAINER_TOP = "var(--xforge-layout-site-inset)";
const DEFAULT_SITE_SIDEBAR_WIDTH = "var(--xforge-layout-site-sidebar)";
const DEFAULT_SITE_TOPBAR_HEIGHT = "var(--xforge-layout-site-topbar)";
const SITE_CONTAINER_SNAP_DISTANCE = 20;

const appShellMainDensityClassName: Record<BlockDensity, string> = {
  compact: blockRecipe("blockCompact"),
  comfortable: "gap-[var(--xforge-space-6)]",
  default: blockRecipe("blockComfortable"),
};

function getSiteBodyGridClassName({
  hasLeftSidebar,
  hasRightSidebar,
}: {
  readonly hasLeftSidebar: boolean;
  readonly hasRightSidebar: boolean;
}): string {
  if (hasLeftSidebar && hasRightSidebar) {
    return "grid-cols-[auto_minmax(0,1fr)_auto]";
  }

  if (hasLeftSidebar) {
    return "grid-cols-[auto_minmax(0,1fr)]";
  }

  if (hasRightSidebar) {
    return "grid-cols-[minmax(0,1fr)_auto]";
  }

  return "grid-cols-1";
}

function useSiteContainerResize({
  desktopStageRef,
  isResizable,
  minHeight,
  minWidth,
  siteContainerConfig,
  siteContainerRef,
}: {
  readonly desktopStageRef: React.RefObject<HTMLElement | null>;
  readonly isResizable: boolean;
  readonly minHeight: number;
  readonly minWidth: number;
  readonly siteContainerConfig?: AppShellSiteContainerConfig;
  readonly siteContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [siteGeometry, setSiteGeometry] =
    useState<AppShellSiteContainerGeometry | null>(null);

  const siteContainerStyle = useMemo<CSSProperties | undefined>(() => {
    if (!siteGeometry) {
      return undefined;
    }

    return {
      bottom: "auto",
      height: `${siteGeometry.height}px`,
      left: `${siteGeometry.x}px`,
      right: "auto",
      top: `${siteGeometry.y}px`,
      width: `${siteGeometry.width}px`,
    };
  }, [siteGeometry]);

  const startResize = useCallback(
    (
      event: ReactPointerEvent<HTMLButtonElement>,
      intent: AppShellSiteContainerResizeIntent
    ) => {
      if (!isResizable) {
        return;
      }

      const desktopStage = desktopStageRef.current;
      const siteContainer = siteContainerRef.current;

      if (!(desktopStage && siteContainer)) {
        return;
      }

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);

      const stageRect = desktopStage.getBoundingClientRect();
      const containerRect = siteContainer.getBoundingClientRect();
      const start = {
        height: containerRect.height,
        pointerX: event.clientX,
        pointerY: event.clientY,
        width: containerRect.width,
        x: containerRect.left - stageRect.left,
        y: containerRect.top - stageRect.top,
      };
      const maxWidth =
        siteContainerConfig?.maxWidth ?? stageRect.width - start.x;
      const maxHeight =
        siteContainerConfig?.maxHeight ?? stageRect.height - start.y;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - start.pointerX;
        const deltaY = moveEvent.clientY - start.pointerY;
        let nextWidth = start.width;
        let nextHeight = start.height;

        if (intent === "resize-right") {
          nextWidth = Math.max(
            minWidth,
            Math.min(start.width + deltaX, maxWidth)
          );
        }

        if (intent === "resize-bottom") {
          nextHeight = Math.max(
            minHeight,
            Math.min(start.height + deltaY, maxHeight)
          );
        }

        const snappedRight =
          stageRect.width - (start.x + nextWidth) <=
          SITE_CONTAINER_SNAP_DISTANCE;
        const snappedBottom =
          stageRect.height - (start.y + nextHeight) <=
          SITE_CONTAINER_SNAP_DISTANCE;

        setSiteGeometry({
          height: snappedBottom ? stageRect.height - start.y : nextHeight,
          snappedBottom,
          snappedRight,
          width: snappedRight ? stageRect.width - start.x : nextWidth,
          x: start.x,
          y: start.y,
        });
      };

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp, { once: true });
    },
    [
      desktopStageRef,
      isResizable,
      minHeight,
      minWidth,
      siteContainerConfig?.maxHeight,
      siteContainerConfig?.maxWidth,
      siteContainerRef,
    ]
  );

  return {
    isBottomDocked:
      siteContainerConfig?.mode === "docked" || siteGeometry?.snappedBottom,
    isRightDocked:
      siteContainerConfig?.mode === "docked" || siteGeometry?.snappedRight,
    siteContainerStyle,
    startResize,
  };
}

interface AppShellAppSidebarColumnProps {
  readonly appSidebar: ReactNode;
  readonly appSidebarConfig?: AppShellSidebarConfig;
}

function AppShellAppSidebarColumn({
  appSidebar,
  appSidebarConfig,
}: AppShellAppSidebarColumnProps): ReactElement {
  const { state } = useSidebar();
  const expandedWidth =
    appSidebarConfig?.width ?? "var(--xforge-layout-sidebar)";
  const columnWidth =
    state === "collapsed" ? "var(--sidebar-width-icon)" : expandedWidth;
  const sidebarNode = (
    <Sidebar
      className={cn(
        "!absolute !inset-y-0 !h-full !max-h-full",
        appSidebarConfig?.className
      )}
      collapsible={appSidebarConfig?.collapsible ?? "icon"}
      variant={appSidebarConfig?.variant ?? "sidebar"}
    >
      {appSidebar}
      <SidebarRail />
    </Sidebar>
  );

  return (
    <aside
      aria-label="Application sidebar"
      className={cn(
        blockRecipe("blockRail"),
        "relative h-full min-h-0 shrink-0 self-stretch overflow-hidden border-r transition-transform duration-200 ease-linear motion-reduce:transition-none"
      )}
      data-slot="app-sidebar"
      data-state={state}
      style={
        {
          "--sidebar-width": columnWidth,
          width: columnWidth,
        } as CSSProperties
      }
    >
      {appSidebarConfig?.wrapper
        ? appSidebarConfig.wrapper(sidebarNode)
        : sidebarNode}
    </aside>
  );
}

interface AppShellSiteContainerProps {
  readonly auditEvidenceScopeSync?: ReactNode;
  readonly children?: ReactNode;
  readonly contentClassName?: string;
  readonly contentPadded?: boolean;
  readonly density?: BlockDensity;
  readonly desktopStageRef: React.RefObject<HTMLElement | null>;
  readonly siteBottomDrawer?: ReactNode;
  readonly siteContainerConfig?: AppShellSiteContainerConfig;
  readonly siteContainerRef: React.RefObject<HTMLDivElement | null>;
  readonly siteRightSidebar?: ReactNode;
  readonly siteSidebarConfig?: Omit<AppShellSidebarConfig, "wrapper">;
  readonly siteSidebarLeft?: ReactNode;
  readonly siteTopbar?: ReactNode;
}

function AppShellSiteContainer({
  auditEvidenceScopeSync,
  children,
  contentClassName,
  contentPadded = false,
  density = "default",
  desktopStageRef,
  siteBottomDrawer,
  siteContainerConfig,
  siteContainerRef,
  siteRightSidebar,
  siteSidebarConfig,
  siteSidebarLeft,
  siteTopbar,
}: AppShellSiteContainerProps): ReactElement {
  const isResizable = siteContainerConfig?.adjustable ?? false;
  const minWidth =
    siteContainerConfig?.minWidth ?? DEFAULT_SITE_CONTAINER_MIN_WIDTH;
  const minHeight =
    siteContainerConfig?.minHeight ?? DEFAULT_SITE_CONTAINER_MIN_HEIGHT;
  const isDockedMode = siteContainerConfig?.mode === "docked";
  const { isBottomDocked, isRightDocked, siteContainerStyle, startResize } =
    useSiteContainerResize({
      desktopStageRef,
      isResizable,
      minHeight,
      minWidth,
      siteContainerConfig,
      siteContainerRef,
    });

  return (
    <div
      className={cn(
        blockRecipe("blockPanel"),
        "absolute flex min-h-0 flex-col overflow-hidden",
        "top-[var(--app-shell-site-container-top)]",
        "right-[var(--app-shell-site-container-right)]",
        "bottom-[var(--app-shell-site-container-bottom)]",
        "left-[var(--app-shell-site-container-left)]",
        isRightDocked && "right-0 rounded-r-none border-r-0",
        isBottomDocked && "bottom-0 rounded-b-none border-b-0",
        isDockedMode && isRightDocked && "rounded-none shadow-none",
        siteContainerConfig?.className
      )}
      data-adjustable={isResizable ? "true" : "false"}
      data-site-container-mode={siteContainerConfig?.mode ?? "floating"}
      data-site-snapped-bottom={isBottomDocked ? "true" : "false"}
      data-site-snapped-right={isRightDocked ? "true" : "false"}
      data-slot="site-container"
      ref={siteContainerRef}
      style={siteContainerStyle}
    >
      {siteTopbar ? (
        <header
          className={cn(blockRecipe("blockChrome"), "shrink-0 overflow-hidden")}
          data-slot="site-topbar"
        >
          {siteTopbar}
        </header>
      ) : null}
      <div
        className={cn(
          "grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden",
          getSiteBodyGridClassName({
            hasLeftSidebar: Boolean(siteSidebarLeft),
            hasRightSidebar: Boolean(siteRightSidebar),
          })
        )}
        data-slot="site-body"
      >
        {siteSidebarLeft ? (
          <aside
            aria-label="Site sidebar"
            className={cn(
              blockRecipe("blockRail"),
              "border-r",
              siteSidebarConfig?.className
            )}
            data-slot="site-sidebar-left"
            style={
              {
                width: siteSidebarConfig?.width ?? DEFAULT_SITE_SIDEBAR_WIDTH,
              } as CSSProperties
            }
          >
            {siteSidebarLeft}
          </aside>
        ) : null}
        <section
          aria-label="Main content"
          className={cn(
            blockRecipe("blockShell", "blockStack"),
            "h-full min-h-0 min-w-0 content-start overflow-y-auto outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/25",
            appShellMainDensityClassName[density],
            contentPadded && blockRecipe("blockPanelPadding"),
            siteContainerConfig?.contentClassName,
            contentClassName
          )}
          data-slot="site-main"
        >
          {auditEvidenceScopeSync}
          {children}
        </section>
        {siteRightSidebar ? (
          <aside
            aria-label="Site right sidebar"
            className={cn(blockRecipe("blockRail"), "border-l")}
            data-slot="site-right-sidebar"
            style={
              {
                width: "var(--xforge-layout-audit-rail)",
              } as CSSProperties
            }
          >
            {siteRightSidebar}
          </aside>
        ) : null}
      </div>
      {siteBottomDrawer ? (
        <section
          className={cn(
            blockRecipe("blockSectionDivider", "blockPanelPadding"),
            "max-h-[var(--xforge-layout-site-bottom-drawer-max)] min-h-[var(--xforge-layout-site-bottom-drawer-min)] shrink-0 overflow-hidden bg-surface-muted/50"
          )}
          data-slot="site-bottom-drawer"
        >
          {siteBottomDrawer}
        </section>
      ) : null}
      {isResizable ? (
        <>
          <button
            aria-label="Resize site container width"
            className="absolute inset-y-8 right-0 z-[var(--xforge-z-sticky)] w-2 cursor-ew-resize bg-transparent outline-none hover:bg-border-default/60 focus-visible:bg-ring/30"
            data-slot="site-container-resize-right"
            onPointerDown={(event) => startResize(event, "resize-right")}
            type="button"
          />
          <button
            aria-label="Resize site container height"
            className="absolute right-8 bottom-0 left-8 z-[var(--xforge-z-sticky)] h-2 cursor-ns-resize bg-transparent outline-none hover:bg-border-default/60 focus-visible:bg-ring/30"
            data-slot="site-container-resize-bottom"
            onPointerDown={(event) => startResize(event, "resize-bottom")}
            type="button"
          />
        </>
      ) : null}
    </div>
  );
}

function AuthenticatedAppShellBlock({
  appSidebar,
  appSidebarConfig,
  appTopbar,
  appTopbarHeight = DEFAULT_APP_TOPBAR_HEIGHT,
  auditDock,
  auditDockPlacement = "right",
  auditEvidenceScopeSync,
  blockId,
  children,
  className,
  contentClassName,
  contentPadded = false,
  defaultOpen = true,
  density = "default",
  enableSidebarKeyboardShortcut: _enableSidebarKeyboardShortcut,
  intent = "operation",
  siteBottomDrawer,
  siteContainerConfig,
  siteRightSidebar,
  siteSidebarConfig,
  siteSidebarLeft,
  siteTopbar,
  state = "ready",
  tone = "neutral",
  style,
  ...props
}: AuthenticatedAppShellBlockProps): ReactElement {
  const desktopStageRef = useRef<HTMLElement | null>(null);
  const siteContainerRef = useRef<HTMLDivElement | null>(null);
  const siteRightSidebarContent =
    siteRightSidebar ??
    (auditDock && auditDockPlacement === "right" ? auditDock : null);
  const siteBottomAuditDock =
    auditDock && auditDockPlacement === "bottom" ? auditDock : null;
  const shellStyle = {
    "--app-shell-app-topbar-height": appTopbarHeight,
    "--app-shell-site-container-bottom":
      siteContainerConfig?.bottom ?? DEFAULT_SITE_CONTAINER_BOTTOM,
    "--app-shell-site-container-left":
      siteContainerConfig?.left ?? DEFAULT_SITE_CONTAINER_LEFT,
    "--app-shell-site-container-right":
      siteContainerConfig?.right ?? DEFAULT_SITE_CONTAINER_RIGHT,
    "--app-shell-site-container-top":
      siteContainerConfig?.top ?? DEFAULT_SITE_CONTAINER_TOP,
    "--workspace-app-nav-topbar-height": DEFAULT_SITE_TOPBAR_HEIGHT,
    ...style,
  } as CSSProperties;

  return (
    <SidebarProvider
      className={cn(blockRecipe("blockShell"), className)}
      defaultOpen={defaultOpen}
    >
      <section
        className={cn(
          blockRecipe("blockShell"),
          "grid h-svh min-h-svh overflow-hidden bg-surface-canvas text-sidebar-foreground",
          appTopbar
            ? "grid-rows-[var(--app-shell-app-topbar-height)_minmax(0,1fr)]"
            : "grid-rows-[minmax(0,1fr)]"
        )}
        data-block-id={blockId}
        data-density={density}
        data-intent={intent}
        data-slot="desktop-page"
        data-state={state}
        data-tone={tone}
        style={shellStyle}
        {...props}
      >
        {appTopbar ? (
          <header
            className={cn(
              blockRecipe("blockChrome"),
              "z-[var(--xforge-z-sticky)] min-h-0 overflow-hidden"
            )}
            data-slot="app-topbar"
          >
            {appTopbar}
          </header>
        ) : null}
        <div
          className={cn(
            "grid h-full min-h-0 overflow-hidden",
            appSidebar ? "grid-cols-[auto_minmax(0,1fr)]" : "grid-cols-1"
          )}
          data-slot="desktop-body"
        >
          {appSidebar ? (
            <AppShellAppSidebarColumn
              appSidebar={appSidebar}
              appSidebarConfig={appSidebarConfig}
            />
          ) : null}
          <main
            className={cn(blockRecipe("blockStage"), "h-full min-h-0")}
            data-slot="desktop-stage"
            ref={desktopStageRef}
          >
            <AppShellSiteContainer
              auditEvidenceScopeSync={auditEvidenceScopeSync}
              contentClassName={contentClassName}
              contentPadded={contentPadded}
              density={density}
              desktopStageRef={desktopStageRef}
              siteBottomDrawer={siteBottomDrawer}
              siteContainerConfig={siteContainerConfig}
              siteContainerRef={siteContainerRef}
              siteRightSidebar={siteRightSidebarContent}
              siteSidebarConfig={siteSidebarConfig}
              siteSidebarLeft={siteSidebarLeft}
              siteTopbar={siteTopbar}
            >
              {children}
            </AppShellSiteContainer>
            {siteBottomAuditDock ? (
              <aside
                className={cn(
                  blockRecipe("blockPanel"),
                  "absolute right-[var(--app-shell-site-container-right)] bottom-0 left-[var(--app-shell-site-container-left)] z-[var(--xforge-z-sticky)] max-h-[var(--xforge-layout-audit-dock-max)] overflow-hidden border-t"
                )}
                data-audit-dock-placement="bottom"
                data-slot="audit-dock"
              >
                {siteBottomAuditDock}
              </aside>
            ) : null}
          </main>
        </div>
      </section>
    </SidebarProvider>
  );
}

export { AuthenticatedAppShellBlock };
export type {
  AppShellAuditDockPlacement,
  AppShellSidebarConfig,
  AppShellSiteContainerConfig,
  AppShellSiteContainerGeometry,
  AppShellSiteContainerMode,
  AuthenticatedAppShellBlockProps,
};
