"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@repo/design-system/design-system";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  cockpitActivities,
  cockpitFlatQueueRows,
  getCockpitQueueRowKey,
} from "./workspace-cockpit-data";
import { useWorkspaceKeyboard } from "./workspace-keyboard-provider";
import { workspacePaletteNavItems } from "./workspace-nav-routes";

const RECENT_RECORD_LIMIT = 4;

export function WorkspaceCommandPalette() {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = useWorkspaceKeyboard();
  const recentRows = cockpitFlatQueueRows.slice(0, RECENT_RECORD_LIMIT);

  const navigate = useCallback(
    (href: string) => {
      setCommandOpen(false);
      router.push(href);
    },
    [router, setCommandOpen]
  );

  return (
    <CommandDialog
      description="Search commands, records, routes, and quick actions."
      onOpenChange={setCommandOpen}
      open={commandOpen}
      title="Workspace command palette"
    >
      <CommandInput placeholder="Search commands, records, or actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {workspacePaletteNavItems.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => navigate(command.href)}
              value={`${command.label} ${command.href}`}
            >
              <command.icon aria-hidden="true" className="size-4" />
              {command.label}
              {command.shortcut ? (
                <CommandShortcut>{command.shortcut}</CommandShortcut>
              ) : null}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent records">
          {recentRows.map((row) => (
            <CommandItem
              key={getCockpitQueueRowKey(row.tableId, row.id)}
              onSelect={() =>
                navigate(`/search?q=${encodeURIComponent(row.id)}`)
              }
              value={`${row.name} ${row.id}`}
            >
              <span className="min-w-0 flex-1 truncate">{row.name}</span>
              <CommandShortcut>{row.id}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent audit activity">
          {cockpitActivities.map((activity) => (
            <CommandItem
              key={activity.title}
              onSelect={() =>
                navigate(`/search?q=${encodeURIComponent(activity.title)}`)
              }
              value={activity.title}
            >
              {activity.title}
              <CommandShortcut>{activity.time}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
