import { Badge } from "@repo/design-system/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@repo/design-system/components/ui/item";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTextIcon } from "lucide-react";

const meta = {
  title: "ui/Item",
  component: Item,
  subcomponents: {
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
  },
  tags: ["autodocs"],
  render: (args) => (
    <ItemGroup className="w-96 rounded-lg border">
      <Item {...args} role="listitem">
        <ItemMedia variant="icon">
          <FileTextIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Employment agreement</ItemTitle>
          <ItemDescription>employee-001</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="outline">Mandatory</Badge>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item role="listitem" variant="muted">
        <ItemContent>
          <ItemTitle>Visa renewal</ItemTitle>
          <ItemDescription>Due soon for employee-018</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
  args: {
    variant: "default",
    size: "default",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Item>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
