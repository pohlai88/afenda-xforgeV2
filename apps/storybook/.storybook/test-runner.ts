import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import { getViolations, injectAxe } from "axe-playwright";

import { formatStorybookDebugMessage } from "./debug.ts";

const storybookConfigDir = dirname(fileURLToPath(import.meta.url));
const reportDir = join(storybookConfigDir, "a11y-reports");
const summaryPath = join(reportDir, "summary.md");
const indexPath = join(reportDir, "index.json");
const interactionLane = process.env.STORYBOOK_INTERACTION_LANE === "1";
const overflowCheckEnabled = process.env.STORYBOOK_OVERFLOW_CHECK === "1";
const overflowWidth = Number(process.env.STORYBOOK_OVERFLOW_WIDTH ?? 0);
const overflowLabel =
  process.env.STORYBOOK_OVERFLOW_LABEL ?? `${overflowWidth}px`;

interface ReportIndexEntry {
  name: string;
  storyId: string;
  title: string;
  violations: string[];
}

interface StoryContextLike {
  name: string;
  parameters?: {
    a11y?: {
      disable?: boolean;
      test?: "off" | "todo" | "error";
    };
  };
  tags?: string[];
  title: string;
}

/** Afenda/block axe lane — skip legacy ui reference stories and interaction plays. */
function shouldSkipPostVisitA11y(storyContext: StoryContextLike) {
  if (storyContext.title.startsWith("ui/")) {
    return true;
  }

  if (storyContext.parameters?.a11y?.disable) {
    return true;
  }

  if (storyContext.parameters?.a11y?.test === "off") {
    return true;
  }

  if (storyContext.tags?.includes("interaction")) {
    return true;
  }

  if (storyContext.tags?.includes("visual-audit")) {
    return true;
  }

  return false;
}

function shouldSkipPostVisitOverflow(storyContext: StoryContextLike) {
  if (storyContext.title.startsWith("ui/")) {
    return true;
  }

  if (storyContext.tags?.includes("visual-audit")) {
    return true;
  }

  return false;
}

const readIndexEntries = async (): Promise<ReportIndexEntry[]> => {
  try {
    const raw = await readFile(indexPath, "utf8");
    const parsed = JSON.parse(raw) as
      | ReportIndexEntry[]
      | { stories?: ReportIndexEntry[] };

    return Array.isArray(parsed) ? parsed : (parsed.stories ?? []);
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
    ...existingEntries.filter(
      (candidate) => candidate.storyId !== entry.storyId
    ),
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
    if (overflowCheckEnabled && overflowWidth > 0) {
      await page.setViewportSize({ height: 900, width: overflowWidth });
      return;
    }

    await injectAxe(page);
  },
  async postVisit(page, context) {
    if (interactionLane) {
      return;
    }

    const storyContext = await getStoryContext(page, context);

    if (overflowCheckEnabled && !shouldSkipPostVisitOverflow(storyContext)) {
      await page.waitForSelector("#storybook-root", { state: "attached" });

      const overflow = await page.evaluate(() => {
        const root = document.querySelector("#storybook-root");
        const body = document.body;
        const documentElement = document.documentElement;
        const viewportWidth = documentElement.clientWidth;
        const maxScrollWidth = Math.max(
          body.scrollWidth,
          documentElement.scrollWidth,
          root?.scrollWidth ?? 0
        );

        return {
          maxScrollWidth,
          viewportWidth,
        };
      });

      if (overflow.maxScrollWidth > overflow.viewportWidth + 1) {
        throw new Error(
          formatStorybookDebugMessage(
            context.id,
            `Horizontal overflow at ${overflowLabel}: ${overflow.maxScrollWidth}px content in ${overflow.viewportWidth}px viewport`,
            "actions"
          )
        );
      }

      return;
    }

    if (shouldSkipPostVisitA11y(storyContext)) {
      return;
    }

    await page.waitForSelector("#storybook-root", { state: "attached" });

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
      reportEntry.violations.map(
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
