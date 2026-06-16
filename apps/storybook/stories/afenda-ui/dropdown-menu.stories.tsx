import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import {
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";

const meta = {
  title: "Afenda UI/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda dropdown menu primitive. Compact row actions, record menus, and quick preferences without heavy focus chrome.",
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RowActions: Story = {
  render: () => (
    <div className="w-[760px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="grid grid-cols-[1fr_120px_110px_64px] border-border-default border-b px-5 py-3 font-medium text-[12px] text-text-secondary uppercase tracking-wide">
        <span>Record</span>
        <span>Status</span>
        <span>Owner</span>
        <span />
      </div>
      <div className="grid grid-cols-[1fr_120px_110px_64px] items-center gap-3 px-5 py-4 text-[13px]">
        <div>
          <p className="font-medium text-text-primary">PAY-2026-0615</p>
          <p className="text-text-secondary">
            Payroll export requires approval before release
          </p>
        </div>
        <Badge tone="warning" variant="soft">
          Pending
        </Badge>
        <span className="text-text-secondary">Finance</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Open row actions" size="icon" variant="quiet">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Record actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <PencilIcon />
                Edit record
                <DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserRoundIcon />
                Assign owner
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Copy record ID</DropdownMenuItem>
                <DropdownMenuItem>Open audit log</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              Watch this record
            </DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value="normal">
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="normal">
                Normal
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="critical">
              <Trash2Icon />
              Remove access
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  ),
};
