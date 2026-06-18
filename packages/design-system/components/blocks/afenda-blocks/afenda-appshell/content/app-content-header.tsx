"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../afenda-ui/breadcrumb";
import { Button } from "../../../../afenda-ui/button";
import { cn } from "../../../../../lib/utils";
import {
  PanelBottomDashedIcon,
  PanelLeftDashedIcon,
  PanelRightDashedIcon,
} from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type {
  AfendaAppContentBreadcrumbItem,
  AfendaAppContentHeaderProps,
} from "../app-shell-types";
import { useAfendaAppContentLayout } from "./app-content-layout-context";
import {
  appContentHeaderActionsClass,
  appContentHeaderBreadcrumbsClass,
  appContentHeaderShellClass,
  appContentHeaderTriggerClass,
} from "./content-recipes";

function AfendaAppContentHeaderBreadcrumbs({
  items,
}: {
  readonly items: readonly AfendaAppContentBreadcrumbItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  const breadcrumbs = items;

  return (
    <Breadcrumb className={cn(appContentHeaderBreadcrumbsClass)}>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <span className="contents" key={`${item.label}-${index}`}>
              <BreadcrumbItem className={isLast ? "min-w-0 shrink" : undefined}>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="truncate">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="truncate" href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : (
                <BreadcrumbSeparator className="hidden shrink-0 sm:inline-flex" />
              )}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

interface AppContentHeaderTriggerProps
  extends Omit<ComponentPropsWithoutRef<typeof Button>, "size" | "variant"> {
  readonly icon: ReactNode;
  readonly pressed: boolean;
}

function AppContentHeaderTrigger({
  className,
  icon,
  pressed,
  ...properties
}: AppContentHeaderTriggerProps) {
  return (
    <Button
      className={cn(appContentHeaderTriggerClass, className)}
      data-pressed={pressed ? "true" : "false"}
      size="icon-sm"
      type="button"
      variant="quiet"
      {...properties}
    >
      {icon}
    </Button>
  );
}

export function AfendaAppContentHeader({
  breadcrumbs,
  children,
  className,
  ...properties
}: AfendaAppContentHeaderProps) {
  const {
    bottomDrawerOpen,
    leftRailOpen,
    rightRailOpen,
    toggleBottomDrawer,
    toggleLeftRail,
    toggleRightRail,
  } = useAfendaAppContentLayout();

  if (children) {
    return (
      <div
        className={cn(appContentHeaderShellClass, className)}
        data-slot="app-content-header"
        {...properties}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(appContentHeaderShellClass, className)}
      data-slot="app-content-header"
      {...properties}
    >
      <AppContentHeaderTrigger
        aria-controls="app-content-left-rail"
        aria-expanded={leftRailOpen}
        aria-label={leftRailOpen ? "Hide left rail" : "Show left rail"}
        aria-pressed={leftRailOpen}
        data-slot="app-content-left-rail-trigger"
        icon={<PanelLeftDashedIcon aria-hidden="true" className="size-4" />}
        onClick={toggleLeftRail}
        pressed={leftRailOpen}
      />

      <AfendaAppContentHeaderBreadcrumbs items={breadcrumbs ?? []} />

      <div className={cn(appContentHeaderActionsClass)}>
        <AppContentHeaderTrigger
          aria-controls="app-content-bottom-drawer"
          aria-expanded={bottomDrawerOpen}
          aria-label={
            bottomDrawerOpen ? "Hide evidence drawer" : "Show evidence drawer"
          }
          aria-pressed={bottomDrawerOpen}
          data-slot="app-content-bottom-drawer-trigger"
          icon={<PanelBottomDashedIcon aria-hidden="true" className="size-4" />}
          onClick={toggleBottomDrawer}
          pressed={bottomDrawerOpen}
        />
        <AppContentHeaderTrigger
          aria-controls="app-content-right-rail"
          aria-expanded={rightRailOpen}
          aria-label={rightRailOpen ? "Hide right rail" : "Show right rail"}
          aria-pressed={rightRailOpen}
          data-slot="app-content-right-rail-trigger"
          icon={<PanelRightDashedIcon aria-hidden="true" className="size-4" />}
          onClick={toggleRightRail}
          pressed={rightRailOpen}
        />
      </div>
    </div>
  );
}
