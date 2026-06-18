"use client";

import { sidebarIconRailBlockItemClass } from "../../../afenda-ui/sidebar-rail-recipes";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";
import { blockRecipe } from "../../block-recipes";
import { resolveSidebarLinkRenderer } from "./sidebar-link";
import type { SidebarLinkRenderer } from "./sidebar-link";
import { cn } from "../../../../lib/utils";
import { GalleryVerticalEndIcon } from "lucide-react";
import { memo, type ComponentPropsWithoutRef, type ComponentType } from "react";

const MAIN_NAV_GROUP_LABEL = "Main navigation";

const navGroupShellClass = "min-w-0 gap-1 p-0";

const navGroupLabelClass = "px-2 tracking-[0.04em]";

const navItemBaseClass =
  "group flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[12px] leading-4 transition-colors duration-80";

const navItemIdleClass = [
  "text-sidebar-foreground/88 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
  sidebarIconRailBlockItemClass,
].join(" ");

const navItemSelectedClass = [
  "relative bg-brand-primary/10 font-medium text-brand-primary before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-brand-primary",
  "group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:font-normal group-data-[collapsible=icon]:text-brand-primary group-data-[collapsible=icon]:before:content-none",
  sidebarIconRailBlockItemClass,
].join(" ");

const navItemIconClass = "size-4 shrink-0";

const navItemLabelClass =
  "min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden";

type NavMainIcon = ComponentType<{ readonly className?: string }>;

type NavMainIconProps = ComponentPropsWithoutRef<"svg">;

function NavMainIconBase({ children, className, ...props }: NavMainIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {children}
    </svg>
  );
}

function OrbitCaseIcon(props: NavMainIconProps) {
  return (
    <NavMainIconBase {...props}>
      <path d="M8 10.5V8.75A1.75 1.75 0 0 1 9.75 7h4.5A1.75 1.75 0 0 1 16 8.75v1.75" />
      <path d="M7 10.5h10a1.5 1.5 0 0 1 1.5 1.5v5.25A1.75 1.75 0 0 1 16.75 19h-9.5a1.75 1.75 0 0 1-1.75-1.75V12A1.5 1.5 0 0 1 7 10.5Z" />
      <path d="M12 13.25v3" />
      <path d="M10.5 14.75h3" />
      <path d="M4.5 8.25c1.4-2.35 4.08-3.9 7.12-3.9 4.12 0 7.58 2.8 7.58 6.25 0 1.55-.7 2.98-1.88 4.08" />
      <path d="M19.5 15.75c-1.4 2.35-4.08 3.9-7.12 3.9-4.12 0-7.58-2.8-7.58-6.25 0-1.55.7-2.98 1.88-4.08" />
    </NavMainIconBase>
  );
}

function NexusNetIcon(props: NavMainIconProps) {
  return (
    <NavMainIconBase {...props}>
      <path d="M4 12a8 8 0 0 1 16 0" />
      <path d="M6.3 17.7a8 8 0 0 0 11.4 0" />
      <path d="M12 4v4.2" />
      <path d="M12 15v5" />
      <path d="M4 12h4.8" />
      <path d="M15.2 12H20" />
      <path d="m5.8 8.2 4.25 2.6" />
      <path d="m18.2 8.2-4.25 2.6" />
      <path d="m6.8 16.7 3.55-2.75" />
      <path d="m17.2 16.7-3.55-2.75" />
      <path d="M7.5 12c1.25-1.45 3.05-2.05 4.5-2.05s3.25.6 4.5 2.05" />
      <path d="M7.5 12c1.25 1.45 3.05 2.05 4.5 2.05s3.25-.6 4.5-2.05" />
      <circle cx="12" cy="9.45" r="1.15" />
      <ellipse cx="12" cy="12.7" rx="1.9" ry="2.35" />
      <path d="m10.45 11.65-2.3-.8" />
      <path d="m13.55 11.65 2.3-.8" />
      <path d="m10.4 12.8-2.75.45" />
      <path d="m13.6 12.8 2.75.45" />
      <path d="m10.7 14.05-2.05 1.45" />
      <path d="m13.3 14.05 2.05 1.45" />
    </NavMainIconBase>
  );
}

