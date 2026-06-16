import { cn } from "@repo/design-system/lib/utils";

export type CockpitStatusTone = "green" | "blue" | "amber" | "red";

export const statusDotClass: Record<CockpitStatusTone, string> = {
  green: "bg-[var(--status-success)]",
  blue: "bg-[var(--status-info)]",
  amber: "bg-[var(--status-warning)]",
  red: "bg-[var(--status-danger)]",
};

export const statusTextClass: Record<CockpitStatusTone, string> = {
  green: "text-[var(--status-success)]",
  blue: "text-[var(--status-info)]",
  amber: "text-[var(--status-warning)]",
  red: "text-[var(--status-danger)]",
};

export const statusOutlineClass: Record<CockpitStatusTone, string> = {
  green:
    "border-[var(--status-success)]/25 bg-[var(--status-success)]/10 text-[var(--status-success)]",
  blue: "border-[var(--status-info)]/25 bg-[var(--status-info)]/10 text-[var(--status-info)]",
  amber:
    "border-[var(--status-warning)]/25 bg-[var(--status-warning)]/10 text-[var(--status-warning)]",
  red: "border-[var(--status-danger)]/25 bg-[var(--status-danger)]/10 text-[var(--status-danger)]",
};

export function CockpitStatusLabel({
  label,
  tone,
}: {
  readonly label: string;
  readonly tone: CockpitStatusTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end gap-1.5 text-[12px]",
        statusTextClass[tone]
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", statusDotClass[tone])}
      />
      {label}
    </span>
  );
}

export function CockpitStatusChip({
  label,
  tone,
}: {
  readonly label: string;
  readonly tone: CockpitStatusTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px]",
        statusOutlineClass[tone]
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function CockpitKbdHint({ keys }: { readonly keys: string }) {
  return (
    <kbd className="rounded border border-border-default bg-surface-muted/50 px-1 py-0.5 font-mono text-[10px] text-text-secondary">
      {keys}
    </kbd>
  );
}

export function CockpitMiniSparkline({
  tone,
  values,
}: {
  readonly tone: CockpitStatusTone;
  readonly values: readonly number[];
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 24 - ((value - min) / range) * 20;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      aria-hidden="true"
      className={cn("h-6 w-16 shrink-0", statusTextClass[tone])}
      preserveAspectRatio="none"
      viewBox="0 0 100 24"
    >
      <polyline
        fill="none"
        points={points}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
