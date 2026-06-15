import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import { Card, CardContent } from "@repo/design-system/components/afenda-ui/card";
import { Input } from "@repo/design-system/components/afenda-ui/input";
import { cn } from "@repo/design-system/lib/utils";
import {
  FileTextIcon,
  KeyRoundIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";

const statusTone = {
  green:
    "border-[var(--status-success)]/25 bg-[var(--status-success)]/10 text-[var(--status-success)]",
  blue: "border-[var(--status-info)]/25 bg-[var(--status-info)]/10 text-[var(--status-info)]",
  amber:
    "border-[var(--status-warning)]/25 bg-[var(--status-warning)]/10 text-[var(--status-warning)]",
  red: "border-[var(--status-danger)]/25 bg-[var(--status-danger)]/10 text-[var(--status-danger)]",
} as const;

type StatusTone = keyof typeof statusTone;

const kpis = [
  { title: "Customers", value: "128", detail: "tenant scoped", tone: "green" },
  { title: "Companies", value: "24", detail: "company grants", tone: "blue" },
  { title: "Role", value: "Admin", detail: "policy verified", tone: "green" },
  { title: "Exposure", value: "3", detail: "needs review", tone: "amber" },
] satisfies Array<{
  title: string;
  value: string;
  detail: string;
  tone: StatusTone;
}>;

const entityRows = [
  {
    name: "Acme Payroll",
    meta: "Customer / AP-104",
    status: "Ready",
    tone: "green",
  },
  {
    name: "Northstar Legal",
    meta: "Company / NS-9",
    status: "Grant check",
    tone: "amber",
  },
  {
    name: "Bright HR",
    meta: "Customer / BH-331",
    status: "Restricted",
    tone: "red",
  },
] satisfies RecordRowProps[];

const evidenceRows = [
  {
    name: "Employment agreement",
    meta: "employee-001",
    status: "Mandatory",
    tone: "blue",
  },
  {
    name: "Visa renewal",
    meta: "employee-018",
    status: "Due soon",
    tone: "amber",
  },
  {
    name: "Policy acknowledgement",
    meta: "employee-044",
    status: "Internal",
    tone: "green",
  },
] satisfies RecordRowProps[];

const activities = [
  {
    label: "read",
    title: "Tenant membership verified",
    time: "2 min ago",
    tone: "green",
  },
  {
    label: "write",
    title: "Customer update committed",
    time: "12 min ago",
    tone: "amber",
  },
  {
    label: "Documents",
    title: "HR document indexed",
    time: "1 hr ago",
    tone: "blue",
  },
] satisfies ActivityCardProps[];

const auditEvents = [
  {
    title: "Permission enforced",
    meta: "system-admin.overview",
    tone: "green",
  },
  {
    title: "Company grant missing",
    meta: "northstar.legal",
    tone: "amber",
  },
  {
    title: "Sensitive field blocked",
    meta: "employee.compensation",
    tone: "red",
  },
] satisfies Array<{ title: string; meta: string; tone: StatusTone }>;

const sequenceSteps = [
  "Actor",
  "Tenant",
  "Company",
  "Permission",
  "Domain op",
  "Audit",
];

export function WorkspaceCockpit() {
  return (
    <main className="grid flex-1 gap-[var(--xforge-space-6)] p-[var(--xforge-space-7)] pt-0 xl:grid-cols-[minmax(0,1fr)_var(--xforge-layout-audit-rail)]">
      <section className="grid min-w-0 gap-[var(--xforge-space-6)]">
        <WorkspaceTopbar />
        <TenantDashboardHeader />
        <div className="grid gap-[var(--xforge-space-6)] lg:grid-cols-2">
          <WorkQueueCard
            action="Add"
            rows={entityRows}
            subtitle="Customers and companies"
            title="Master records"
          />
          <WorkQueueCard
            rows={evidenceRows}
            subtitle="Document storage, registration, and employee evidence."
            title="HR Suite"
          />
        </div>
        <section className="grid gap-[var(--xforge-space-3)] rounded-lg border bg-card p-[var(--xforge-space-4)]">
          <h2 className="font-semibold text-base">Recent audit activity</h2>
          <div className="grid gap-[var(--xforge-space-3)] md:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.title} {...activity} />
            ))}
          </div>
        </section>
      </section>
      <AuditEvidenceRail />
    </main>
  );
}

export function WorkspaceTopbar() {
  return (
    <div className="flex min-h-15 flex-col gap-[var(--xforge-space-3)] rounded-lg border bg-card p-[var(--xforge-space-3)] lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 pl-9"
          placeholder="Search records, actions, evidence"
          readOnly
        />
      </div>
      <StatusPill label="Audit panels on" tone="green" />
      <Button>New record</Button>
    </div>
  );
}

export function TenantDashboardHeader() {
  return (
    <section className="grid gap-[var(--xforge-space-5)] rounded-lg border bg-card p-[var(--xforge-space-6)]">
      <div className="grid gap-[var(--xforge-space-5)] lg:grid-cols-[1fr_212px]">
        <div className="grid gap-[var(--xforge-space-3)]">
          <StatusPill label="Overview lane" tone="blue" />
          <div>
            <h1 className="font-semibold text-3xl tracking-normal">
              Governed tenant dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-5">
              Signed in as operations@xforge.local with tenant role admin.
              Sensitive reads stay tenant and company scoped.
            </p>
          </div>
        </div>
        <Card className="rounded-lg">
          <CardContent className="grid gap-1 p-[var(--xforge-space-3)]">
            <div className="font-semibold text-muted-foreground text-xs">
              Execution guard
            </div>
            <div className="font-semibold text-3xl text-[var(--status-success)]">
              10/10
            </div>
            <div className="text-muted-foreground text-xs">
              auth, tenant, grants, audit
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-[var(--xforge-space-3)] sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>
    </section>
  );
}

