import { Fragment } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/design-system/components/afenda-ui/breadcrumb"

type BreadcrumbSegment = {
  label: string
  href?: string
}

const defaultSegments: BreadcrumbSegment[] = [
  { label: "Tenants", href: "#" },
  { label: "Northwind Trading", href: "#" },
  { label: "Payroll close", href: "#" },
  { label: "Audit packet AP-2048" },
]

function BreadcrumbTrail({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <Fragment key={segment.label}>
            {index > 0 ? <BreadcrumbSeparator /> : null}
            <BreadcrumbItem>
              {segment.href ? (
                <BreadcrumbLink href={segment.href}>{segment.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function BreadcrumbSurface({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-border-default bg-surface-raised">
        <div className="border-b border-border-default px-4 py-3">
          <BreadcrumbTrail segments={segments} />
        </div>
        <div className="grid gap-2 p-4">
          <p className="text-[12px] font-medium uppercase tracking-wide text-text-secondary">
            Current surface
          </p>
          <h3 className="text-[15px] font-semibold text-text-primary">
            {segments.at(-1)?.label}
          </h3>
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: "Afenda UI/Breadcrumb",
  component: Breadcrumb,
  subcomponents: {
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
  },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <BreadcrumbSurface segments={defaultSegments} />,
}

export const ShortTrail: Story = {
  render: () => (
    <BreadcrumbSurface
      segments={[
        { label: "Tenants", href: "#" },
        { label: "Northwind Trading" },
      ]}
    />
  ),
}
