import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const storybookUrl = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";

rmSync(join(appDir, ".storybook", "a11y-reports"), {
  recursive: true,
  force: true,
});

execSync(
  [
    "test-storybook",
    "--ci",
    `--url ${storybookUrl}`,
    "--maxWorkers 1",
    "--testTimeout 60000",
    "--skipTags visual-audit",
  ].join(" "),
  {
    cwd: appDir,
    stdio: "inherit",
    env: process.env,
  }
);
