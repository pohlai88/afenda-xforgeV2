import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Result } from "axe-core";
import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import { getViolations, injectAxe } from "axe-playwright";

const STORYBOOK_DEV_URL =
  process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";

const DEBUG_PANELS = {
  interactions: "storybook/interactions/panel",
  a11y: "storybook/a11y/panel",
  actions: "storybook/actions/panel",
} as const;

type StorybookDebugPanel = keyof typeof DEBUG_PANELS;

function storybookDebugUrl(storyId: string, panel: StorybookDebugPanel) {
  const params = new URLSearchParams({
    path: `/story/${storyId}`,
    addonPanel: DEBUG_PANELS[panel],
  });

  return `${STORYBOOK_DEV_URL}/?${params.toString()}`;
}

function formatStorybookDebugMessage(
  storyId: string,
  summary: string,
  panel: StorybookDebugPanel = "a11y"
) {
  return `${summary}\n\nDebug in Storybook:\n${storybookDebugUrl(storyId, panel)}`;
}

const storybookConfigDir = dirname(fileURLToPath(import.meta.url));
const reportDir = join(storybookConfigDir, "a11y-reports");
const summaryPath = join(reportDir, "summary.md");
const indexPath = join(reportDir, "index.json");

type ReportIndexEntry = {
  storyId: string;
  title: string;
  name: string;
  violations: string[];
};

const readIndexEntries = async (): Promise<ReportIndexEntry[]> => {
  try {
    const raw = await readFile(indexPath, "utf8");
    const parsed = JSON.parse(raw) as
      | ReportIndexEntry[]
      | { stories?: ReportIndexEntry[] };

    return Array.isArray(parsed) ? parsed : parsed.stories ?? [];
  } catch {
    return [];
  }
};

const ensureReportDir = async () => {
  await mkdir(reportDir, { recursive: true });
};

const ensureSummaryHeader = async () => {
  await ensureReportDir();

  try {
    await readFile(summaryPath, "utf8");
  } catch {
    await writeFile(
      summaryPath,
      [
        "# Storybook accessibility report",
        "",
        "| Story | Rule | Impact | Nodes |",
        "| --- | --- | --- | ---: |",
        "",
      ].join("\n")
    );
  }
};

const appendSummaryRows = async (rows: string[]) => {
  await ensureSummaryHeader();

  const existing = await readFile(summaryPath, "utf8");
  const existingLines = new Set(existing.split("\n").filter(Boolean));
  const nextRows = rows.filter((row) => !existingLines.has(row));

  if (nextRows.length === 0) {
    return;
  }

  await appendFile(summaryPath, `${nextRows.join("\n")}\n`);
};

const upsertIndexEntry = async (entry: ReportIndexEntry) => {
  await ensureReportDir();

  const existingEntries = await readIndexEntries();
  const nextEntries = [
    ...existingEntries.filter((candidate) => candidate.storyId !== entry.storyId),
    entry,
  ].sort((left, right) =>
    `${left.title}/${left.name}`.localeCompare(`${right.title}/${right.name}`)
  );

  await writeFile(
    indexPath,
    JSON.stringify(
      {
        stories: nextEntries,
      },
      null,
      2
    )
  );
};

const createStoryFileName = (storyId: string) =>
  `${storyId.replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}.json`;

const escapeMarkdown = (value: string) => value.replace(/\|/g, "\\|");

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    if (storyContext.title.startsWith("ui/")) {
      return;
    }

    if (storyContext.parameters?.a11y?.disable) {
      return;
    }

    if (storyContext.tags?.includes("interaction")) {
      return;
    }

    const violations = await getViolations(page, "#storybook-root");

    if (violations.length === 0) {
      return;
    }

    const reportEntry = {
      storyId: context.id,
      title: storyContext.title,
      name: storyContext.name,
      violations: violations.map((violation) => ({
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => ({
          failureSummary: node.failureSummary,
          html: node.html,
          target: node.target,
        })),
      })),
    };

    await ensureReportDir();
    await writeFile(
      join(reportDir, createStoryFileName(context.id)),
      JSON.stringify(reportEntry, null, 2)
    );
    await appendSummaryRows(
      reportEntry.violations
        .map(
          (violation) =>
            `| ${escapeMarkdown(reportEntry.title)}/${escapeMarkdown(
              reportEntry.name ?? ""
            )} | ${escapeMarkdown(violation.id)} | ${
              violation.impact ?? "unknown"
            } | ${violation.nodes.length} |`
        )
    );
    await upsertIndexEntry({
      storyId: context.id,
      title: storyContext.title,
      name: storyContext.name,
      violations: reportEntry.violations.map((violation) => violation.id),
    });

    throw new Error(
      formatStorybookDebugMessage(
        context.id,
        `Accessibility violations found in ${storyContext.title}/${storyContext.name}: ${violations
          .map((violation) => violation.id)
          .join(", ")}`,
        "a11y"
      )
    );
  },
};

export default config;
