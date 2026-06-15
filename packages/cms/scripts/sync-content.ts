import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../.."
);

config({ path: path.resolve(root, ".env") });
config({ path: path.resolve(root, ".env.local"), override: true });
config({
  path: path.resolve(root, "packages/database/.env"),
  override: true,
});

const main = async (): Promise<void> => {
  const { backfillDocumentMirror } = await import("../sync/backfill");
  const result = await backfillDocumentMirror();

  console.log(
    `CMS mirror backfill complete: ${result.upserted} upserted, ${result.skipped} skipped`
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
