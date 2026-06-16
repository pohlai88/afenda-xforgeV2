"use client";

import { cn } from "@repo/design-system/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { contentLayoutTopbarClass } from "@repo/design-system/components/blocks/afenda-blocks/content-layout/content-layout-recipes";
import type {
  ContentLayoutBreadcrumbItem,
  ContentLayoutBreadcrumbsTopbarProps,
} from "./content-layout-types";

function BreadcrumbCrumb({
  item,
}: {
  readonly item: ContentLayoutBreadcrumbItem;
}) {
  const isActive = item.active ?? false;
  const className = cn(
    "relative inline-flex h-8 shrink-0 items-center gap-1 rounded-[var(--xforge-radius-sm)] px-2.5 text-[12px] transition-colors duration-150 motion-reduce:transition-none",
    isActive
      ? "font-medium text-text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-text-primary"
      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
  );
  const menuIcon = item.menu ? (
    <ChevronDownIcon aria-hidden="true" className="size-3 text-text-tertiary" />
  ) : null;

  if (item.href) {
    return (
      <a className={className} href={item.href}>
        {item.label}
        {menuIcon}
      </a>
    );
  }

  if (item.onSelect) {
    return (
      <button
        aria-current={isActive ? "page" : undefined}
        className={className}
        onClick={item.onSelect}
        type="button"
      >
        {item.label}
        {menuIcon}
      </button>
    );
  }

  return (
    <span aria-current={isActive ? "page" : undefined} className={className}>
      {item.label}
      {menuIcon}
    </span>
  );
}

export function ContentLayoutBreadcrumbsTopbar({
  className,
  items,
  trailing,
}: ContentLayoutBreadcrumbsTopbarProps) {
  if (items.length === 0 && !trailing) {
    return null;
  }

  return (
    <header
      className={cn(contentLayoutTopbarClass, className)}
      data-slot="content-layout-topbar"
    >
      {items.length > 0 ? (
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        >
          <ol className="flex min-w-0 items-center gap-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <BreadcrumbCrumb item={item} />
              </li>
            ))}
          </ol>
        </nav>
      ) : (
        <div className="min-w-0 flex-1" />
      )}
      {trailing ? (
        <div
          className="flex shrink-0 items-center gap-2"
          data-slot="content-layout-topbar-trailing"
        >
          {trailing}
        </div>
      ) : null}
    </header>
  );
}
