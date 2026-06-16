"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Kbd,
  KbdSequence,
  recipe,
} from "@repo/design-system/components/afenda-ui";
import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useMemo, useState } from "react";
import type {
  TopbarShortcutDefinition,
  TopbarShortcutKeys,
  TopbarShortcutsDialogProps,
} from "./topbar-types";

const CATEGORY_ORDER = [
  "global",
  "current-screen",
  "selection",
  "navigation",
  "utilities",
] as const;

const DEFAULT_EMPTY_STATE = {
  title: "No shortcuts found",
  description:
    "Try another keyword or open a different screen for local shortcuts.",
} as const;

const WHITESPACE_PATTERN = /\s+/;

const shortcutsPaletteShellClass = cn(
  recipe("modalSurface"),
  "max-w-[46rem] overflow-hidden border-border-subtle/38 bg-surface-overlay/98 p-0 shadow-[0_18px_60px_rgba(0,0,0,0.34)]"
);

const shortcutsCommandClass = cn(
  "bg-transparent",
  "[&_[data-slot=command-input-wrapper]]:h-12",
  "[&_[data-slot=command-input-wrapper]]:border-border-subtle/28",
  "[&_[data-slot=command-input-wrapper]]:border-b",
  "[&_[data-slot=command-input-wrapper]]:px-4",
  "[&_[data-slot=command-input-wrapper]]:bg-surface-muted/6",
  "[&_[data-slot=command-input-wrapper]>svg]:size-3.5",
  "[&_[data-slot=command-input-wrapper]>svg]:text-text-tertiary/52",
  "[&_[data-slot=command-input]]:text-[12px]",
  "[&_[data-slot=command-input]]:placeholder:text-text-tertiary/38"
);

function normalizeShortcutKeys(
  keys: TopbarShortcutKeys
): readonly (readonly string[])[] {
  if (keys.length === 0) {
    return [];
  }

  return Array.isArray(keys[0])
    ? (keys as readonly (readonly string[])[])
    : [keys as readonly string[]];
}

function formatScopeLabel(scope: TopbarShortcutDefinition["scope"]) {
  switch (scope) {
    case "context":
      return "Current screen";
    case "selection":
      return "Selection";
    default:
      return "Global";
  }
}

function formatCategoryLabel(category: string) {
  switch (category) {
    case "current-screen":
      return "Current screen";
    case "selection":
      return "Selection / table";
    case "navigation":
      return "Navigation";
    case "utilities":
      return "Utilities";
    case "global":
      return "Global";
    default:
      return category;
  }
}

