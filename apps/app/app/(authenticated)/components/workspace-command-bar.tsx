"use client";

import {
  blockRecipe,
  Button,
  Input,
  Kbd,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useOptionalWorkspaceKeyboard } from "./workspace-keyboard-provider";

const filterOptions = [
  { id: "tenant", label: "Tenant scope" },
  { id: "grants", label: "Company grants" },
  { id: "evidence", label: "Evidence" },
  { id: "audit", label: "Audit trail" },
] as const;

type FilterId = (typeof filterOptions)[number]["id"];

export function WorkspaceCommandBar() {
  const router = useRouter();
  const keyboard = useOptionalWorkspaceKeyboard();
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<readonly FilterId[]>([
    "tenant",
  ]);

  const toggleFilter = useCallback((filterId: FilterId) => {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId]
    );
  }, []);

  const openCommandPalette = useCallback(() => {
    keyboard?.openCommandPalette();
  }, [keyboard]);

  return (
    <section
      aria-label="Workspace command bar"
      className={cn(
        blockRecipe("blockStack", "blockPanel", "blockPanelPadding"),
        "gap-2"
      )}
      data-slot="workspace-command-bar"
    >
      <form
        action="/search"
        className={blockRecipe("blockToolbar")}
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = query.trim();

          if (trimmed) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}`);
            return;
          }

          openCommandPalette();
        }}
      >
        <div className="relative min-w-0 flex-1">
          <SearchIcon
            aria-hidden="true"
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-tertiary"
          />
          <Input
            aria-keyshortcuts="Control+K Meta+K"
            className="h-9 pe-16 ps-9 font-mono text-[13px] tabular-nums"
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search records, actions, evidence"
            type="search"
            value={query}
          />
          <button
            aria-label="Open command palette"
            className="absolute top-1/2 right-2 -translate-y-1/2"
            onClick={openCommandPalette}
            type="button"
          >
            <Kbd className="h-5 border-border-default bg-surface-muted/60 px-1.5 font-mono text-[10px] text-text-secondary tabular-nums">
              ⌘K
            </Kbd>
          </button>
        </div>
        <Button size="sm" type="submit">
          Search
        </Button>
      </form>
      <div className={cn(blockRecipe("blockToolbar"), "gap-2")} role="toolbar">
        {filterOptions.map((filter) => {
          const active = activeFilters.includes(filter.id);

          return (
            <Button
              aria-pressed={active}
              className={cn(
                "h-8 gap-1.5 border px-2 text-[12px]",
                active
                  ? "border-brand-primary/30 bg-brand-primary/8 text-brand-primary"
                  : "border-border-default bg-transparent text-text-secondary hover:bg-surface-hover"
              )}
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              size="sm"
              type="button"
              variant="quiet"
            >
              {filter.label}
              {active ? (
                <XIcon aria-hidden="true" className="size-3 opacity-70" />
              ) : null}
            </Button>
          );
        })}
        <span
          className={cn(
            blockRecipe("blockDescription"),
            "ms-auto hidden font-mono text-[11px] sm:inline"
          )}
        >
          Audit panels on
        </span>
      </div>
    </section>
  );
}
