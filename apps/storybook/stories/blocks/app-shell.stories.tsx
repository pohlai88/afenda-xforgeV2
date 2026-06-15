import type {
  ApprovalQueueRow,
  RiskEvidenceItem,
  StatsMetric,
} from "@repo/design-system/design-system";
import {
  ApprovalQueueBlock,
  AuthenticatedAppShellBlock,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Kbd,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  RiskEvidencePanel,
  ScrollArea,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  StatsStrip,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BellIcon,
  Building2Icon,
  CheckIcon,
  ChevronDownIcon,
  ClipboardCheckIcon,
  FileClockIcon,
  FilesIcon,
  HelpCircleIcon,
  KeyboardIcon,
  LayoutDashboardIcon,
  LockIcon,
  MessageSquareWarningIcon,
  MoreHorizontalIcon,
  PlusIcon,
  ScaleIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Workflow/App Shell",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page-first authenticated app-shell frame. The block owns the full desktop chrome layer, adjustable V4 site container, app topbar/sidebar slots, site topbar/sidebar slots, right sidebar, bottom drawer, and overflow topology; apps own route, tenant, navigation, and action content.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

interface DemoNavItem {
  readonly badge?: string;
  readonly icon: React.ReactNode;
  readonly id: string;
  readonly label: string;
  readonly selected?: boolean;
}

interface DemoNavGroup {
  readonly id: string;
  readonly items: readonly DemoNavItem[];
  readonly label: string;
}

interface DemoLabelItem {
  readonly id: string;
  readonly label: string;
  readonly tone: "neutral" | "info" | "positive" | "warning" | "critical";
}

const navGroups: DemoNavGroup[] = [
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        id: "approvals",
        label: "Approvals",
        icon: <ClipboardCheckIcon aria-hidden="true" className="size-4" />,
        selected: true,
        badge: "14",
      },
      {
        id: "evidence",
        label: "Evidence",
        icon: <FilesIcon aria-hidden="true" className="size-4" />,
        badge: "84%",
      },
      {
        id: "posting",
        label: "Batch posting",
        icon: <ScaleIcon aria-hidden="true" className="size-4" />,
      },
      {
        id: "policy-locks",
        label: "Policy locks",
        icon: <LockIcon aria-hidden="true" className="size-4" />,
      },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    items: [
      {
        id: "audit",
        label: "Audit trail",
        icon: <FileClockIcon aria-hidden="true" className="size-4" />,
      },
      {
        id: "settings",
        label: "Workspace settings",
        icon: <SettingsIcon aria-hidden="true" className="size-4" />,
      },
    ],
  },
];

const labelGroups: ReadonlyArray<{
  readonly id: string;
  readonly label: string;
  readonly items: readonly DemoLabelItem[];
}> = [
  {
    id: "workflow-labels",
    label: "Labels",
    items: [
      { id: "live", label: "Live", tone: "positive" },
      { id: "review", label: "Review", tone: "warning" },
      { id: "blocked", label: "Blocked", tone: "critical" },
      { id: "sync", label: "Sync pending", tone: "info" },
    ],
  },
];

const metrics: StatsMetric[] = [
  {
    id: "risk",
    label: "Approval risk",
    value: "72",
    description: "Weighted SLA, amount, and lock risk.",
    tone: "warning",
  },
  {
    id: "ready",
    label: "Ready to post",
    value: "86",
    description: "Validated records awaiting approval.",
    tone: "success",
  },
  {
    id: "audit",
    label: "Audit events",
    value: "1,284",
    description: "Captured this tenant period.",
    tone: "info",
  },
];