function buildShortcutSearchValue(shortcut: TopbarShortcutDefinition) {
  const keyTokens = normalizeShortcutKeys(shortcut.keys).flat().join(" ");

  return [
    shortcut.label,
    shortcut.description ?? "",
    shortcut.category,
    shortcut.scope,
    shortcut.when ?? "",
    ...(shortcut.aliases ?? []),
    keyTokens,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesShortcutQuery(
  shortcut: TopbarShortcutDefinition,
  query: string
): boolean {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    return true;
  }

  const haystack = buildShortcutSearchValue(shortcut);
  const tokens = trimmed.split(WHITESPACE_PATTERN).filter(Boolean);

  return tokens.every((token) => haystack.includes(token));
}

function sortShortcuts(
  shortcuts: readonly TopbarShortcutDefinition[]
): readonly TopbarShortcutDefinition[] {
  return [...shortcuts].sort((left, right) => {
    const leftIndex = CATEGORY_ORDER.indexOf(
      left.category as (typeof CATEGORY_ORDER)[number]
    );
    const rightIndex = CATEGORY_ORDER.indexOf(
      right.category as (typeof CATEGORY_ORDER)[number]
    );

    if (leftIndex !== rightIndex) {
      return (
        (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
        (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex)
      );
    }

    return left.label.localeCompare(right.label);
  });
}

function renderShortcutChords(shortcut: TopbarShortcutDefinition) {
  const normalizedKeys = normalizeShortcutKeys(shortcut.keys);
  const keyGroups = normalizedKeys.map((keyGroup, index) => ({
    id: keyGroup.join("+"),
    isLast: index === normalizedKeys.length - 1,
    keys: keyGroup,
  }));

  return (
    <div className="flex flex-wrap items-center justify-end gap-1">
      {keyGroups.map((keyGroup) => (
        <div className="flex items-center gap-1" key={keyGroup.id}>
          <KbdSequence>
            {keyGroup.keys.map((key) => (
              <Kbd
                className={cn(
                  recipe("shortcutText"),
                  "h-[18px] min-w-[18px] rounded-[calc(var(--xforge-radius-sm)-1px)] border-border-subtle/22 bg-surface-muted/6 px-1.5 font-mono text-[9px] text-text-tertiary/72 tabular-nums shadow-none"
                )}
                key={`${keyGroup.id}-${key}`}
                size="sm"
              >
                {key}
              </Kbd>
            ))}
          </KbdSequence>
          {keyGroup.isLast ? null : (
            <span
              className={cn(
                recipe("metadataText"),
                "px-0.5 text-[9px] text-text-tertiary/52"
              )}
            >
              or
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function ShortcutRow({
  onOpenChange,
  shortcut,
}: {
  readonly onOpenChange: (open: boolean) => void;
  readonly shortcut: TopbarShortcutDefinition;
}) {
  return (
    <CommandItem
      className="min-h-0 items-start gap-3 rounded-[calc(var(--xforge-radius-sm)+1px)] border-0 px-3 py-1.5 data-[selected=true]:bg-surface-hover/26"
      onSelect={() => {
        shortcut.onSelect?.();
        if (shortcut.onSelect) {
          onOpenChange(false);
        }
      }}
      value={buildShortcutSearchValue(shortcut)}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span
            className={cn(
              recipe("bodyMediumText"),
              "text-[12px] tracking-[-0.014em]"
            )}
          >
            {shortcut.label}
          </span>
          <span
            className={cn(
              recipe("metadataText"),
              "text-[9px] text-text-tertiary/64"
            )}
          >
            {formatScopeLabel(shortcut.scope)}
          </span>
          <span
            className={cn(
              recipe("metadataText"),
              "text-[9px] text-text-tertiary/36"
            )}
          >
            ·
          </span>
          <span
            className={cn(
              recipe("metadataText"),
              "text-[9px] text-text-tertiary/64"
            )}
          >
            {formatCategoryLabel(shortcut.category)}
          </span>
        </div>
        {shortcut.description ? (
          <p
            className={cn(
              blockRecipe("blockDescription"),
              "mt-0.5 text-[11px] text-text-tertiary/52"
            )}
          >
            {shortcut.description}
          </p>
        ) : null}
        {shortcut.when ? (
          <p
            className={cn(
              recipe("captionText"),
              "mt-0.5 text-[10px] text-text-tertiary/44"
            )}
          >
            {shortcut.when}
          </p>
        ) : null}
      </div>
      <div className="shrink-0 self-center pl-2">
        {renderShortcutChords(shortcut)}
      </div>
    </CommandItem>
  );
}

export function TopbarShortcutsDialog({
  contextLabel,
  emptyState = DEFAULT_EMPTY_STATE,
  onOpenChange,
  open,
  shortcuts,
}: TopbarShortcutsDialogProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const sortedShortcuts = useMemo(() => sortShortcuts(shortcuts), [shortcuts]);
  const visibleShortcuts = useMemo(
    () =>
      sortedShortcuts.filter((shortcut) =>
        matchesShortcutQuery(shortcut, query)
      ),
    [query, sortedShortcuts]
  );
  const groupedShortcuts = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: visibleShortcuts.filter(
        (shortcut) => shortcut.category === category
      ),
    })).filter((group) => group.items.length > 0);
  }, [visibleShortcuts]);
  const hasSearch = query.trim().length > 0;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className={shortcutsPaletteShellClass} showCloseButton>
        <DialogHeader className="sr-only">
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Search shortcuts for the current workspace, screen, and selection.
          </DialogDescription>
        </DialogHeader>
        <Command className={shortcutsCommandClass}>
          <div>
            <CommandInput
              autoFocus
              onValueChange={setQuery}
              placeholder="Type a shortcut, action, or key…"
              value={query}
            />
          </div>
          {contextLabel ? (
            <div className="px-4 pt-2 pb-0">
              <p
                className={cn(
                  recipe("metadataText"),
                  "text-[10px] text-text-tertiary/42"
                )}
              >
                {contextLabel}
              </p>
            </div>
          ) : null}
          <CommandList className="max-h-[28rem] px-3 pt-2.5 pb-3">
            <CommandEmpty className="px-3 py-10 text-left">
              <p className={cn(recipe("bodyMediumText"), "text-[12px]")}>
                {emptyState.title ?? DEFAULT_EMPTY_STATE.title}
              </p>
              {emptyState.description ? (
                <p
                  className={cn(
                    blockRecipe("blockDescription"),
                    "mt-1 text-[11px] text-text-tertiary/62"
                  )}
                >
                  {emptyState.description}
                </p>
              ) : null}
            </CommandEmpty>
            {hasSearch ? (
              <CommandGroup
                className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-0.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-text-tertiary/34"
                heading="Results"
              >
                {visibleShortcuts.map((shortcut) => (
                  <ShortcutRow
                    key={shortcut.id}
                    onOpenChange={onOpenChange}
                    shortcut={shortcut}
                  />
                ))}
              </CommandGroup>
            ) : (
              groupedShortcuts.map((group) => (
                <CommandGroup
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-text-tertiary/34"
                  heading={formatCategoryLabel(group.category)}
                  key={group.category}
                >
                  {group.items.map((shortcut) => (
                    <ShortcutRow
                      key={shortcut.id}
                      onOpenChange={onOpenChange}
                      shortcut={shortcut}
                    />
                  ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
