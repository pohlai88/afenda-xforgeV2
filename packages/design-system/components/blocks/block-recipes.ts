type AfendaBlockRecipeOwner =
  | "shell"
  | "header"
  | "toolbar"
  | "panel"
  | "section"
  | "metric"
  | "empty"
  | "density";

type AfendaBlockRecipeKind = "composition" | "layout" | "typography";

type AfendaBlockRecipeScope = "block" | "block-family";

interface AfendaBlockRecipeEntry {
  readonly className: string;
  readonly description: string;
  readonly kind: AfendaBlockRecipeKind;
  readonly owner: AfendaBlockRecipeOwner;
  readonly scope: AfendaBlockRecipeScope;
}

type AfendaBlockRecipeContract = Record<string, AfendaBlockRecipeEntry>;

const afendaBlockRecipe = {
  blockShell: {
    owner: "shell",
    kind: "layout",
    scope: "block",
    description:
      "Root block shell. Blocks must not set page-level width by default.",
    className: "w-full min-w-0",
  },
  blockStack: {
    owner: "shell",
    kind: "layout",
    scope: "block",
    description: "Default vertical block rhythm for operational pages.",
    className: "grid gap-4",
  },
  blockHeader: {
    owner: "header",
    kind: "layout",
    scope: "block-family",
    description:
      "Responsive header layout for title, description, and actions.",
    className:
      "flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
  },
  blockHeaderContent: {
    owner: "header",
    kind: "layout",
    scope: "block-family",
    description: "Header text stack with truncation safety.",
    className: "grid min-w-0 gap-1",
  },
  blockTitle: {
    owner: "header",
    kind: "typography",
    scope: "block-family",
    description: "Block title text. Denser than marketing page titles.",
    className: "text-[15px] font-semibold leading-5 text-text-primary",
  },
  blockDescription: {
    owner: "header",
    kind: "typography",
    scope: "block-family",
    description: "Block supporting text for scope and operator guidance.",
    className:
      "text-[length:var(--xforge-font-caption-size)] leading-[var(--xforge-font-caption-line-height)] text-text-secondary",
  },
  blockToolbar: {
    owner: "toolbar",
    kind: "layout",
    scope: "block-family",
    description:
      "Action and filter toolbar layout that wraps without breaking density.",
    className: "flex min-w-0 flex-wrap items-center gap-2",
  },
  blockPanel: {
    owner: "panel",
    kind: "composition",
    scope: "block-family",
    description:
      "Default block panel surface for evidence and metadata groups.",
    className:
      "rounded-[var(--card-radius)] border border-border-default bg-surface-raised text-text-primary shadow-panel",
  },
  blockPanelPadding: {
    owner: "panel",
    kind: "layout",
    scope: "block-family",
    description: "Default block panel padding.",
    className: "p-[var(--card-padding)]",
  },
  blockSection: {
    owner: "section",
    kind: "layout",
    scope: "block-family",
    description: "Internal section rhythm inside block panels.",
    className: "grid gap-3",
  },
  blockSectionDivider: {
    owner: "section",
    kind: "composition",
    scope: "block-family",
    description: "Subtle section separation for dense block content.",
    className: "border-t border-border-default pt-3",
  },
  blockMetric: {
    owner: "metric",
    kind: "typography",
    scope: "block-family",
    description:
      "Metric value typography for counts, SLA, and variance values.",
    className:
      "text-[20px] font-semibold leading-none tabular-nums text-text-primary",
  },
  blockMetricLabel: {
    owner: "metric",
    kind: "typography",
    scope: "block-family",
    description: "Metric label text.",
    className:
      "text-[length:var(--xforge-font-caption-size)] leading-[var(--xforge-font-caption-line-height)] text-text-secondary",
  },
  blockEmpty: {
    owner: "empty",
    kind: "composition",
    scope: "block-family",
    description: "Quiet empty-state surface for operational blocks.",
    className:
      "grid min-h-32 place-items-center rounded-[var(--card-radius)] border border-dashed border-border-default bg-surface text-center text-text-secondary",
  },
  blockCompact: {
    owner: "density",
    kind: "layout",
    scope: "block-family",
    description: "Compact block density modifier.",
    className: "gap-3",
  },
  blockComfortable: {
    owner: "density",
    kind: "layout",
    scope: "block-family",
    description: "Default comfortable block density modifier.",
    className: "gap-4",
  },
  blockChrome: {
    owner: "shell",
    kind: "composition",
    scope: "block-family",
    description: "Workspace chrome strip above the operational site container.",
    className:
      "border-border-default border-b bg-surface-raised text-sidebar-foreground",
  },
  blockRail: {
    owner: "section",
    kind: "layout",
    scope: "block-family",
    description:
      "Secondary navigation or audit rail inside an app-shell site container.",
    className: "min-h-0 overflow-auto border-border-subtle bg-surface-muted/40",
  },
  blockStage: {
    owner: "shell",
    kind: "layout",
    scope: "block",
    description: "Canvas behind a floating or docked site container.",
    className: "relative min-h-0 min-w-0 overflow-hidden bg-surface-muted/20",
  },
} as const satisfies AfendaBlockRecipeContract;

type AfendaBlockRecipeKey = keyof typeof afendaBlockRecipe;

function blockRecipe(...keys: AfendaBlockRecipeKey[]) {
  return keys.map((key) => afendaBlockRecipe[key].className).join(" ");
}

export { afendaBlockRecipe, blockRecipe };
export type {
  AfendaBlockRecipeContract,
  AfendaBlockRecipeEntry,
  AfendaBlockRecipeKey,
};
