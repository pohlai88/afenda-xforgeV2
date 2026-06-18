import {
  Badge,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Carousel",
  component: Carousel,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Carousel previewed only as a supporting insight snapshot, not a primary operating surface.",
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

const snapshots = [
  ["SLA pressure", "4 requests breach within two hours", "warning"],
  ["Payroll lock", "Northwind Trading remains locked", "critical"],
  ["Audit export", "236 events ready for review", "info"],
] as const;

export const InsightSnapshots: Story = {
  render: () => (
    <section className="w-[620px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel">
      <div className="mb-4 grid gap-1">
        <h2 className="font-semibold text-[14px] text-text-primary">
          Operational snapshots
        </h2>
        <p className="text-[12px] text-text-secondary">
          Carousel is reserved for supporting discovery, never row operations.
        </p>
      </div>
      <Carousel className="mx-auto w-[440px]">
        <CarouselContent>
          {snapshots.map(([title, description, tone]) => (
            <CarouselItem key={title}>
              <Card>
                <CardContent className="grid h-36 content-center gap-3">
                  <Badge className="w-fit" tone={tone} variant="outline">
                    {title}
                  </Badge>
                  <p className="text-[13px] text-text-secondary">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  ),
};
