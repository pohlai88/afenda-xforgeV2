import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/design-system/components/ui/command";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Fast, composable, unstyled command menu for React.
 */
const meta = {
  title: "ui/Command",
  component: Command,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "rounded-lg w-96 border shadow-md",
  },
  render: (args) => (
    <Command {...args}>
      <CommandInput aria-label="Search commands" placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem value="calendar">Calendar</CommandItem>
        <CommandItem value="search-emoji">Search Emoji</CommandItem>
        <CommandItem value="calculator">Calculator</CommandItem>
        <CommandItem value="profile">Profile</CommandItem>
        <CommandItem value="billing">Billing</CommandItem>
        <CommandItem value="settings">Settings</CommandItem>
      </CommandList>
    </Command>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the command.
 */
export const Default: Story = {};
