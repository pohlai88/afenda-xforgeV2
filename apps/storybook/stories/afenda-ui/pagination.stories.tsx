import type { Meta, StoryObj } from "@storybook/react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/design-system/components/afenda-ui/pagination"

const meta = {
  title: "Afenda UI/Pagination",
  component: Pagination,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-border-default bg-surface-raised">
        <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-secondary">
              Audit events
            </p>
            <h3 className="text-[15px] font-semibold text-text-primary">
              2,418 retained records
            </h3>
          </div>
          <span className="text-[12px] text-text-secondary">
            Page 2 of 97
          </span>
        </div>
        <div className="grid divide-y divide-border-default px-4 text-[13px]">
          {["NWT-1042", "CTR-8831", "FBH-2219"].map((tenant, index) => (
            <div
              key={tenant}
              className="grid grid-cols-[120px_1fr_80px] py-2"
            >
              <span className="tabular-nums text-text-secondary">
                {tenant}
              </span>
              <span className="text-text-primary">
                {index === 0
                  ? "Payroll variance approved"
                  : index === 1
                    ? "Export permission reviewed"
                    : "Emergency admin grant escalated"}
              </span>
              <span className="text-right tabular-nums text-text-secondary">
                09:{48 - index * 7}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border-default px-4 py-3">
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
}
