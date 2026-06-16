"use client";

import { useIsMobile } from "@repo/design-system/hooks/use-mobile";
import { cn } from "@repo/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "./button";
import { Kbd } from "./kbd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import { recipe } from "./recipes";
import {
  persistSidebarBehaviorMode,
  readSidebarBehaviorCookie,
  resolveEffectiveSidebarOpen,
  resolveInitialSidebarOpen,
  SIDEBAR_BEHAVIOR_OPTIONS,
  type SidebarBehaviorMode,
} from "./sidebar-behavior";
import {
  sidebarIconRailControlTriggerClass,
  sidebarIconRailInnerClass,
  sidebarIconRailMenuButtonClass,
  sidebarIconRailMenuClass,
  sidebarIconRailNavGroupClass,
  sidebarIconRailWidth,
} from "./sidebar-rail-recipes";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const SIDEBAR_WIDTH = "17rem";
const SIDEBAR_WIDTH_MOBILE = "20rem";
const SIDEBAR_WIDTH_ICON = sidebarIconRailWidth;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export interface SidebarMenuTooltipProps {
  readonly description?: string;
  readonly label: string;
  readonly shortcut?: string;
}

function isSidebarMenuTooltip(
  value: SidebarMenuButtonTooltip
): value is SidebarMenuTooltipProps {
  return (
    typeof value === "object" &&
    value !== null &&
    "label" in value &&
    typeof value.label === "string"
  );
}

type SidebarMenuButtonTooltip =
  | React.ComponentProps<typeof TooltipContent>
  | SidebarMenuTooltipProps
  | string;

function SidebarMenuTooltipContent({
  description,
  label,
  shortcut,
}: SidebarMenuTooltipProps) {
  return (
    <>
      <span className="font-medium text-[11px] leading-4">{label}</span>
      {description ? (
        <span className="text-[10px] text-text-inverse/75 leading-snug">
          {description}
        </span>
      ) : null}
      {shortcut ? (
        <Kbd
          className={cn(
            "h-4 w-fit border-border-subtle/40 bg-surface-inverse/20 px-1",
            "font-mono text-[9px] text-text-inverse/90 tabular-nums"
          )}
        >
          {shortcut}
        </Kbd>
      ) : null}
    </>
  );
}

