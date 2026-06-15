import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/design-system/components/afenda-ui/field";
import { Input } from "@repo/design-system/components/afenda-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/afenda-ui/select";
import {
  EmptyPanel,
  FilterBar,
  FormSection,
  PageHeader,
  StatsStrip,
} from "@repo/design-system/components/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertTriangleIcon,
  ArchiveIcon,
  CheckCircle2Icon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  PlusIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Foundation",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Foundation Afenda blocks for dense ERP and operator workflows. Blocks compose afenda-ui primitives and block recipes without owning app routing, persistence, or domain state.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const tenantMetrics = [
  {
    id: "approval-risk",
    label: "Approval risk",
    value: "14",
    description: "4 requests breach SLA in the next 2 hours.",
    tone: "warning" as const,
    icon: <AlertTriangleIcon aria-hidden="true" />,
  },
  {
    id: "ready",
    label: "Ready to post",
    value: "86",
    description: "Validated records awaiting batch approval.",
    tone: "success" as const,
    icon: <CheckCircle2Icon aria-hidden="true" />,
  },
  {
    id: "audit-events",
    label: "Audit events",
    value: "1,284",
    description: "Immutable events captured this billing period.",
    icon: <FileTextIcon aria-hidden="true" />,
  },
  {
    id: "policy-locks",
    label: "Policy locks",
    value: "7",
    description: "Tenant-scoped controls preventing unsafe edits.",
    tone: "info" as const,
    icon: <ShieldCheckIcon aria-hidden="true" />,
  },
];

export const OperatorWorkspace: Story = {
  render: () => (
    <main className="grid w-[min(1040px,calc(100vw-32px))] min-w-0 gap-4">
      <PageHeader
        actions={[
          {
            key: "export",
            label: "Export",
            icon: <DownloadIcon aria-hidden="true" />,
            variant: "quiet",
          },
          {
            key: "new-approval",
            label: "New approval",
            icon: <PlusIcon aria-hidden="true" />,
            variant: "primary",
            permission: "approval.create",
          },
        ]}
        description="Review tenant-scoped approvals, evidence status, and policy locks before posting operational changes."
        eyebrow="ERP / Tenant operations"
        meta={[
          { id: "tenant", label: "Northwind Trading" },
          { id: "period", label: "June close" },
          { id: "timezone", label: "UTC+07" },
        ]}
        status={{ label: "SLA watch", tone: "warning" }}
        title="Approval control center"
      />

      <StatsStrip metrics={tenantMetrics} />

      <FilterBar
        actions={[
          {
            key: "refresh",
            label: "Refresh",
            icon: <RefreshCcwIcon aria-hidden="true" />,
            variant: "quiet",
          },
        ]}
        activeFilters={[
          { id: "status", label: "Status: pending", tone: "warning" },
          { id: "tenant", label: "Tenant: Northwind" },
          { id: "sla", label: "SLA: < 4h", tone: "critical" },
        ]}
        filters={
          <>
            <Button size="sm" variant="quiet">
              <FilterIcon aria-hidden="true" className="size-4" />
              Filters
            </Button>
            <Select defaultValue="risk">
              <SelectTrigger className="w-40" size="compact">
                <SelectValue aria-label="Queue view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="risk">Risk first</SelectItem>
                <SelectItem value="tenant">By tenant</SelectItem>
                <SelectItem value="owner">By owner</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        id="approval-filters"
        resultCount={128}
        searchPlaceholder="Search tenant, owner, or approval ID..."
      />
    </main>
  ),
};

export const ExpectedEmptyState: Story = {
  render: () => (
    <div className="w-[min(720px,calc(100vw-32px))] min-w-0">
      <EmptyPanel
        actions={[
          {
            key: "archive-queue",
            label: "Archive queue",
            icon: <ArchiveIcon aria-hidden="true" />,
            variant: "secondary",
          },
        ]}
        description="All tenant approvals for this date range have either posted or moved into the audit archive."
        icon={<CheckCircle2Icon aria-hidden="true" />}
        title="No approvals waiting"
      >
        <Badge tone="positive" variant="outline">
          Last sync 09:42
        </Badge>
      </EmptyPanel>
    </div>
  ),
};

export const GovernedFormSection: Story = {
  render: () => (
    <div className="w-[min(760px,calc(100vw-32px))] min-w-0">
      <FormSection
        actions={
          <Button size="sm" variant="quiet">
            View audit policy
          </Button>
        }
        description="Changes here affect downstream posting rules. Field primitives retain label, hint, and error ownership."
        footer="Autosave is disabled for this section because approval policy changes require explicit review."
        status={{ label: "Manual review", tone: "warning" }}
        title="Posting controls"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="posting-group">Posting group</FieldLabel>
            <Input defaultValue="AP-NORTHWIND-2026" id="posting-group" />
            <FieldDescription>
              Used for audit evidence, batch posting, and exception routing.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="approval-threshold">
              Approval threshold
            </FieldLabel>
            <Input
              className="max-w-48 tabular-nums"
              defaultValue="50,000"
              id="approval-threshold"
              inputMode="numeric"
            />
            <FieldDescription>
              Amounts above this threshold require a second approver.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FormSection>
    </div>
  ),
};
