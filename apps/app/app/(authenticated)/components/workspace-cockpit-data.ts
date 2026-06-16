import type { CockpitStatusTone } from "./cockpit-status-ui";

export interface CockpitKpiItem {
  readonly delta: string;
  readonly detail: string;
  readonly title: string;
  readonly tone: CockpitStatusTone;
  readonly trend: readonly number[];
  readonly value: string;
}

export interface CockpitQueueRow {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly tone: CockpitStatusTone;
}

export interface CockpitFlatQueueRow extends CockpitQueueRow {
  readonly tableId: string;
}

export interface CockpitActivityItem {
  readonly label: string;
  readonly time: string;
  readonly title: string;
  readonly tone: CockpitStatusTone;
}

export interface CockpitAuditEvent {
  readonly meta: string;
  readonly title: string;
  readonly tone: CockpitStatusTone;
}

export interface CockpitQueueTable {
  readonly action?: string;
  readonly actionHint?: string;
  readonly id: string;
  readonly rows: readonly CockpitQueueRow[];
  readonly subtitle: string;
  readonly title: string;
}

export type CockpitQueueRowKey = `${string}:${string}`;

export function getCockpitQueueRowKey(
  tableId: string,
  rowId: string
): CockpitQueueRowKey {
  return `${tableId}:${rowId}`;
}

export function parseCockpitQueueRowKey(rowKey: CockpitQueueRowKey): {
  readonly recordId: string;
  readonly tableId: string;
} {
  const separatorIndex = rowKey.indexOf(":");

  if (separatorIndex === -1) {
    return { tableId: "", recordId: rowKey };
  }

  return {
    tableId: rowKey.slice(0, separatorIndex),
    recordId: rowKey.slice(separatorIndex + 1),
  };
}

export const cockpitKpis: readonly CockpitKpiItem[] = [
  {
    title: "Customers",
    value: "128",
    detail: "tenant scoped",
    tone: "green",
    delta: "+4.2%",
    trend: [98, 102, 108, 112, 118, 124, 128],
  },
  {
    title: "Companies",
    value: "24",
    detail: "company grants",
    tone: "blue",
    delta: "+1 grant",
    trend: [20, 21, 21, 22, 23, 23, 24],
  },
  {
    title: "Role",
    value: "Admin",
    detail: "policy verified",
    tone: "green",
    delta: "stable",
    trend: [1, 1, 1, 1, 1, 1, 1],
  },
  {
    title: "Exposure",
    value: "3",
    detail: "needs review",
    tone: "amber",
    delta: "-2 since yesterday",
    trend: [7, 6, 5, 5, 4, 4, 3],
  },
];

export const cockpitQueueTables: readonly CockpitQueueTable[] = [
  {
    id: "master-records",
    title: "Master records",
    subtitle: "Customers and companies",
    action: "Add",
    actionHint: "N",
    rows: [
      {
        name: "Acme Payroll",
        id: "AP-104",
        status: "Ready",
        tone: "green",
      },
      {
        name: "Northstar Legal",
        id: "NS-9",
        status: "Grant check",
        tone: "amber",
      },
      {
        name: "Bright HR",
        id: "BH-331",
        status: "Restricted",
        tone: "red",
      },
    ],
  },
  {
    id: "hr-suite",
    title: "HR Suite",
    subtitle: "Document storage, registration, and employee evidence.",
    rows: [
      {
        name: "Employment agreement",
        id: "employee-001",
        status: "Mandatory",
        tone: "blue",
      },
      {
        name: "Visa renewal",
        id: "employee-018",
        status: "Due soon",
        tone: "amber",
      },
      {
        name: "Policy acknowledgement",
        id: "employee-044",
        status: "Internal",
        tone: "green",
      },
    ],
  },
];

export const cockpitFlatQueueRows: readonly CockpitFlatQueueRow[] =
  cockpitQueueTables.flatMap((table) =>
    table.rows.map((row) => ({ ...row, tableId: table.id }))
  );

export const cockpitQueueRowKeys: readonly CockpitQueueRowKey[] =
  cockpitFlatQueueRows.map((row) => getCockpitQueueRowKey(row.tableId, row.id));

export const cockpitActivities: readonly CockpitActivityItem[] = [
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
];

export const cockpitAuditEvents: readonly CockpitAuditEvent[] = [
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
];

export const cockpitSequenceSteps = [
  "Actor",
  "Tenant",
  "Company",
  "Permission",
  "Domain op",
  "Audit",
] as const;
