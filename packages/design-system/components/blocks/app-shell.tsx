"use client";

import {
  type Sidebar,
  SidebarProvider,
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
import type { BlockBaseProps } from "./foundation";

type AppShellAuditDockPlacement = "bottom" | "right";
type AppShellSiteContainerMode = "floating" | "docked";
type AppShellSiteContainerResizeIntent =
  | "resize-bottom"
  | "resize-corner"
  | "resize-right";

const DEFAULT_SITE_CONTAINER_BOTTOM = "1.5rem";
const DEFAULT_SITE_CONTAINER_LEFT = "18rem";
const DEFAULT_SITE_CONTAINER_RIGHT = "2rem";
const DEFAULT_SITE_CONTAINER_TOP = "3rem";
const DEFAULT_APP_TOPBAR_HEIGHT = "2.75rem";
const DEFAULT_SITE_CONTAINER_MIN_HEIGHT = 360;
const DEFAULT_SITE_CONTAINER_MIN_WIDTH = 640;
const SITE_CONTAINER_SNAP_DISTANCE = 20;

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

function AuthenticatedAppShellBlock({
  appSidebar: _appSidebar,
  appSidebarConfig: _appSidebarConfig,
  appTopbar,
  appTopbarHeight = DEFAULT_APP_TOPBAR_HEIGHT,
  auditDock: _auditDock,
  auditDockPlacement: _auditDockPlacement,
  auditEvidenceScopeSync: _auditEvidenceScopeSync,
  blockId,
  children: _children,
  className,
  contentClassName: _contentClassName,
  contentPadded: _contentPadded,
  defaultOpen: _defaultOpen,
  density = "default",
  enableSidebarKeyboardShortcut: _enableSidebarKeyboardShortcut,
  intent = "operation",
  siteBottomDrawer: _siteBottomDrawer,
  siteContainerConfig,
  siteRightSidebar: _siteRightSidebar,
  siteSidebarConfig: _siteSidebarConfig,
  siteSidebarLeft: _siteSidebarLeft,
  siteTopbar: _siteTopbar,
  state = "ready",
  tone = "neutral",
  style,
  ...props
}: AuthenticatedAppShellBlockProps): ReactElement {
  const desktopPageRef = useRef<HTMLElement | null>(null);
  const siteContainerRef = useRef<HTMLElement | null>(null);
  const [siteGeometry, setSiteGeometry] =
    useState<AppShellSiteContainerGeometry | null>(null);
  const isResizable = siteContainerConfig?.adjustable ?? true;
  const minWidth =
    siteContainerConfig?.minWidth ?? DEFAULT_SITE_CONTAINER_MIN_WIDTH;
  const minHeight =
    siteContainerConfig?.minHeight ?? DEFAULT_SITE_CONTAINER_MIN_HEIGHT;
  const desktopPageStyle = {
    "--app-shell-app-topbar-height": appTopbarHeight,
    "--app-shell-site-container-bottom":
      siteContainerConfig?.bottom ?? DEFAULT_SITE_CONTAINER_BOTTOM,
    "--app-shell-site-container-left":
      siteContainerConfig?.left ?? DEFAULT_SITE_CONTAINER_LEFT,
    "--app-shell-site-container-right":
      siteContainerConfig?.right ?? DEFAULT_SITE_CONTAINER_RIGHT,
    "--app-shell-site-container-top":
      siteContainerConfig?.top ?? DEFAULT_SITE_CONTAINER_TOP,
    ...style,
  } as CSSProperties;
  const isDockedSiteContainer =
    siteContainerConfig?.mode === "docked" || siteGeometry?.snappedRight;
  const isBottomDockedSiteContainer =
    siteContainerConfig?.mode === "docked" || siteGeometry?.snappedBottom;
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

      const desktopPage = desktopPageRef.current;
      const siteContainer = siteContainerRef.current;

      if (!(desktopPage && siteContainer)) {
        return;
      }

      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);

      const pageRect = desktopPage.getBoundingClientRect();
      const containerRect = siteContainer.getBoundingClientRect();
      const start = {
        height: containerRect.height,
        pointerX: event.clientX,
        pointerY: event.clientY,
        width: containerRect.width,
        x: containerRect.left - pageRect.left,
        y: containerRect.top - pageRect.top,
      };
      const maxWidth =
        siteContainerConfig?.maxWidth ?? pageRect.width - start.x;
      const maxHeight =
        siteContainerConfig?.maxHeight ?? pageRect.height - start.y;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - start.pointerX;
        const deltaY = moveEvent.clientY - start.pointerY;
        let nextWidth = start.width;
        let nextHeight = start.height;

        if (intent === "resize-right" || intent === "resize-corner") {
          nextWidth = Math.max(
            minWidth,
            Math.min(start.width + deltaX, maxWidth)
          );
        }

        if (intent === "resize-bottom" || intent === "resize-corner") {
          nextHeight = Math.max(
            minHeight,
            Math.min(start.height + deltaY, maxHeight)
          );
        }

        const snappedRight =
          pageRect.width - (start.x + nextWidth) <=
          SITE_CONTAINER_SNAP_DISTANCE;
        const snappedBottom =
          pageRect.height - (start.y + nextHeight) <=
          SITE_CONTAINER_SNAP_DISTANCE;

        setSiteGeometry({
          height: snappedBottom ? pageRect.height - start.y : nextHeight,
          snappedBottom,
          snappedRight,
          width: snappedRight ? pageRect.width - start.x : nextWidth,
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
      isResizable,
      minHeight,
      minWidth,
      siteContainerConfig?.maxHeight,
      siteContainerConfig?.maxWidth,
    ]
  );

  return (
    <section
      className={cn(
        blockRecipe("blockShell"),
        "relative h-svh min-h-svh w-full overflow-hidden bg-[#101410] text-sidebar-foreground",
        className
      )}
      data-block-id={blockId}
      data-density={density}
      data-intent={intent}
      data-slot="desktop-page"
      data-state={state}
      data-tone={tone}
      ref={desktopPageRef}
      style={desktopPageStyle}
      {...props}
    >
      {appTopbar ? (
        <header
          className="absolute inset-x-0 top-0 z-layer-sticky h-[var(--app-shell-app-topbar-height)] overflow-hidden"
          data-slot="app-topbar"
        >
          <SidebarProvider className="contents">{appTopbar}</SidebarProvider>
        </header>
      ) : null}
      <section
        aria-label="Site container"
        className={cn(
          "absolute top-[var(--app-shell-site-container-top)] right-[var(--app-shell-site-container-right)] bottom-[var(--app-shell-site-container-bottom)] left-[var(--app-shell-site-container-left)] overflow-hidden border border-border-default/70 bg-[#121812] shadow-panel",
          "rounded-[18px]",
          isDockedSiteContainer && "right-0 rounded-r-none border-r-0",
          isBottomDockedSiteContainer && "bottom-0 rounded-b-none border-b-0",
          siteContainerConfig?.className
        )}
        data-adjustable={isResizable ? "true" : "false"}
        data-site-container-mode={siteContainerConfig?.mode ?? "floating"}
        data-site-snapped-bottom={
          isBottomDockedSiteContainer ? "true" : "false"
        }
        data-site-snapped-right={isDockedSiteContainer ? "true" : "false"}
        data-slot="site-container"
        ref={siteContainerRef}
        style={siteContainerStyle}
      >
        {isResizable ? (
          <>
            <button
              aria-label="Resize site container width"
              className="absolute inset-y-8 right-0 z-layer-sticky w-2 cursor-ew-resize bg-transparent outline-none hover:bg-border-default/60 focus-visible:bg-ring/30"
              data-slot="site-container-resize-right"
              onPointerDown={(event) => startResize(event, "resize-right")}
              type="button"
            />
            <button
              aria-label="Resize site container height"
              className="absolute right-8 bottom-0 left-8 z-layer-sticky h-2 cursor-ns-resize bg-transparent outline-none hover:bg-border-default/60 focus-visible:bg-ring/30"
              data-slot="site-container-resize-bottom"
              onPointerDown={(event) => startResize(event, "resize-bottom")}
              type="button"
            />
            <button
              aria-label="Resize site container"
              className="absolute right-1 bottom-1 z-layer-sticky size-4 cursor-nwse-resize rounded-[3px] border-border-default border-r border-b bg-transparent outline-none hover:bg-border-default/60 focus-visible:ring-2 focus-visible:ring-ring"
              data-slot="site-container-resize-corner"
              onPointerDown={(event) => startResize(event, "resize-corner")}
              type="button"
            />
          </>
        ) : null}
      </section>
    </section>
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
