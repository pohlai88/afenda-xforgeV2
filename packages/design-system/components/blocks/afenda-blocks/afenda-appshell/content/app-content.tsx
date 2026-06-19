"use client";

import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import type { AfendaAppContentCssVars } from "../app-shell-css-vars";
import { APP_SHELL_RAIL_WIDTH } from "../app-shell-recipes";
import type { AfendaAppContentProps } from "../app-shell-types";
import { AfendaAppContentBottomDrawer } from "./app-content-bottom-drawer";
import { AfendaAppContentHeader } from "./app-content-header";
import {
  AfendaAppContentLayoutProvider,
  useAfendaAppContentLayout,
} from "./app-content-layout-context";
import { AfendaAppContentLeftRail } from "./app-content-left-rail";
import { AfendaAppContentRightRail } from "./app-content-right-rail";
import {
  APP_SHELL_CONTENT_CLOSED_RAIL_WIDTH,
  APP_SHELL_CONTENT_HEADER_TRIGGER_SIZE,
  appContentBentoGridClass,
  appContentBentoGridWithDrawerClass,
  appContentMainShellClass,
  appContentPanelClass,
} from "./content-recipes";

function AfendaAppContentInner({
  bottomDrawer,
  breadcrumbs,
  children,
  className,
  header,
  leftRail,
  rightRail,
  ...properties
}: Omit<
  AfendaAppContentProps,
  "defaultBottomDrawerOpen" | "defaultLeftRailOpen" | "defaultRightRailOpen"
>) {
  const { bottomDrawerOpen, leftRailOpen, rightRailOpen } =
    useAfendaAppContentLayout();

  return (
    <section
      className={cn(
        blockRecipe("blockShell"),
        appContentPanelClass,
        bottomDrawerOpen
          ? appContentBentoGridWithDrawerClass
          : appContentBentoGridClass,
        className
      )}
      data-bottom-drawer-open={bottomDrawerOpen ? "true" : "false"}
      data-left-rail-open={leftRailOpen ? "true" : "false"}
      data-right-rail-open={rightRailOpen ? "true" : "false"}
      data-slot="app-content"
      style={
        {
          "--app-shell-bottom-drawer-height": bottomDrawerOpen
            ? "var(--xforge-layout-site-bottom-drawer-min, 10rem)"
            : APP_SHELL_CONTENT_CLOSED_RAIL_WIDTH,
          "--app-shell-content-header-trigger-size":
            APP_SHELL_CONTENT_HEADER_TRIGGER_SIZE,
          "--app-shell-content-left-rail-width": leftRailOpen
            ? APP_SHELL_RAIL_WIDTH
            : APP_SHELL_CONTENT_CLOSED_RAIL_WIDTH,
          "--app-shell-content-right-rail-width": rightRailOpen
            ? APP_SHELL_RAIL_WIDTH
            : APP_SHELL_CONTENT_CLOSED_RAIL_WIDTH,
        } as AfendaAppContentCssVars
      }
      {...properties}
    >
      {header ?? <AfendaAppContentHeader breadcrumbs={breadcrumbs} />}
      {leftRailOpen
        ? (leftRail ?? (
            <AfendaAppContentLeftRail
              data-open={leftRailOpen ? "true" : "false"}
            />
          ))
        : null}
      <main
        className={cn(blockRecipe("blockShell"), appContentMainShellClass)}
        data-slot="app-content-main"
      >
        {children}
      </main>
      {rightRailOpen
        ? (rightRail ?? (
            <AfendaAppContentRightRail
              data-open={rightRailOpen ? "true" : "false"}
            />
          ))
        : null}
      {bottomDrawerOpen
        ? (bottomDrawer ?? <AfendaAppContentBottomDrawer />)
        : null}
    </section>
  );
}

export function AfendaAppContent({
  bottomDrawer,
  breadcrumbs,
  children,
  className,
  defaultBottomDrawerOpen,
  defaultLeftRailOpen,
  defaultRightRailOpen,
  header,
  leftRail,
  rightRail,
  ...properties
}: AfendaAppContentProps) {
  return (
    <AfendaAppContentLayoutProvider
      defaultBottomDrawerOpen={defaultBottomDrawerOpen}
      defaultLeftRailOpen={defaultLeftRailOpen}
      defaultRightRailOpen={defaultRightRailOpen}
    >
      <AfendaAppContentInner
        bottomDrawer={bottomDrawer}
        breadcrumbs={breadcrumbs}
        {...{ className }}
        header={header}
        leftRail={leftRail}
        rightRail={rightRail}
        {...properties}
      >
        {children}
      </AfendaAppContentInner>
    </AfendaAppContentLayoutProvider>
  );
}
