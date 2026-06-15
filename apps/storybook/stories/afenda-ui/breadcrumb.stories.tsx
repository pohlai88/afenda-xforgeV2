import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { Fragment } from "react";

interface BreadcrumbSegment {
  href?: string;
  label: string;
}

const defaultSegments: BreadcrumbSegment[] = [
  { label: "Tenants", href: "#" },
  { label: "Northwind Trading", href: "#" },
  { label: "Payroll close", href: "#" },
  { label: "Audit packet AP-2048" },
];

function BreadcrumbTrail({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <Fragment key={segment.label}>
            {index > 0 ? <BreadcrumbSeparator /> : null}
            <BreadcrumbItem>
              {segment.href ? (
                <BreadcrumbLink href={segment.href}>
                  {segment.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadcrumbSurface({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-border-default bg-surface-raised">
        <div className="border-border-default border-b px-4 py-3">
          <BreadcrumbTrail segments={segments} />
        </div>
        <div className="grid gap-2 p-4">
          <p className="font-medium text-[12px] text-text-secondary uppercase tracking-wide">
            Current surface
          </p>
          <h3 className="font-semibold text-[15px] text-text-primary">
            {segments.at(-1)?.label}
          </h3>
        </div>
      </div>
    </div>
  );
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
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <BreadcrumbSurface segments={defaultSegments} />,
};

export const ShortTrail: Story = {
  render: () => (
    <BreadcrumbSurface
      segments={[
        { label: "Tenants", href: "#" },
        { label: "Northwind Trading" },
      ]}
    />
  ),
};