const approvals: ApprovalQueueRow[] = [
  {
    amount: "86,420.00",
    approvalId: "AP-10482",
    assignee: "Mina Shah",
    evidence: "Invoice and vendor match",
    requestedAt: "10:42",
    risk: "success",
    sla: "1h 12m",
    tenant: "Northwind Trading",
  },
  {
    amount: "14,310.50",
    approvalId: "AP-10479",
    assignee: "Jon Bell",
    evidence: "Evidence required",
    requestedAt: "10:18",
    risk: "warning",
    sla: "38m",
    tenant: "Aster Foods",
  },
  {
    amount: "122,900.00",
    approvalId: "AP-10471",
    assignee: "Priya N.",
    evidence: "Policy lock",
    requestedAt: "09:51",
    risk: "critical",
    sla: "Past due",
    tenant: "Mercury Parts",
  },
];

const evidence: RiskEvidenceItem[] = [
  {
    actor: "Policy engine",
    detail: "AP-7.4 requires second approver for high-value vendor posting.",
    id: "risk-policy",
    time: "10:18",
    tone: "warning",
  },
  {
    actor: "Mina Shah",
    detail: "Vendor invoice, receiving note, and owner confirmation attached.",
    id: "risk-attachment",
    time: "10:42",
    tone: "success",
  },
];

export const ApprovalWorkspace: Story = {
  render: () => (
    <AuthenticatedAppShellBlock
      appSidebar={<DemoAppSidebar />}
      appTopbar={<DemoAppTopbar />}
      siteBottomDrawer={<DemoBottomDrawer />}
      siteContainerConfig={{ adjustable: true }}
      siteRightSidebar={<DemoAuditDock />}
      siteSidebarLeft={<DemoSiteSidebar />}
      siteTopbar={<DemoSiteTopbar />}
    >
      <StatsStrip columns={3} metrics={metrics} />
      <ApprovalQueueBlock rows={approvals} />
    </AuthenticatedAppShellBlock>
  ),
};

export const AppSidebarQuickActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Focused preview of the app sidebar's first section: New Case, Search, and Favourite shortcut customization.",
      },
    },
  },
  render: () => (
    <AuthenticatedAppShellBlock
      appSidebar={<DemoAppSidebar />}
      appTopbar={<DemoAppTopbar />}
      siteContainerConfig={{ adjustable: false, left: "20rem", mode: "docked" }}
      siteTopbar={<DemoSiteTopbar />}
    >
      <div className="grid min-h-0 gap-3 p-4">
        <div className="rounded-[var(--card-radius)] border border-border-default bg-background p-4">
          <div className="text-[11px] text-text-tertiary uppercase tracking-[0.08em]">
            Story focus
          </div>
          <div className="mt-1 font-medium text-[13px]">
            Sidebar section 1 wired to Storybook
          </div>
          <p className="mt-1 max-w-prose text-[12px] text-text-secondary">
            This story isolates the app sidebar quick actions so keyboard
            shortcuts, dropdown state, and command search can be reviewed
            without the rest of the shell competing for attention.
          </p>
        </div>
      </div>
    </AuthenticatedAppShellBlock>
  ),
};

