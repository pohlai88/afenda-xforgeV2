import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  Kbd,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterIcon, SearchIcon } from "lucide-react";

const meta = {
  title: "Afenda UI/InputGroup",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: InputGroup,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[520px] bg-surface-canvas p-6 text-[13px] text-text-primary">
      <section className="mx-auto grid max-w-5xl gap-5 rounded-xl border border-border-default bg-surface-raised p-5 shadow-panel">
        <div className="flex items-center justify-between border-border-subtle border-b pb-3">
          <div>
            <h3 className="font-semibold text-[15px]">Audit work queue</h3>
            <p className="text-text-secondary text-xs">
              Search across tenant records, payroll runs, evidence IDs, and
              operators.
            </p>
          </div>
          <span className="font-mono text-text-secondary text-xs">
            412 open items
          </span>
        </div>
        <div className="grid gap-3">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search PAY-2026-06, tenant, operator, or evidence ID..." />
            <InputGroupAddon align="inline-end">
              <InputGroupText>
                <Kbd className="text-text-primary">Ctrl</Kbd>
                <Kbd className="text-text-primary">K</Kbd>
              </InputGroupText>
              <InputGroupButton>Search</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon>
              <FilterIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Saved queue filter"
              defaultValue="status:blocked tenant:Northwind"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>Saved filter</InputGroupText>
              <InputGroupButton>Apply</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="grid rounded-lg border border-border-subtle text-xs">
          {[
            "PAY-1042 · off-cycle approval",
            "AUD-7781 · missing bank evidence",
            "TEN-44 · role boundary change",
          ].map((item) => (
            <div
              className="flex items-center justify-between border-border-subtle border-b px-3 py-2 last:border-b-0"
              key={item}
            >
              <span>{item}</span>
              <span className="text-text-secondary">Updated 09:42</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
