import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Pagination",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Pagination,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

const auditEventLabels = [
  "Payroll variance approved",
  "Export permission reviewed",
  "Emergency admin grant escalated",
] as const;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-border-default bg-surface-raised">
        <div className="flex items-center justify-between border-border-default border-b px-4 py-3">
          <div>
            <p className="font-medium text-[12px] text-text-secondary uppercase tracking-wide">
              Audit events
            </p>
            <h3 className="font-semibold text-[15px] text-text-primary">
              2,418 retained records
            </h3>
          </div>
          <span className="text-[12px] text-text-secondary">Page 2 of 97</span>
        </div>
        <div className="grid divide-y divide-border-default px-4 text-[13px]">
          {["NWT-1042", "CTR-8831", "FBH-2219"].map((tenant, index) => (
            <div className="grid grid-cols-[120px_1fr_80px] py-2" key={tenant}>
              <span className="text-text-secondary tabular-nums">{tenant}</span>
              <span className="text-text-primary">
                {auditEventLabels[index]}
              </span>
              <span className="text-right text-text-secondary tabular-nums">
                09:{48 - index * 7}
              </span>
            </div>
          ))}
        </div>
        <div className="border-border-default border-t px-4 py-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  ),
};