function ArcanaVaultIcon(props: NavMainIconProps) {
  return (
    <NavMainIconBase {...props}>
      <path d="M12 3.5c4.15 0 7.5 3.35 7.5 7.5" />
      <path d="M4.5 11c0-4.15 3.35-7.5 7.5-7.5" />
      <path d="M5.65 15.5c-.72-1.22-1.15-2.72-1.15-4.5" />
      <path d="M18.35 15.5c.72-1.22 1.15-2.72 1.15-4.5" />
      <path d="M8 11a4 4 0 0 1 8 0" />
      <path d="M8.7 17.25A8 8 0 0 1 8 11" />
      <path d="M16 11c0 3.1-.72 5.55-2.15 7.35" />
      <path d="M11.85 20.5C13.25 18.6 14 15.4 14 11a2 2 0 0 0-4 0" />
      <path d="M10 11c0 2.7.4 4.82 1.2 6.35" />
      <path d="M6.75 19.2c-.5-.62-.95-1.32-1.35-2.1" />
    </NavMainIconBase>
  );
}

function CodexDriveIcon(props: NavMainIconProps) {
  return (
    <NavMainIconBase {...props}>
      <path d="M5 7.25 12 4l7 3.25-7 3.25L5 7.25Z" />
      <path d="m5 12 7 3.25L19 12" />
      <path d="m5 16.75 7 3.25 7-3.25" />
      <path d="M5 7.25v4.75" />
      <path d="M19 7.25v4.75" />
      <path d="M12 10.5v9.5" />
    </NavMainIconBase>
  );
}

export interface NavMainItem {
  readonly description?: string;
  readonly href: string;
  readonly icon?: NavMainIcon;
  readonly id: string;
  readonly label: string;
}

export const DEFAULT_NAV_MAIN_ITEMS: readonly NavMainItem[] = [
  {
    id: "orbit-case",
    label: "Orbit Case",
    href: "/orbit-case",
    icon: OrbitCaseIcon,
    description:
      "Start a case for inquiry, approval, complaint, incident, request, investigation, or opportunity.",
  },
  {
    id: "nexus-net",
    label: "Nexus Net",
    href: "/",
    icon: NexusNetIcon,
    description:
      "Open the operational map, local workspace widgets, and tenant shortcuts.",
  },
  {
    id: "arcana-vault",
    label: "Arcana Vault",
    href: "/arcana-vault",
    icon: ArcanaVaultIcon,
    description:
      "Open the user-owned room for drafts, notes, bookmarks, pins, and private files.",
  },
  {
    id: "codex-drive",
    label: "Codex Drive",
    href: "/codex-drive",
    icon: CodexDriveIcon,
    description:
      "Retrieve uploaded, shared, downloaded, and bucket-backed objects.",
  },
];

export interface NavMainProps {
  readonly activeItemIds?: ReadonlySet<string>;
  readonly className?: string;
  readonly groupLabel?: string;
  readonly items?: readonly NavMainItem[];
  readonly renderLink?: SidebarLinkRenderer;
}

const NavMainItemRow = memo(function NavMainItemRow({
  item,
  renderLink,
  selected,
}: {
  readonly item: NavMainItem;
  readonly renderLink: ReturnType<typeof resolveSidebarLinkRenderer>;
  readonly selected: boolean;
}) {
  const Icon = item.icon ?? GalleryVerticalEndIcon;

  return (
    <SidebarMenuItem data-slot={`nav-main-item-${item.id}`}>
      <SidebarMenuButton
        asChild
        className={cn(
          navItemBaseClass,
          selected ? navItemSelectedClass : navItemIdleClass
        )}
        isActive={selected}
        tooltip={{
          description: item.description,
          label: item.label,
        }}
      >
        {renderLink({
          "aria-current": selected ? "page" : undefined,
          className: "",
          href: item.href,
          children: (
            <>
              <Icon className={navItemIconClass} />
              <span className={navItemLabelClass}>{item.label}</span>
            </>
          ),
        })}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

export const NavMain = memo(function NavMain({
  activeItemIds = new Set<string>(),
  className,
  groupLabel = MAIN_NAV_GROUP_LABEL,
  items = DEFAULT_NAV_MAIN_ITEMS,
  renderLink,
}: NavMainProps) {
  const linkRenderer = resolveSidebarLinkRenderer(renderLink);

  if (items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup
      className={cn(navGroupShellClass, className)}
      data-slot="nav-main"
    >
      <SidebarGroupLabel
        className={cn(blockRecipe("blockMetricLabel"), navGroupLabelClass)}
      >
        {groupLabel}
      </SidebarGroupLabel>
      <SidebarMenu data-slot="nav-main-items">
        {items.map((item) => (
          <NavMainItemRow
            item={item}
            key={item.id}
            renderLink={linkRenderer}
            selected={activeItemIds.has(item.id)}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
});
