import type { Meta, StoryObj } from "@storybook/react"
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/design-system/components/afenda-ui/alert"
import { Badge } from "@repo/design-system/components/afenda-ui/badge"

const meta = {
  title: "Afenda UI/Alert",
  component: Alert,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Warning: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto grid max-w-4xl gap-3">
        <div className="flex items-center justify-between rounded-lg border border-border-default bg-surface-raised px-4 py-3">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-secondary">
              Incident lane
            </p>
            <h3 className="text-[15px] font-semibold text-text-primary">
              Payroll close alerts
            </h3>
          </div>
          <Badge variant="outline">Shift B · APAC</Badge>
        </div>
        <Alert tone="warning">
          <AlertTriangleIcon />
          <AlertTitle>Payroll period is locked</AlertTitle>
          <AlertDescription>
            NWT-1042 has 43 minutes before SLA breach. Unlock requires manager
            approval and audit note.
          </AlertDescription>
        </Alert>
        <Alert tone="critical">
          <AlertCircleIcon />
          <AlertTitle>Privileged access review breached</AlertTitle>
          <AlertDescription>
            FBH-2219 emergency admin grant passed the 15 minute review window at
            08:59.
          </AlertDescription>
        </Alert>
        <Alert tone="neutral">
          <InfoIcon />
          <AlertTitle>Data import completed with warnings</AlertTitle>
          <AlertDescription>
            1,248 rows processed, 7 mapped to suspense accounts for operator
            review.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  ),
}
