import { rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const viteCacheDir = join(appDir, "node_modules", ".cache", "storybook");

rmSync(viteCacheDir, { recursive: true, force: true });

console.log("Cleaned Storybook Vite cache:", viteCacheDir);
