import { rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const targets = [
  "storybook-static",
  "coverage",
  join(".storybook", "a11y-reports"),
  join("node_modules", ".cache", "storybook"),
  join("node_modules", ".cache", "vite-plugin-react-docgen-typescript"),
  ".cache",
  ".turbo",
];

for (const target of targets) {
  rmSync(join(appDir, target), { recursive: true, force: true });
}

console.log("Cleaned Storybook artifacts:", targets.join(", "));