function DemoAppTopbar() {
  const actions = [
    {
      id: "command",
      label: "Open command palette",
      icon: <KeyboardIcon aria-hidden="true" className="size-4" />,
    },
    {
      id: "help",
      label: "Open help",
      icon: <HelpCircleIcon aria-hidden="true" className="size-4" />,
    },
    {
      id: "feedback",
      label: "Send feedback",
      icon: <MessageSquareWarningIcon aria-hidden="true" className="size-4" />,
    },
    {
      id: "utilities",
      label: "Open utilities",
      icon: <LayoutDashboardIcon aria-hidden="true" className="size-4" />,
    },
    {
      id: "notifications",
      label: "Open notifications",
      icon: <BellIcon aria-hidden="true" className="size-4" />,
    },
    {
      id: "actions",
      label: "Open actions menu",
      icon: <MoreHorizontalIcon aria-hidden="true" className="size-4" />,
    },
  ] as const;

  return (
    <header
      className="flex h-full items-center justify-between gap-3 px-4 text-sidebar-foreground antialiased"
      data-slot="workspace-app-nav-topbar"
    >
      <div
        className="flex min-w-0 items-center gap-1.5"
        data-slot="app-topbar-left"
      >
        <SidebarTrigger
          aria-label="Toggle app navigation"
          className="text-sidebar-foreground/80 hover:bg-white/8 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring"
        />
        <span
          aria-label="Afenda workspace"
          className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/8 text-sidebar-foreground shadow-sm"
          data-slot="app-topbar-brand-disk"
          role="img"
        >
          <Building2Icon aria-hidden="true" className="size-4" />
        </span>
        <DemoWorkspaceScopeSwitchers />
      </div>
      <div
        className="flex shrink-0 items-center justify-end gap-0.5"
        data-slot="app-topbar-right"
      >
        {actions.map((action) => (
          <Button
            aria-label={action.label}
            className="text-sidebar-foreground/80 hover:bg-white/8 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring"
            key={action.id}
            size="icon-sm"
            type="button"
            variant="quiet"
          >
            {action.icon}
          </Button>
        ))}
        <Button
          aria-label="Open user menu"
          className="ml-1 size-8 rounded-full p-0 hover:bg-white/8 focus-visible:ring-sidebar-ring"
          type="button"
          variant="quiet"
        >
          <Avatar className="size-7">
            <AvatarFallback className="bg-sidebar-accent text-[11px] text-sidebar-foreground">
              MS
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}

function DemoWorkspaceScopeSwitchers() {
  const switchers = [
    {
      id: "company",
      label: "Company",
      active: "Northwind",
      options: ["Northwind", "Aster", "Mercury", "Atlas"],
    },
    {
      id: "department",
      label: "Department",
      active: "Finance",
      options: ["Finance", "Operations", "HR", "Compliance"],
    },
    {
      id: "team",
      label: "Team",
      active: "Controls",
      options: ["Controls", "Posting", "Evidence", "Policy"],
    },
    {
      id: "project",
      label: "Project",
      active: "June close",
      options: ["June close", "Q3 audit", "Vendor review", "Policy cleanup"],
    },
  ] as const;

  return (
    <fieldset
      className="flex min-w-0 items-center gap-1 border-0 p-0"
      data-slot="app-topbar-scope-switchers"
    >
      <legend className="sr-only">Workspace scope switchers</legend>
      {switchers.map((switcher) => (
        <Menubar
          className="h-auto w-auto border-0 bg-transparent p-0"
          key={switcher.id}
        >
          <MenubarMenu>
            <MenubarTrigger
              aria-label={`Switch ${switcher.label.toLowerCase()}`}
              className="h-9 max-w-[9.5rem] gap-1.5 rounded-md bg-transparent px-2 text-sidebar-foreground hover:bg-white/8 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring data-[state=open]:bg-white/10 data-[state=open]:text-sidebar-foreground"
              data-slot={`app-topbar-${switcher.id}-switcher`}
            >
              <span className="grid min-w-0 flex-1 gap-0 text-left">
                <span className="truncate font-medium text-[8px] text-sidebar-foreground/48 uppercase leading-[9px] tracking-[0.06em]">
                  {switcher.label}
                </span>
                <span className="min-w-0 truncate font-medium text-[12px] leading-4">
                  {switcher.active}
                </span>
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                className="size-3.5 shrink-0 text-sidebar-foreground/55"
              />
            </MenubarTrigger>
            <MenubarContent align="start" className="w-52">
              {switcher.options.map((option) => (
                <MenubarItem className="gap-2" key={option}>
                  <span className="min-w-0 flex-1 truncate">{option}</span>
                  {option === switcher.active ? (
                    <CheckIcon aria-hidden="true" className="size-4 shrink-0" />
                  ) : null}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ))}
    </fieldset>
  );
}
function DemoAppSidebar() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [favoriteShortcut, setFavoriteShortcut] = useState("⌘1");
  const [newCaseType, setNewCaseType] = useState("Task");
  const rowClass =
    "h-8 gap-2 px-2 text-[12px] leading-4 text-sidebar-foreground/88 hover:bg-sidebar-accent hover:text-sidebar-foreground";
  const searchGroups = useMemo(
    () => [
      {
        heading: "Quick actions",
        items: [
          {
            id: "open-approval-queue",
            title: "Open approval queue",
            description: "Jump to approvals waiting for review.",
            shortcut: "Enter",
          },
          {
            id: "open-evidence-panel",
            title: "Open evidence panel",
            description: "Review controls, evidence, and audit trail.",
          },
        ],
      },
      {
        heading: "Records",
        items: [
          {
            id: "northwind-trading",
            title: "Northwind Trading",
            description: "Finance operations workspace.",
          },
          {
            id: "june-close",
            title: "June close",
            description: "Batch posting and reconciliation workspace.",
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <SidebarHeader className="border-0 p-2">
        <div className="grid gap-1 rounded-[var(--card-radius)] border border-border-default bg-background p-2">
          <div className="px-0.5 font-medium text-[8px] text-text-tertiary uppercase leading-3 tracking-[0.08em]">
            Section 1
          </div>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem className="group relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className={rowClass} size="sm">
                    <PlusIcon
                      aria-hidden="true"
                      className="size-3.5 shrink-0"
                    />
                    <span className="min-w-0 flex-1 truncate">New Case</span>
                    <span className="ms-auto text-[10px] text-text-tertiary">
                      {newCaseType}
                    </span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-56">
                  <DropdownMenuLabel className="text-[10px] text-text-tertiary uppercase tracking-[0.08em]">
                    Create
                  </DropdownMenuLabel>
                  {["Task", "Approval case", "Exception"].map((item) => (
                    <DropdownMenuItem
                      className="text-[12px]"
                      key={item}
                      onSelect={() => setNewCaseType(item)}
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <ShortcutHint normalized="mod+n" />
            </SidebarMenuItem>
            <SidebarMenuItem className="group relative">
              <SidebarMenuButton
                className={rowClass}
                onClick={() => setCommandOpen(true)}
                size="sm"
              >
                <SearchIcon aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">Search</span>
              </SidebarMenuButton>
              <ShortcutHint normalized="mod+k" />
            </SidebarMenuItem>
            <SidebarMenuItem className="group relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className={rowClass} size="sm">
                    <StarIcon
                      aria-hidden="true"
                      className="size-3.5 shrink-0"
                    />
                    <span className="min-w-0 flex-1 truncate">Favourite</span>
                    <span className="ms-auto flex items-center gap-1">
                      <Kbd className="h-4 border-border-default bg-sidebar-border/35 px-1 font-mono text-[9px] text-text-secondary leading-none shadow-none">
                        {favoriteShortcut}
                      </Kbd>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="size-3 shrink-0 text-text-tertiary"
                      />
                    </span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-56">
                  <DropdownMenuLabel className="text-[10px] text-text-tertiary uppercase tracking-[0.08em]">
                    Customize shortcut
                  </DropdownMenuLabel>
                  {[
                    ["⌘1", "Pin current"],
                    ["⌘2", "Pin evidence"],
                    ["⌘3", "Pin audit"],
                  ].map(([shortcut, label]) => (
                    <DropdownMenuItem
                      className="text-[12px]"
                      key={shortcut}
                      onSelect={() => setFavoriteShortcut(shortcut)}
                    >
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                      <span className="text-[10px] text-text-tertiary">
                        {shortcut}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <ShortcutHint normalized="mod+f" />
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="px-0.5 text-[10px] text-text-tertiary leading-4">
            Creating <span className="text-text-secondary">{newCaseType}</span>,
            search opens with Cmd+K, favourite pinned to{" "}
            <span className="text-text-secondary">{favoriteShortcut}</span>
          </div>
        </div>
      </SidebarHeader>
      <CommandDialog
        description="Search approvals, evidence, and workspace actions."
        onOpenChange={setCommandOpen}
        open={commandOpen}
        title="Workspace search"
      >
        <CommandInput placeholder="Search tenant, approval, or evidence..." />
        <CommandList>
          <CommandEmpty>No matching records.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => setCommandOpen(false)}>
              <span className="min-w-0 flex-1 truncate">
                Open approval queue
              </span>
              <Kbd size="sm">Enter</Kbd>
            </CommandItem>
            <CommandItem onSelect={() => setCommandOpen(false)}>
              <span className="min-w-0 flex-1 truncate">Create new case</span>
              <Kbd size="sm">Cmd+N</Kbd>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Records">
            {searchGroups[1].items.map((item) => (
              <CommandItem key={item.id} onSelect={() => setCommandOpen(false)}>
                <span className="grid min-w-0 gap-0.5">
                  <span className="truncate font-medium">{item.title}</span>
                  <span className="truncate text-text-secondary">
                    {item.description}
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <SidebarContent
        className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0"
        data-slot="app-nav-sidebar-content"
      >
        <ScrollArea className="h-full min-h-0 w-full min-w-0 [&_[data-slot=scroll-area-viewport]]:overflow-x-hidden">
          <nav className="grid min-w-0 gap-[18px] px-2.5 py-3">
            {navGroups.map((group) => (
              <DemoNavGroup group={group} key={group.id} />
            ))}
            {labelGroups.map((group) => (
              <DemoLabelGroup group={group} key={group.id} />
            ))}
          </nav>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-0 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-auto gap-2 px-2 py-2" size="lg">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage alt="Mina Shah" src="" />
                <AvatarFallback className="rounded-lg">MS</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium text-[12px]">
                  Mina Shah
                </span>
                <span className="truncate text-[11px] text-text-tertiary">
                  Control owner
                </span>
              </div>
              <ChevronDownIcon
                aria-hidden="true"
                className="ms-auto size-3 shrink-0 text-text-tertiary group-data-[collapsible=icon]:hidden"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage alt="Mina Shah" src="" />
                  <AvatarFallback className="rounded-lg">MS</AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate font-medium text-[12px]">
                    Mina Shah
                  </span>
                  <span className="truncate text-[11px] text-text-tertiary">
                    mina.shah@northwind.example
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className="text-[12px]">
              Profile settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[12px]">
              Keyboard shortcuts
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[12px]">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}

function ShortcutHint({ normalized }: { readonly normalized: string }) {
  const key = normalized.split("+").at(-1)?.toUpperCase() ?? "";

  return (
    <span className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 opacity-0 transition-opacity group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 group-data-[collapsible=icon]:hidden">
      <Kbd className="h-4 min-h-4 bg-sidebar-border/40 px-1 font-mono text-[9px] text-sidebar-foreground/65 leading-none shadow-none dark:bg-sidebar-border/25">
        ⌘{key}
      </Kbd>
    </span>
  );
}

function DemoSiteTopbar() {
  return (
    <header
      className="flex min-h-[var(--workspace-app-nav-topbar-height)] shrink-0 items-center gap-2 border-border-subtle border-b bg-card px-[var(--xforge-space-8)] antialiased"
      data-slot="workspace-nav-site-topbar"
    >
      <div className="grid min-w-0 flex-1 gap-0.5">
        <div className="text-[11px] text-text-secondary">
          Workspace / Approvals
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate font-semibold text-[13px] text-text-primary leading-4">
            Approval control center
          </h1>
          <Badge tone="positive" variant="outline">
            Controlled
          </Badge>
        </div>
        <p className="truncate text-[11px] text-text-secondary leading-3">
          Review approvals, evidence completeness, and policy locks before
          posting operational changes.
        </p>
      </div>
    </header>
  );
}

function DemoSiteSidebar() {
  return (
    <nav aria-label="Approval views" className="grid content-start gap-1 p-2">
      {["Queue", "Evidence", "Policies", "Posting", "Audit"].map(
        (label, index) => (
          <a
            aria-current={index === 0 ? "page" : undefined}
            className={
              index === 0
                ? "rounded-[var(--card-radius)] bg-lane-active-muted px-2 py-1.5 font-medium text-[13px] text-lane-active-muted-foreground"
                : "rounded-[var(--card-radius)] px-2 py-1.5 text-[13px] text-text-secondary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            }
            href="#approval-workspace"
            key={label}
          >
            {label}
          </a>
        )
      )}
    </nav>
  );
}

function DemoAuditDock() {
  return (
    <RiskEvidencePanel
      evidence={evidence}
      metrics={metrics}
      progress={{
        label: "Evidence completeness",
        tone: "warning",
        value: 68,
      }}
    />
  );
}

function DemoBottomDrawer() {
  return (
    <section
      aria-label="Posting review drawer"
      className="grid h-full min-h-0 gap-3 overflow-hidden p-4"
      data-slot="demo-site-bottom-drawer-content"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <h2 className="truncate font-semibold text-[13px] leading-4">
            Batch posting review
          </h2>
          <p className="truncate text-[11px] text-text-secondary leading-4">
            Reversible posting window, job state, and audit confirmation.
          </p>
        </div>
        <Badge tone="warning" variant="outline">
          3 checks pending
        </Badge>
      </div>
      <div className="grid min-h-0 grid-cols-3 gap-3 overflow-hidden">
        {[
          ["Idempotency key", "POST-JUNE-07-8421"],
          ["Rollback window", "14 minutes"],
          ["Policy lock state", "Requires control owner"],
        ].map(([label, value]) => (
          <div
            className="min-w-0 rounded-[var(--card-radius)] border border-border-default bg-background p-3"
            key={label}
          >
            <div className="truncate text-[10px] text-text-tertiary uppercase leading-3">
              {label}
            </div>
            <div className="truncate font-medium text-[12px] leading-4">
              {value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DemoNavGroup({ group }: { readonly group: DemoNavGroup }) {
  return (
    <div className="grid min-w-0 gap-1">
      <div className="px-2 font-medium text-[8px] text-text-tertiary uppercase leading-3 tracking-[0.06em]">
        {group.label}
      </div>
      <div className="grid min-w-0 gap-1">
        {group.items.map((item) => (
          <a
            aria-current={item.selected ? "page" : undefined}
            className={
              item.selected
                ? "group flex h-8 min-w-0 items-center gap-2 rounded-md bg-lane-active-muted px-2 font-medium text-[12px] text-lane-active-muted-foreground leading-4"
                : "group flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[12px] text-sidebar-foreground/88 leading-4 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            }
            href="#approval-workspace"
            key={item.id}
          >
            <span className="grid size-4 shrink-0 place-items-center text-text-tertiary">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge ? (
              <span className="shrink-0 text-[10px] text-text-tertiary">
                {item.badge}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
}

function DemoLabelGroup({
  group,
}: {
  readonly group: {
    readonly id: string;
    readonly items: readonly DemoLabelItem[];
    readonly label: string;
  };
}) {
  return (
    <div className="grid min-w-0 gap-1" data-slot="app-sidebar-label-group">
      <div className="px-2 font-medium text-[8px] text-text-tertiary uppercase leading-3 tracking-[0.06em]">
        {group.label}
      </div>
      <div className="grid min-w-0 gap-1">
        {group.items.map((item) => (
          <div
            className="flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[12px] text-sidebar-foreground/88 leading-4"
            key={item.id}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                item.tone === "positive" && "bg-success",
                item.tone === "warning" && "bg-warning",
                item.tone === "critical" && "bg-destructive",
                item.tone === "info" && "bg-info",
                item.tone === "neutral" && "bg-text-tertiary"
              )}
            />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <Badge
              className="border-border-default bg-background px-1.5 text-[10px] text-text-secondary"
              variant="outline"
            >
              {item.tone}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
