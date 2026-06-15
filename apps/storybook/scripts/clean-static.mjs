import { rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");

rmSync(join(appDir, "storybook-static"), { recursive: true, force: true });
rmSync(join(appDir, "node_modules", ".cache", "storybook"), {
  recursive: true,
  force: true,
});
rmSync(join(appDir, "node_modules", ".cache", "vite"), {
  recursive: true,
  force: true,
});
