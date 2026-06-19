"use client";

import { AfendaAppContentLeftRail, blockRecipe, cn } from "@repo/design-system";
import { ArrowLeftIcon, SettingsIcon, WorkflowIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { OrbitCaseRouteContext } from "@/lib/app-shell/orbit-case-route-context";
import {
  listOrbitCaseMorphNavItems,
  ORBIT_CASE_BASE_PATH,
} from "@/lib/app-shell/orbit-case-route-context";

interface OrbitCaseLeftRailProps {
  readonly context: OrbitCaseRouteContext;
}

function getContextDescription(context: OrbitCaseRouteContext): string {
  switch (context.kind) {
    case "workspace":
      return "Capture work here, then push to governed morph destinations.";
    case "morph-list":
      return `Browse ${context.label.toLowerCase()} pushed from cases.`;
    case "morph-detail":
      return `Detail view for this ${context.label.toLowerCase()}.`;
    case "case":
      return "Push this case to a morph destination from the main panel.";
    default:
      return "Configure push destinations and templates.";
  }
}

function OrbitCaseLeftRailLink({
  active,
  href,
  label,
}: {
  readonly active: boolean;
  readonly href: string;
  readonly label: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-surface-muted font-medium text-text-primary"
          : "text-text-secondary hover:bg-surface-muted/60 hover:text-text-primary"
      )}
      href={href}
    >
      {label}
    </Link>
  );
}

function OrbitCaseLeftRailSection({
  children,
  title,
}: {
  readonly children: ReactNode;
  readonly title: string;
}) {
  return (
    <section className="grid gap-1">
      <h2
        className={cn(
          blockRecipe("blockMetricLabel"),
          "px-2 text-[length:var(--xforge-font-caption-size)] text-text-secondary uppercase tracking-wide"
        )}
      >
        {title}
      </h2>
      <nav aria-label={title} className="grid gap-0.5">
        {children}
      </nav>
    </section>
  );
}

export function OrbitCaseLeftRail({ context }: OrbitCaseLeftRailProps) {
  const morphItems = listOrbitCaseMorphNavItems();

  return (
    <AfendaAppContentLeftRail>
      <div className="grid gap-4">
        <OrbitCaseLeftRailSection title="Orbit Case">
          <OrbitCaseLeftRailLink
            active={context.kind === "workspace"}
            href={ORBIT_CASE_BASE_PATH}
            label="Workspace"
          />
          {context.kind === "case" ? (
            <OrbitCaseLeftRailLink
              active
              href={`${ORBIT_CASE_BASE_PATH}/${context.caseId}`}
              label="Current case"
            />
          ) : null}
          {context.kind === "morph-detail" ? (
            <Link
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-muted/60 hover:text-text-primary"
              href={`${ORBIT_CASE_BASE_PATH}/${context.segment}`}
            >
              <ArrowLeftIcon aria-hidden="true" className="size-3.5 shrink-0" />
              Back to {context.label}
            </Link>
          ) : null}
        </OrbitCaseLeftRailSection>

        <OrbitCaseLeftRailSection title="Morph destinations">
          {morphItems.map((item) => (
            <OrbitCaseLeftRailLink
              active={
                context.kind === "morph-list" &&
                context.segment === item.segment
              }
              href={item.href}
              key={item.id}
              label={item.label}
            />
          ))}
        </OrbitCaseLeftRailSection>

        <OrbitCaseLeftRailSection title="Module">
          <Link
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-muted/60 hover:text-text-primary"
            href={`${ORBIT_CASE_BASE_PATH}/settings`}
          >
            <SettingsIcon aria-hidden="true" className="size-3.5 shrink-0" />
            Push registry
          </Link>
          <div className="flex items-start gap-2 rounded-md border border-border-default/70 bg-surface-muted/20 px-2 py-2 text-text-secondary">
            <WorkflowIcon
              aria-hidden="true"
              className="mt-0.5 size-3.5 shrink-0"
            />
            <p className="text-[length:var(--xforge-font-caption-size)] leading-snug">
              {getContextDescription(context)}
            </p>
          </div>
        </OrbitCaseLeftRailSection>
      </div>
    </AfendaAppContentLeftRail>
  );
}
