import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const configDir = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.resolve(configDir, "../../../.env") });
config({
  path: path.resolve(configDir, "../../../.env.local"),
  override: true,
});
config({
  path: path.resolve(configDir, "../../database/.env"),
  override: true,
});

type GlobalPool = typeof globalThis & {
  pool?: { end: () => Promise<void> };
};

const globalWithPool = globalThis as GlobalPool;

if (globalWithPool.pool) {
  await globalWithPool.pool.end();
  globalWithPool.pool = undefined;
}
