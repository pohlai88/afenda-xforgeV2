import type { Meta, StoryObj } from "@storybook/react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/design-system/components/afenda-ui/chart"

const chartData = [
  { hour: "06:00", approvals: 42, breaches: 3 },
  { hour: "07:00", approvals: 68, breaches: 4 },
  { hour: "08:00", approvals: 91, breaches: 9 },
  { hour: "09:00", approvals: 76, breaches: 6 },
  { hour: "10:00", approvals: 58, breaches: 2 },
]

const chartConfig = {
  approvals: {
    label: "Approvals",
    color: "var(--brand-primary)",
  },
  breaches: {
    label: "SLA breaches",
    color: "var(--danger)",
  },
} satisfies ChartConfig

function ChartStory() {
  return (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-5xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-secondary">
              Control analytics
            </p>
            <h3 className="text-[15px] font-semibold text-text-primary">
              Approval throughput by hour
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-right text-[12px]">
            <span className="text-text-secondary">Queue depth</span>
            <span className="font-medium tabular-nums text-text-primary">
              184
            </span>
            <span className="text-text-secondary">Breach rate</span>
            <span className="font-medium tabular-nums text-text-primary">
              3.8%
            </span>
          </div>
        </div>
        <ChartContainer
          aria-label="Hourly approval volume and SLA breaches"
          config={chartConfig}
          className="h-72 w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="approvals" fill="var(--color-approvals)" radius={4} />
            <Bar dataKey="breaches" fill="var(--color-breaches)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

const meta = {
  title: "Afenda UI/Chart",
  component: ChartStory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ChartStory />,
}
