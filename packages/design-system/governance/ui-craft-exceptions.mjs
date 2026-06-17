import { existsSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

// biome-ignore lint/suspicious/noControlCharactersInRegex: strips ANSI escape sequences from detector output.
const ANSI_PATTERN = /\u001b\[[0-9;]*m/g;
const FINDING_MESSAGE_PATTERN = /^\s*●\s+(.+?)\s+—\s+/;
const FINDING_PATH_PATTERN = /^(packages[\\/].+?\.(?:tsx|ts|css)):(\d+)$/;
const LINE_SPLIT_PATTERN = /\r?\n/;

export const UI_CRAFT_FALSE_POSITIVE_BUDGET = {
  total: 55,
  byCategory: {
    "contract-literal": 8,
    "global-token-layer": 2,
    "primitive-constraint": 6,
    "recipe-composition": 39,
  },
  byMessage: {
    "custom modal without native <dialog> or [popover]": 1,
    "hover state without focus-visible": 16,
    "mixed length units in same block": 1,
    "outline removed without focus-visible replacement": 31,
    "table without overflow handling or sticky header": 1,
    "transition: all": 5,
  },
};

export const UI_CRAFT_FALSE_POSITIVE_EXCEPTIONS = [
  {
    category: "recipe-composition",
    evidence: "focusRecipe",
    message: "outline removed without focus-visible replacement",
    paths: [
      "packages/design-system/components/afenda-ui/accordion.tsx",
      "packages/design-system/components/afenda-ui/alert-dialog.tsx",
      "packages/design-system/components/afenda-ui/button.tsx",
      "packages/design-system/components/afenda-ui/checkbox.tsx",
      "packages/design-system/components/afenda-ui/collapsible.tsx",
      "packages/design-system/components/afenda-ui/dialog.tsx",
      "packages/design-system/components/afenda-ui/drawer.tsx",
      "packages/design-system/components/afenda-ui/focusable.tsx",
      "packages/design-system/components/afenda-ui/item.tsx",
      "packages/design-system/components/afenda-ui/menubar.tsx",
      "packages/design-system/components/afenda-ui/navigation-menu.tsx",
      "packages/design-system/components/afenda-ui/radio-group.tsx",
      "packages/design-system/components/afenda-ui/recipes.ts",
      "packages/design-system/components/afenda-ui/resizable.tsx",
      "packages/design-system/components/afenda-ui/scroll-area.tsx",
      "packages/design-system/components/afenda-ui/select.tsx",
      "packages/design-system/components/afenda-ui/sheet.tsx",
      "packages/design-system/components/afenda-ui/sidebar.tsx",
      "packages/design-system/components/afenda-ui/slider.tsx",
      "packages/design-system/components/afenda-ui/switch.tsx",
      "packages/design-system/components/afenda-ui/tabs.tsx",
      "packages/design-system/components/afenda-ui/toggle.tsx",
    ],
    counts: {
      "packages/design-system/components/afenda-ui/navigation-menu.tsx": 2,
      "packages/design-system/components/afenda-ui/recipes.ts": 2,
      "packages/design-system/components/afenda-ui/sidebar.tsx": 4,
      "packages/design-system/components/afenda-ui/tabs.tsx": 2,
    },
    reason:
      "The detector does not trace Afenda focus-ring recipe composition through class factories.",
  },
  {
    category: "recipe-composition",
    evidence: "focusRecipe",
    message: "hover state without focus-visible",
    paths: [
      "packages/design-system/components/afenda-ui/accordion.tsx",
      "packages/design-system/components/afenda-ui/breadcrumb.tsx",
      "packages/design-system/components/afenda-ui/button.tsx",
      "packages/design-system/components/afenda-ui/item.tsx",
      "packages/design-system/components/afenda-ui/menubar.tsx",
      "packages/design-system/components/afenda-ui/navigation-menu.tsx",
      "packages/design-system/components/afenda-ui/radio-group.tsx",
      "packages/design-system/components/afenda-ui/resizable.tsx",
      "packages/design-system/components/afenda-ui/slider.tsx",
      "packages/design-system/components/afenda-ui/tabs.tsx",
      "packages/design-system/components/afenda-ui/toggle.tsx",
    ],
    reason:
      "Hover styling is paired with focus-ring recipe composition that the detector cannot follow.",
  },
  {
    category: "primitive-constraint",
    evidence: "nonFocusablePrimitiveHover",
    message: "hover state without focus-visible",
    paths: [
      "packages/design-system/components/afenda-ui/field.tsx",
      "packages/design-system/components/afenda-ui/scroll-area.tsx",
      "packages/design-system/components/afenda-ui/sonner.tsx",
      "packages/design-system/components/afenda-ui/table.tsx",
    ],
    reason:
      "The hover target is primitive-owned or descendant-only, not a standalone keyboard focus target.",
  },
  {
    category: "primitive-constraint",
    evidence: "radixNavigationMenuViewport",
    message: "custom modal without native <dialog> or [popover]",
    paths: ["packages/design-system/components/afenda-ui/navigation-menu.tsx"],
    reason:
      "Radix NavigationMenu viewport is primitive-owned overlay behavior, not an Afenda custom modal.",
  },
  {
    category: "primitive-constraint",
    evidence: "tableOverflowAndStickyHeader",
    message: "table without overflow handling or sticky header",
    paths: ["packages/design-system/components/afenda-ui/table.tsx"],
    reason:
      "The table wrapper owns horizontal overflow and header cells expose sticky top positioning.",
  },
  {
    category: "contract-literal",
    evidence: "contractForbiddenPatternLiteral",
    message: "transition: all",
    paths: [
      "packages/design-system/contracts/afenda-class-name-policy.contract.ts",
      "packages/design-system/contracts/afenda-motion.contract.ts",
      "packages/design-system/contracts/afenda-recipe.contract.ts",
      "packages/design-system/test/afenda-design-system-contract.test.ts",
    ],
    counts: {
      "packages/design-system/contracts/afenda-motion.contract.ts": 2,
    },
    reason:
      "The source intentionally contains the forbidden pattern as contract/test data.",
  },
  {
    category: "contract-literal",
    evidence: "contractForbiddenPatternLiteral",
    message: "outline removed without focus-visible replacement",
    paths: [
      "packages/design-system/contracts/afenda-accessibility.contract.ts",
      "packages/design-system/test/afenda-design-system-contract.test.ts",
    ],
    counts: {
      "packages/design-system/contracts/afenda-accessibility.contract.ts": 2,
    },
    reason:
      "The source intentionally contains the forbidden pattern as contract/test data.",
  },
  {
    category: "global-token-layer",
    evidence: "globalTokenLayer",
    message: "hover state without focus-visible",
    paths: ["packages/design-system/styles/globals.css"],
    reason:
      "The detector matches the semantic surface-hover token declaration, not an interactive hover selector.",
  },
  {
    category: "global-token-layer",
    evidence: "globalTokenLayer",
    message: "mixed length units in same block",
    paths: ["packages/design-system/styles/globals.css"],
    reason:
      "The root token layer is allowed to define px and rem values as canonical token values.",
  },
];

export function parseUiCraftFindings(rawOutput, root = process.cwd()) {
  const lines = stripUiCraftAnsi(rawOutput).split(LINE_SPLIT_PATTERN);
  const findings = [];
  let current;

  for (const line of lines) {
    const pathMatch = line.match(FINDING_PATH_PATTERN);

    if (pathMatch) {
      current = {
        file: join(root, pathMatch[1]),
        line: Number(pathMatch[2]),
        message: "",
      };
      continue;
    }

    const messageMatch = line.match(FINDING_MESSAGE_PATTERN);
    if (messageMatch && current) {
      current.message = messageMatch[1].trim();
      findings.push(current);
      current = undefined;
    }
  }

  return findings;
}

export function evaluateUiCraftFindings({
  budget = UI_CRAFT_FALSE_POSITIVE_BUDGET,
  exceptions = UI_CRAFT_FALSE_POSITIVE_EXCEPTIONS,
  fileExists = existsSync,
  findings,
  readSource = readFile,
  root = process.cwd(),
}) {
  const expandedExceptions = expandUiCraftExceptions(exceptions);
  const validationViolations = validateUiCraftExceptions({
    exceptions: expandedExceptions,
    fileExists,
    root,
  });
  const actionable = [];
  const ignored = [];
  const violations = [...validationViolations];

  for (const finding of findings) {
    const relativePath = normalizePath(relative(root, finding.file));
    const exception = expandedExceptions.find(
      (candidate) =>
        candidate.message === finding.message && candidate.path === relativePath
    );

    if (!exception) {
      actionable.push(finding);
      continue;
    }

    const source = readSource(finding.file);
    const evidence = evidencePredicates[exception.evidence];
    if (!evidence?.({ finding, relativePath, source })) {
      violations.push(
        createViolation(
          "missing-evidence",
          `${exception.path} ${exception.message} no longer satisfies ${exception.evidence}.`
        )
      );
      actionable.push(finding);
      continue;
    }

    ignored.push({ ...finding, exception });
  }

  violations.push(
    ...findStaleUiCraftExceptions({
      exceptions: expandedExceptions,
      findings,
      root,
    }),
    ...findUiCraftBudgetViolations({ budget, ignored })
  );

  return {
    actionable,
    ignored,
    violations,
  };
}

export function summarizeUiCraftFindings(findings) {
  return summarizeBy(findings, (finding) => finding.message);
}

export function stripUiCraftAnsi(value) {
  return value.replace(ANSI_PATTERN, "");
}

export function expandUiCraftExceptions(exceptions) {
  return exceptions.flatMap((exception) =>
    (exception.paths ?? [exception.path]).map((path) => {
      const normalizedPath = normalizePath(path);
      return {
        category: exception.category,
        evidence: exception.evidence,
        expectedCount: exception.counts?.[normalizedPath] ?? 1,
        message: exception.message,
        path: normalizedPath,
        reason: exception.reason,
      };
    })
  );
}

function validateUiCraftExceptions({ exceptions, fileExists, root }) {
  const violations = [];

  for (const exception of exceptions) {
    if (!isValidUiCraftException(exception)) {
      violations.push(
        createViolation(
          "invalid-exception",
          `${exception.path ?? "<unknown>"} must include message, path, category, evidence, reason, and a positive expected count.`
        )
      );
      continue;
    }

    if (!evidencePredicates[exception.evidence]) {
      violations.push(
        createViolation(
          "unknown-evidence",
          `${exception.path} uses unknown evidence predicate ${exception.evidence}.`
        )
      );
    }

    if (!fileExists(join(root, exception.path))) {
      violations.push(
        createViolation(
          "missing-exception-file",
          `${exception.path} is registered as a UI-craft exception but the file does not exist.`
        )
      );
    }
  }

  return violations;
}

function isValidUiCraftException(exception) {
  return Boolean(
    exception.category &&
      exception.evidence &&
      Number.isInteger(exception.expectedCount) &&
      exception.expectedCount >= 1 &&
      exception.message &&
      exception.path &&
      exception.reason
  );
}

function findStaleUiCraftExceptions({ exceptions, findings, root }) {
  const findingCounts = countBy(
    findings,
    (finding) =>
      `${normalizePath(relative(root, finding.file))}\0${finding.message}`
  );
  const stale = [];

  for (const exception of exceptions) {
    const key = `${exception.path}\0${exception.message}`;
    const actualCount = findingCounts.get(key) ?? 0;
    if (actualCount === 0) {
      stale.push(
        createViolation(
          "stale-exception",
          `${exception.path} ${exception.message} is registered but no detector finding currently matches it.`
        )
      );
      continue;
    }

    if (actualCount !== exception.expectedCount) {
      stale.push(
        createViolation(
          "exception-count-drift",
          `${exception.path} ${exception.message} matched ${actualCount} findings; registry expects ${exception.expectedCount}.`
        )
      );
    }
  }

  return stale;
}

function findUiCraftBudgetViolations({ budget, ignored }) {
  const violations = [];

  if (ignored.length > budget.total) {
    violations.push(
      createViolation(
        "false-positive-budget-exceeded",
        `Ignored ${ignored.length} findings; budget allows ${budget.total}.`
      )
    );
  }

  for (const violation of compareCounts({
    actual: countBy(ignored, (finding) => finding.message),
    allowed: budget.byMessage,
    kind: "message",
  })) {
    violations.push(violation);
  }

  for (const violation of compareCounts({
    actual: countBy(ignored, (finding) => finding.exception.category),
    allowed: budget.byCategory,
    kind: "category",
  })) {
    violations.push(violation);
  }

  return violations;
}

function compareCounts({ actual, allowed, kind }) {
  const violations = [];

  for (const [name, count] of actual.entries()) {
    const limit = allowed[name] ?? 0;
    if (count > limit) {
      violations.push(
        createViolation(
          "false-positive-budget-exceeded",
          `Ignored ${count} ${kind} findings for ${name}; budget allows ${limit}.`
        )
      );
    }
  }

  return violations;
}

const evidencePredicates = {
  contractForbiddenPatternLiteral({ source }) {
    return (
      source.includes("transition-all") ||
      source.includes("outline-none") ||
      source.includes("focus:outline-none")
    );
  },
  focusRecipe({ source }) {
    return (
      source.includes('recipe("focusRing') ||
      source.includes('"focusRing"') ||
      source.includes('"focusRingOnly"') ||
      source.includes("focus-visible:")
    );
  },
  globalTokenLayer({ relativePath, source }) {
    return (
      relativePath === "packages/design-system/styles/globals.css" &&
      source.includes("--xforge-") &&
      source.includes("@theme inline")
    );
  },
  nonFocusablePrimitiveHover({ source }) {
    return (
      (source.includes("hover:") || source.includes(":hover")) &&
      source.includes("data-slot")
    );
  },
  radixNavigationMenuViewport({ source }) {
    return (
      source.includes("NavigationMenuPrimitive.Viewport") &&
      source.includes('data-slot="navigation-menu-viewport"')
    );
  },
  tableOverflowAndStickyHeader({ source }) {
    return (
      source.includes("overflow-x-auto") && source.includes("sticky top-0")
    );
  },
};

function countBy(items, getKey) {
  const counts = new Map();

  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function summarizeBy(items, getKey) {
  return [...countBy(items, getKey).entries()]
    .map(([message, count]) => `${count} ${message}`)
    .join("; ");
}

function createViolation(rule, message) {
  return {
    message,
    rule,
    severity: "error",
  };
}

function readFile(file) {
  if (!existsSync(file)) {
    return "";
  }

  return readFileSync(file, "utf8");
}

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}