export function KpiCard({
  detail,
  title,
  tone,
  value,
}: {
  detail: string;
  title: string;
  tone: StatusTone;
  value: string;
}) {
  return (
    <Card className="rounded-lg">
      <CardContent className="grid gap-2 p-[var(--xforge-space-4)]">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn("size-2 rounded-full", statusTone[tone])}
          />
          <span className="font-medium text-muted-foreground text-xs">
            {title}
          </span>
        </div>
        <div className="font-semibold text-3xl">{value}</div>
        <div className="text-muted-foreground text-xs">{detail}</div>
      </CardContent>
    </Card>
  );
}

function WorkQueueCard({
  action,
  rows,
  subtitle,
  title,
}: {
  action?: string;
  rows: RecordRowProps[];
  subtitle: string;
  title: string;
}) {
  return (
    <section className="grid gap-[var(--xforge-space-3)] rounded-lg border bg-card p-[var(--xforge-space-4)]">
      <div className="flex items-start justify-between gap-[var(--xforge-space-3)]">
        <div>
          <h2 className="font-semibold text-base">{title}</h2>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
        {action ? (
          <Button size="sm" variant="secondary">
            {action}
          </Button>
        ) : null}
      </div>
      <div className="grid gap-[var(--xforge-space-3)]">
        {rows.map((row) => (
          <RecordRow key={row.name} {...row} />
        ))}
      </div>
    </section>
  );
}

interface RecordRowProps {
  meta: string;
  name: string;
  status: string;
  tone: StatusTone;
}

export function RecordRow({ meta, name, status, tone }: RecordRowProps) {
  return (
    <div className="flex items-center justify-between gap-[var(--xforge-space-3)] rounded-lg border bg-background/60 p-[var(--xforge-space-3)]">
      <div className="min-w-0">
        <div className="truncate font-semibold text-sm">{name}</div>
        <div className="truncate text-muted-foreground text-xs">{meta}</div>
      </div>
      <StatusPill label={status} tone={tone} />
    </div>
  );
}

interface ActivityCardProps {
  label: string;
  time: string;
  title: string;
  tone: StatusTone;
}

export function ActivityCard({ label, time, title, tone }: ActivityCardProps) {
  return (
    <Card className="rounded-lg">
      <CardContent className="grid gap-[var(--xforge-space-2)] p-[var(--xforge-space-3)]">
        <StatusPill label={label} tone={tone} />
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-muted-foreground text-xs">{time}</div>
      </CardContent>
    </Card>
  );
}

export function AuditEvidenceRail() {
  return (
    <aside className="grid h-fit gap-[var(--xforge-space-4)] rounded-lg border bg-card p-[var(--xforge-space-4)]">
      <div>
        <h2 className="font-semibold text-lg">Audit evidence</h2>
        <p className="mt-2 text-muted-foreground text-xs leading-5">
          Docked rail exposes risk without stealing the main workflow.
        </p>
      </div>
      <StatusPill label="Scope: system-admin.overview" tone="blue" />
      <div className="grid gap-[var(--xforge-space-4)]">
        {auditEvents.map((event) => (
          <div className="flex gap-[var(--xforge-space-3)]" key={event.title}>
            <span
              aria-hidden
              className={cn(
                "mt-1 h-11 w-1 rounded-full",
                statusTone[event.tone]
              )}
            />
            <div>
              <div className="font-semibold text-sm">{event.title}</div>
              <div className="text-muted-foreground text-xs">{event.meta}</div>
            </div>
          </div>
        ))}
      </div>
      <SequenceList />
      <Button className="w-fit" variant="secondary">
        Export evidence
      </Button>
      <Card className="rounded-lg">
        <CardContent className="grid gap-[var(--xforge-space-3)] p-[var(--xforge-space-3)]">
          <div className="font-semibold text-sm">Selected evidence detail</div>
          <StatusPill label="Company grant missing" tone="amber" />
          <p className="text-muted-foreground text-xs leading-5">
            Request attempted to read a company-scoped record without a matching
            grant. The domain operation was blocked before mutation.
          </p>
          <div className="flex flex-wrap gap-2">
            <StatusPill label="Recheck grant" tone="green" />
            <StatusPill label="Open policy" tone="blue" />
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

export function SequenceList() {
  return (
    <div className="grid gap-[var(--xforge-space-2)] rounded-lg border bg-background/60 p-[var(--xforge-space-3)]">
      {sequenceSteps.map((step, index) => (
        <div
          className="flex items-center gap-[var(--xforge-space-2)]"
          key={step}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-primary font-semibold text-[10px] text-primary-foreground">
            {index + 1}
          </span>
          <span className="font-medium text-sm">{step}</span>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <Badge
      className={cn(
        "w-fit gap-1.5 rounded-md border px-2 py-1 font-semibold text-xs",
        statusTone[tone]
      )}
      variant="outline"
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}

export const cockpitIcons = {
  document: FileTextIcon,
  permission: KeyRoundIcon,
  verified: ShieldCheckIcon,
};
