import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "ui/Field",
  component: Field,
  tags: ["autodocs"],
  render: (args) => (
    <FieldSet className="w-80">
      <FieldLegend>Workspace settings</FieldLegend>
      <FieldGroup>
        <Field {...args}>
          <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
          <Input defaultValue="XForge Vietnam Ops" id="workspace-name" />
          <FieldDescription>Visible in tenant-scoped audit records.</FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="audit-panels" defaultChecked />
          <FieldContent>
            <FieldTitle>Show audit panels</FieldTitle>
            <FieldDescription>Keep evidence visible beside workflows.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orientation: "vertical",
  },
};
