"use client";

import {
  isSidebarNavItemActive,
  type TopbarShortcutDefinition,
} from "@repo/design-system";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { parseCockpitQueueRowKey } from "./workspace-cockpit-data";
import { useWorkspaceKeyboard } from "./workspace-keyboard-provider";
import { workspacePaletteNavItems } from "./workspace-nav-routes";

const WORKSPACE_GLOBAL_SHORTCUTS = [
  {
    id: "workspace-command-palette",
    label: "Open command palette",
    description: "Search commands, records, routes, and quick actions.",
    keys: [
      ["⌘", "K"],
      ["Ctrl", "K"],
    ],
    category: "global",
    scope: "global",
    aliases: ["search", "command", "palette"],
  },
  {
    id: "workspace-shortcuts-help",
    label: "Show keyboard shortcuts",
    description: "Open the shortcut reference for the current workspace.",
    keys: [["?"], ["Shift", "/"]],
    category: "global",
    scope: "global",
    aliases: ["help", "shortcuts", "keyboard"],
  },
] satisfies readonly TopbarShortcutDefinition[];

export function useWorkspaceShortcutDefinitions() {
  const pathname = usePathname();
  const router = useRouter();
  const { openCommandPalette, selectedQueueRowKey } = useWorkspaceKeyboard();

  const contextLabel = useMemo(() => {
    const activeItem = workspacePaletteNavItems.find((item) =>
      isSidebarNavItemActive(pathname, item)
    );

    return activeItem?.label;
  }, [pathname]);

  const shortcuts = useMemo((): readonly TopbarShortcutDefinition[] => {
    const shortcuts = WORKSPACE_GLOBAL_SHORTCUTS.map((shortcut) => ({
      ...shortcut,
      onSelect:
        shortcut.id === "workspace-command-palette"
          ? openCommandPalette
          : undefined,
    }));

    if (!selectedQueueRowKey) {
      return shortcuts;
    }

    const { recordId } = parseCockpitQueueRowKey(selectedQueueRowKey);

    return [
      ...shortcuts,
      {
        id: "selection-move-down",
        label: "Move selection down",
        description: "Move to the next queue row in cockpit tables.",
        keys: ["J"],
        category: "selection",
        scope: "selection",
        aliases: ["next row", "queue down", "table down"],
        when: "Available when a queue table is active.",
      },
      {
        id: "selection-move-up",
        label: "Move selection up",
        description: "Move to the previous queue row in cockpit tables.",
        keys: ["K"],
        category: "selection",
        scope: "selection",
        aliases: ["previous row", "queue up", "table up"],
        when: "Available when a queue table is active.",
      },
      {
        id: "selection-open-record",
        label: "Open selected record in search",
        description: `Jump into the selected record (${recordId}).`,
        keys: ["E"],
        category: "selection",
        scope: "selection",
        aliases: ["open record", "inspect row", "search record"],
        onSelect: () => {
          router.push(`/search?q=${encodeURIComponent(recordId)}`);
        },
        when: "Available when a queue row is selected.",
      },
    ];
  }, [openCommandPalette, router, selectedQueueRowKey]);

  return {
    contextLabel,
    shortcuts,
  };
}