interface SidebarContextProps {
  behaviorMode: SidebarBehaviorMode;
  isMobile: boolean;
  open: boolean;
  openMobile: boolean;
  setBehaviorMode: (mode: SidebarBehaviorMode) => void;
  setHoverPeek: (peek: boolean) => void;
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  state: "expanded" | "collapsed";
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  behaviorMode: behaviorModeProp,
  defaultBehaviorMode = "expanded",
  defaultOpen = true,
  onBehaviorModeChange,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  behaviorMode?: SidebarBehaviorMode;
  defaultBehaviorMode?: SidebarBehaviorMode;
  defaultOpen?: boolean;
  onBehaviorModeChange?: (mode: SidebarBehaviorMode) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [hoverPeek, setHoverPeek] = useState(false);
  const initialBehaviorMode =
    readSidebarBehaviorCookie() ?? defaultBehaviorMode;
  const [_behaviorMode, _setBehaviorMode] =
    useState<SidebarBehaviorMode>(initialBehaviorMode);
  const behaviorMode = behaviorModeProp ?? _behaviorMode;
  const [_open, _setOpen] = useState(() =>
    resolveInitialSidebarOpen(initialBehaviorMode, defaultOpen)
  );
  const open = openProp ?? _open;

  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState =
        typeof value === "function" ? value(openProp ?? _open) : value;

      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [openProp, setOpenProp]
  );

  const setBehaviorMode = useCallback(
    (mode: SidebarBehaviorMode) => {
      if (behaviorModeProp === undefined) {
        _setBehaviorMode(mode);
      }

      onBehaviorModeChange?.(mode);
      persistSidebarBehaviorMode(mode);
      setHoverPeek(false);

      if (mode === "expanded") {
        setOpen(true);
        return;
      }

      setOpen(false);
    },
    [behaviorModeProp, onBehaviorModeChange, setOpen]
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const effectiveOpen = resolveEffectiveSidebarOpen({
    behaviorMode,
    hoverPeek,
    open,
  });
  const state = effectiveOpen ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      behaviorMode,
      state,
      open: effectiveOpen,
      setBehaviorMode,
      setHoverPeek,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [
      behaviorMode,
      effectiveOpen,
      isMobile,
      openMobile,
      setBehaviorMode,
      setOpen,
      state,
      toggleSidebar,
    ]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={350} skipDelayDuration={100}>
        <div
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-surface-muted",
            recipe("bodyText"),
            className
          )}
          data-behavior-mode={behaviorMode}
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, setHoverPeek, behaviorMode, state, openMobile, setOpenMobile } =
    useSidebar();

  const handlePointerEnter = useCallback(() => {
    if (behaviorMode === "hover") {
      setHoverPeek(true);
    }
  }, [behaviorMode, setHoverPeek]);

  const handlePointerLeave = useCallback(() => {
    if (behaviorMode === "hover") {
      setHoverPeek(false);
    }
  }, [behaviorMode, setHoverPeek]);

  if (collapsible === "none") {
    return (
      <div
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col border-border-default bg-surface-raised text-text-primary",
          recipe("bodyText"),
          className
        )}
        data-slot="sidebar"
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetContent
          className="w-(--sidebar-width) p-0 [&>button]:hidden"
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          side={side}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-text-primary md:block"
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
    >
      <div
        className={cn(
          "relative w-(--sidebar-width) bg-transparent",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
        data-slot="sidebar-gap"
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          "transition-[width] duration-200 ease-linear motion-reduce:transition-none",
          className
        )}
        data-slot="sidebar-container"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        <div
          className={cn(
            "flex h-full w-full flex-col bg-surface-raised",
            sidebarIconRailInnerClass,
            "group-data-[variant=floating]:rounded-[var(--card-radius)] group-data-[variant=floating]:border group-data-[variant=floating]:border-border-default group-data-[variant=floating]:shadow-panel"
          )}
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className={cn(className)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      size="icon-sm"
      variant="quiet"
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarControlMenu({
  align = "start",
  className,
  menuLabel = "Sidebar control",
  side = "top",
  triggerLabel = "Open sidebar control",
}: {
  readonly align?: "center" | "end" | "start";
  readonly className?: string;
  readonly menuLabel?: string;
  readonly side?: "bottom" | "left" | "right" | "top";
  readonly triggerLabel?: string;
}) {
  const { behaviorMode, setBehaviorMode } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={triggerLabel}
          className={cn(sidebarIconRailControlTriggerClass, className)}
          data-slot="sidebar-control-trigger"
          size="icon-sm"
          type="button"
          variant="quiet"
        >
          <PanelLeftIcon
            aria-hidden="true"
            className="size-[18px] stroke-[1.65] transition-opacity duration-150 ease-out"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="min-w-48"
        data-slot="sidebar-control-menu"
        side={side}
      >
        <DropdownMenuLabel className="px-2 py-1.5 font-normal text-[11px] text-text-tertiary">
          {menuLabel}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SIDEBAR_BEHAVIOR_OPTIONS.map((option) => (
          <DropdownMenuItem
            className="gap-2 text-[12px]"
            key={option.id}
            onSelect={() => {
              setBehaviorMode(option.id);
            }}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 shrink-0 rounded-full bg-current transition-opacity",
                behaviorMode === option.id ? "opacity-100" : "opacity-0"
              )}
            />
            <span className="min-w-0 flex-1">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      aria-label="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-transparent hover:after:bg-border-default sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        recipe("colorTransition", "motionReduce"),
        className
      )}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title="Toggle Sidebar"
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "relative flex w-full flex-1 flex-col bg-canvas",
        "md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-[var(--card-radius)] md:peer-data-[variant=inset]:shadow-panel",
        recipe("motionReduce"),
        className
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn("h-8 w-full shadow-none", className)}
      data-sidebar="input"
      data-slot="sidebar-input"
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-2",
        recipe("motionReduce"),
        className
      )}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-2",
        recipe("motionReduce"),
        className
      )}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("mx-2 w-auto bg-border-default", className)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-hidden group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:overflow-hidden",
        recipe("motionReduce"),
        className
      )}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex w-full min-w-0 flex-col p-2",
        sidebarIconRailNavGroupClass,
        recipe("motionReduce"),
        className
      )}
      data-sidebar="group"
      data-slot="sidebar-group"
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : "div";

  return (
    <Comp
      className={cn(
        "flex h-8 shrink-0 items-center rounded-[var(--xforge-radius-sm)] px-2 text-text-secondary outline-none transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0",
        recipe(
          "metadataText",
          "focusRingOnly",
          "mutedControlIcon",
          "motionReduce"
        ),
        className
      )}
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  return (
    <Comp
      className={cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-[var(--xforge-radius-sm)] p-0 text-text-secondary outline-none after:absolute after:-inset-2 hover:bg-surface-hover hover:text-text-primary group-data-[collapsible=icon]:hidden md:after:hidden",
        recipe(
          "colorTransition",
          "focusRingOnly",
          "mutedControlIcon",
          "motionReduce"
        ),
        className
      )}
      data-sidebar="group-action"
      data-slot="sidebar-group-action"
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("w-full", recipe("bodyText"), className)}
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "flex w-full min-w-0 flex-col gap-1",
        sidebarIconRailMenuClass,
        recipe("motionReduce"),
        className
      )}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "group/menu-item relative",
        recipe("motionReduce"),
        className
      )}
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-[var(--xforge-radius-sm)] p-2 text-left text-text-secondary outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    "hover:bg-surface-hover hover:text-text-primary active:bg-surface-active active:text-text-primary",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "data-[active=true]:bg-surface-active data-[active=true]:text-text-primary",
    "data-[state=open]:hover:bg-surface-hover data-[state=open]:hover:text-text-primary",
    "group-has-data-[sidebar=menu-action]/menu-item:pr-8",
    sidebarIconRailMenuButtonClass,
    "[&>span:last-child]:truncate",
    recipe(
      "colorTransition",
      "mutedControlIcon",
      "motionReduce"
    ),
  ],
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-border-default bg-surface-raised",
      },
      size: {
        default: "h-8",
        sm: "h-7 text-[12px]",
        lg: "h-12 group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  type,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: SidebarMenuButtonTooltip;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      data-active={isActive}
      data-sidebar="menu-button"
      data-size={size}
      data-slot="sidebar-menu-button"
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string" || isSidebarMenuTooltip(tooltip)) {
    const tooltipProps = isSidebarMenuTooltip(tooltip)
      ? tooltip
      : { label: tooltip };

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          align="center"
          className="grid max-w-56 gap-1 px-2 py-1.5"
          hidden={state !== "collapsed" || isMobile}
          side="right"
          sideOffset={8}
        >
          <SidebarMenuTooltipContent {...tooltipProps} />
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  type,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  return (
    <Comp
      className={cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-[var(--xforge-radius-sm)] p-0 text-text-secondary outline-none after:absolute after:-inset-2 hover:bg-surface-hover hover:text-text-primary peer-hover/menu-button:text-text-primary group-data-[collapsible=icon]:hidden md:after:hidden",
        "peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-text-primary md:opacity-0",
        recipe(
          "colorTransition",
          "focusRingOnly",
          "mutedControlIcon",
          "motionReduce"
        ),
        className
      )}
      data-sidebar="menu-action"
      data-slot="sidebar-menu-action"
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-[var(--xforge-radius-sm)] px-1 text-text-secondary peer-hover/menu-button:text-text-primary group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-[active=true]/menu-button:text-text-primary",
        recipe("badgeText"),
        className
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-2 rounded-[var(--xforge-radius-sm)] px-2",
        recipe("motionReduce"),
        className
      )}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-[var(--xforge-radius-sm)]"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton className="h-4 flex-1" data-sidebar="menu-skeleton-text" />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-border-default border-l px-2.5 py-0.5 group-data-[collapsible=icon]:hidden",
        recipe("motionReduce"),
        className
      )}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "group/menu-sub-item relative",
        recipe("motionReduce"),
        className
      )}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? SlotPrimitive.Slot : "a";

  return (
    <Comp
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-[var(--xforge-radius-sm)] px-2 text-text-secondary outline-none hover:bg-surface-hover hover:text-text-primary active:bg-surface-active active:text-text-primary disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-surface-active data-[active=true]:text-text-primary group-data-[collapsible=icon]:hidden [&>span:last-child]:truncate",
        size === "sm" && "text-[12px]",
        size === "md" && "text-[13px]",
        recipe(
          "colorTransition",
          "focusRingOnly",
          "mutedControlIcon",
          "motionReduce"
        ),
        className
      )}
      data-active={isActive}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-slot="sidebar-menu-sub-button"
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarControlMenu,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};

export type { SidebarBehaviorMode } from "./sidebar-behavior";
export { SIDEBAR_BEHAVIOR_OPTIONS } from "./sidebar-behavior";
