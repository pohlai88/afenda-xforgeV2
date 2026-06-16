"use client";

import { Input } from "@repo/design-system/components/afenda-ui/input";
import { Kbd } from "@repo/design-system/components/afenda-ui/kbd";
import { cn } from "@repo/design-system/lib/utils";
import {
  TOPBAR_DEFAULT_COMMAND_DESCRIPTION,
  TOPBAR_DEFAULT_COMMAND_LABEL,
  TOPBAR_DEFAULT_COMMAND_PLACEHOLDER,
  TOPBAR_DEFAULT_COMMAND_SHORTCUT,
} from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import { topbarCommandSearchClass } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-recipes";
import { SearchIcon } from "lucide-react";
import { useCallback, useState, type FormEvent, type KeyboardEvent } from "react";
import { TopbarTooltip } from "./topbar-tooltip";
import type { TopbarCommandTriggerProps } from "./topbar-types";

export function TopbarCommandTrigger({
  className,
  description = TOPBAR_DEFAULT_COMMAND_DESCRIPTION,
  label = TOPBAR_DEFAULT_COMMAND_LABEL,
  onOpen,
  onSearch,
  placeholder = TOPBAR_DEFAULT_COMMAND_PLACEHOLDER,
  shortcut = TOPBAR_DEFAULT_COMMAND_SHORTCUT,
}: TopbarCommandTriggerProps) {
  const [query, setQuery] = useState("");

  const openPalette = useCallback(() => {
    onOpen?.();
  }, [onOpen]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = query.trim();

      if (trimmed) {
        onSearch?.(trimmed);
        return;
      }

      openPalette();
    },
    [onSearch, openPalette, query]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      }
    },
    [openPalette]
  );

  return (
    <TopbarTooltip description={description} label={label} shortcut={shortcut}>
      <form
        className={cn("relative min-w-0", className)}
        data-slot="app-topbar-command-trigger"
        onSubmit={handleSubmit}
      >
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-sidebar-foreground/55"
        />
        <Input
          aria-keyshortcuts="Control+K Meta+K"
          aria-label={label}
          className={topbarCommandSearchClass}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          type="search"
          value={query}
        />
        {shortcut ? (
          <button
            aria-label={`${label} (${shortcut})`}
            className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            onClick={openPalette}
            type="button"
          >
            <Kbd className="h-5 border-border-default bg-sidebar-border/35 px-1.5 font-mono text-[10px] text-text-secondary tabular-nums shadow-none">
              {shortcut}
            </Kbd>
          </button>
        ) : null}
      </form>
    </TopbarTooltip>
  );
}
