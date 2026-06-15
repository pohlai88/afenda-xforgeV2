import {
  Field,
  FieldError,
  FieldGroup,
  FieldHint,
  FieldLabel,
  FieldRequired,
  Input,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import type * as React from "react";

import { Invalid as InputInvalidStory } from "./input.stories";

const shell =
  "min-h-[540px] bg-surface-canvas p-6 text-[13px] text-text-primary";
const panel =
  "mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel";

interface FieldItemConfig {
  error?: string;
  errorId?: string;
  hint?: string;
  id: string;
  inputArgs?: React.ComponentProps<typeof Input>;
  label: string;
  required?: boolean;
  value?: string;
}

type FieldStoryArgs = React.ComponentProps<typeof Field> & {
  fields?: FieldItemConfig[];
};

function FieldFormPreview({ fields }: { fields: FieldItemConfig[] }) {
  return (
    <div className={shell}>
      <section className={panel}>
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Tenant access request</h3>
          <p className="text-text-secondary text-xs">
            Field grammar composed from reusable item args.
          </p>
        </div>
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          {fields.map((item) => (
            <Field key={item.id}>
              <FieldLabel htmlFor={item.id}>
                {item.label}
                {item.required ? <FieldRequired /> : null}
              </FieldLabel>
              <Input
                defaultValue={item.value}
                id={item.id}
                {...item.inputArgs}
                aria-describedby={item.errorId}
                aria-invalid={
                  item.error ? true : item.inputArgs?.["aria-invalid"]
                }
              />
              {item.hint ? <FieldHint>{item.hint}</FieldHint> : null}
              {item.error ? (
                <FieldError id={item.errorId}>{item.error}</FieldError>
              ) : null}
            </Field>
          ))}
        </FieldGroup>
      </section>
    </div>
  );
}

const meta = {
  title: "Afenda UI/Field",
  component: Field,
  subcomponents: {
    FieldLabel,
    FieldHint,
    FieldError,
    FieldGroup,
    FieldRequired,
  },
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Afenda field grammar: label, input, hint, and error as one governed language for forms and metadata views.",
      },
    },
  },
} satisfies Meta<FieldStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

const renderFieldList = ({ fields = [] }: FieldStoryArgs) => (
  <FieldFormPreview fields={fields} />
);

export const Default: Story = {
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <div className="border-border-subtle border-b pb-3">
          <h3 className="font-semibold text-[15px]">Tenant access request</h3>
          <p className="text-text-secondary text-xs">
            Field grammar used in a governed operator form.
          </p>
        </div>
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="afenda-field-email">
              Operator email <FieldRequired />
            </FieldLabel>
            <Input
              defaultValue="mina.chai@northwind.local"
              id="afenda-field-email"
            />
            <FieldHint>Used for sign-in and notification routing.</FieldHint>
          </Field>
          <Field>
            <FieldLabel htmlFor="afenda-field-role">Requested role</FieldLabel>
            <Input defaultValue="Payroll reviewer" id="afenda-field-role" />
            <FieldHint>Mapped against tenant role boundaries.</FieldHint>
          </Field>
        </FieldGroup>
      </section>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className={shell}>
      <section className={panel}>
        <div className="flex items-center justify-between border-border-subtle border-b pb-3">
          <div>
            <h3 className="font-semibold text-[15px]">Field error state</h3>
            <p className="text-text-secondary text-xs">
              Error copy remains scoped to the specific field.
            </p>
          </div>
          <span className="text-status-danger text-xs">Blocked</span>
        </div>
        <Field className="max-w-lg">
          <FieldLabel htmlFor="afenda-field-email-invalid">
            Evidence owner email <FieldRequired />
          </FieldLabel>
          <Input
            aria-describedby="afenda-field-email-error"
            aria-invalid="true"
            defaultValue="ops"
            id="afenda-field-email-invalid"
          />
          <FieldHint>
            Used for audit notifications and approval routing.
          </FieldHint>
          <FieldError id="afenda-field-email-error">
            Enter a valid tenant email address.
          </FieldError>
        </Field>
      </section>
    </div>
  ),
};

export const Empty: Story = {
  render: () => <FieldFormPreview fields={[]} />,
};

export const ManyFields: Story = {
  render: () => (
    <FieldFormPreview
      fields={[
        {
          id: "afenda-field-email",
          label: "Operator email",
          value: "mina.chai@northwind.local",
          hint: "Used for sign-in and notification routing.",
          required: true,
          inputArgs: {
            type: "email",
            placeholder: "ops@afenda.local",
          },
        },
        {
          id: "afenda-field-role",
          label: "Requested role",
          value: "Payroll reviewer",
          hint: "Mapped against tenant role boundaries.",
          inputArgs: { type: "text" },
        },
      ]}
    />
  ),
};

export const OneInvalidField: Story = {
  render: () => (
    <FieldFormPreview
      fields={[
        {
          id: "afenda-field-email-invalid",
          label: "Evidence owner email",
          hint: "Used for audit notifications and approval routing.",
          error: "Enter a valid tenant email address.",
          errorId: "afenda-field-email-error",
          required: true,
          inputArgs: {
            ...InputInvalidStory.args,
            id: "afenda-field-email-invalid",
          },
        },
      ]}
    />
  ),
};
