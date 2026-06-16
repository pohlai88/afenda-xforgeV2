import { Button, blockRecipe } from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

const DEMO_LEFT_NAV_ITEMS = [
  { id: "overview", label: "Overview", href: "#content-overview" },
  { id: "records", label: "Records", href: "#content-records" },
  { id: "evidence", label: "Evidence", href: "#content-evidence" },
  { id: "policies", label: "Policies", href: "#content-policies" },
] as const;

const DEMO_ACTIVITY_ITEMS = [
  {
    id: "activity-1",
    actor: "Policy engine",
    detail: "AP-7.4 requires second approver for high-value vendor posting.",
    time: "10:18",
  },
  {
    id: "activity-2",
    actor: "Mina Shah",
    detail: "Vendor invoice, receiving note, and owner confirmation attached.",
    time: "10:42",
  },
  {
    id: "activity-3",
    actor: "Batch runner",
    detail: "Posting window opened for June close batch POST-JUNE-07-8421.",
    time: "10:55",
  },
] as const;

const DEMO_SCROLL_SECTION_COUNT = 12;
const DEMO_BREADCRUMB_TRAILING_LABEL = "September 2025";

export interface DemoContentLayoutSectionNavProps {
  readonly activeHref?: string;
  readonly onNavigate?: (href: string) => void;
}

export function DemoContentLayoutSectionNav({
  activeHref,
  onNavigate,
}: DemoContentLayoutSectionNavProps) {
  return (
    <nav aria-label="Section navigation" className="grid gap-1 p-2 text-[12px]">
      {DEMO_LEFT_NAV_ITEMS.map((item) => {
        const isActive = activeHref === item.href;

        return (
          <a
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-2 py-1.5 transition-colors duration-150 motion-reduce:transition-none",
              isActive
                ? "bg-brand-primary/10 font-medium text-brand-primary"
                : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            )}
            href={item.href}
            key={item.id}
            onClick={(event) => {
              if (!onNavigate) {
                return;
              }

              event.preventDefault();
              onNavigate(item.href);
            }}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

export function DemoContentLayoutAuditRail() {
  return (
    <div className="grid gap-2 p-3 text-[11px] text-text-secondary">
      <p className="font-medium text-text-primary">Audit context</p>
      <p>Immutable events and policy locks for the active scope.</p>
    </div>
  );
}

export function DemoContentLayoutActivityDrawer() {
  return (
    <div className="grid gap-2 text-[11px] text-text-secondary">
      <p className="font-medium text-text-primary">Activity stream</p>
      <ul className="grid gap-2">
        {DEMO_ACTIVITY_ITEMS.map((item) => (
          <li className="grid gap-0.5" key={item.id}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-text-primary">{item.actor}</span>
              <span className="tabular-nums text-text-tertiary">{item.time}</span>
            </div>
            <p>{item.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface DemoContentLayoutScrollPanelsProps {
  readonly sectionCount?: number;
}

export function DemoContentLayoutScrollPanels({
  sectionCount = DEMO_SCROLL_SECTION_COUNT,
}: DemoContentLayoutScrollPanelsProps) {
  return (
    <div className="grid gap-4 p-[var(--xforge-space-5)]">
      {Array.from({ length: sectionCount }, (_, index) => (
        <div
          className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}
          key={`panel-${index + 1}`}
        >
          <div className={blockRecipe("blockDescription")}>
            Section {index + 1}
          </div>
          <p className={cn(blockRecipe("blockDescription"), "mt-1 max-w-prose")}>
            Main content scrolls vertically below the breadcrumb topbar. Footer,
            drawer header, and topbar remain fixed within the rounded shell.
          </p>
        </div>
      ))}
    </div>
  );
}

export function DemoContentLayoutBreadcrumbTrailing() {
  return (
    <Button className="gap-1.5 text-[12px]" size="sm" type="button" variant="quiet">
      <CalendarIcon aria-hidden="true" className="size-3.5" />
      {DEMO_BREADCRUMB_TRAILING_LABEL}
      <ChevronDownIcon aria-hidden="true" className="size-3 text-text-tertiary" />
    </Button>
  );
}
