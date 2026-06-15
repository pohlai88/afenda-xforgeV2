import { execSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const storybookUrl = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const NARROW_OPERATIONS_WIDTH = 740;
const COMPACT_DESKTOP_WIDTH = 1024;
const WIDE_DESKTOP_WIDTH = 1440;

const viewports = [
  { label: "740px", width: NARROW_OPERATIONS_WIDTH },
  { label: "1024px", width: COMPACT_DESKTOP_WIDTH },
  { label: "wide desktop", width: WIDE_DESKTOP_WIDTH },
];

for (const viewport of viewports) {
  console.log(`Checking block overflow at ${viewport.label}...`);

  execSync(
    [
      "test-storybook",
      "--ci",
      `--url ${storybookUrl}`,
      "--maxWorkers 1",
      "--testTimeout 60000",
      "--includeTags block",
      "--skipTags visual-audit",
    ].join(" "),
    {
      cwd: appDir,
      env: {
        ...process.env,
        STORYBOOK_OVERFLOW_CHECK: "1",
        STORYBOOK_OVERFLOW_LABEL: viewport.label,
        STORYBOOK_OVERFLOW_WIDTH: String(viewport.width),
      },
      stdio: "inherit",
    }
  );
}
