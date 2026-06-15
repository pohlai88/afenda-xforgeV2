import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@repo/design-system/components/afenda-ui/command";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronRightIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

const meta = {
  title: "Afenda UI/Command",
  component: CommandDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda command surface. Keyboard-first lookup for records, actions, and quick navigation.",
      },
    },
  },
} satisfies Meta<typeof CommandDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Palette: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="w-[760px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
        <div className="flex items-center justify-between border-border-default border-b px-5 py-4">
          <div>
            <p className="font-medium text-sm text-text-primary">
              Operator workspace
            </p>
            <p className="text-[12px] text-text-secondary">
              Command palette opens from app chrome, not an isolated button.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} variant="secondary">
            <SearchIcon className="size-4" />
            Search workspace
          </Button>
        </div>
        <div className="grid grid-cols-[180px_1fr] text-[13px]">
          <div className="border-border-default border-r bg-surface-muted p-4 text-text-secondary">
            Audit queue
          </div>
          <div className="grid gap-3 p-4">
            <div className="flex items-center justify-between rounded-md border border-border-default px-4 py-3">
              <span className="font-medium text-text-primary">
                Northwind Trading
              </span>
              <Badge tone="info" variant="soft">
                Live
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border-default px-4 py-3">
              <span className="font-medium text-text-primary">
                Contoso Retail
              </span>
              <Badge tone="warning" variant="outline">
                Pending
              </Badge>
            </div>
          </div>
        </div>
        <CommandDialog onOpenChange={setOpen} open={open}>
          <CommandInput placeholder="Search commands, records, or actions..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick actions">
              <CommandItem>
                <PlusIcon />
                Create tenant
                <CommandShortcut>Ctrl N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SearchIcon />
                Search all records
                <CommandShortcut>Ctrl K</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Recent records">
              <CommandItem>
                Northwind Trading
                <Badge className="ml-auto" tone="info" variant="soft">
                  Live
                </Badge>
                <CommandShortcut>
                  Open
                  <ChevronRightIcon className="size-3.5" />
                </CommandShortcut>
              </CommandItem>
              <CommandItem>
                Contoso Retail
                <Badge className="ml-auto" tone="warning" variant="outline">
                  Pending
                </Badge>
                <CommandShortcut>
                  Open
                  <ChevronRightIcon className="size-3.5" />
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    );
  },
};
