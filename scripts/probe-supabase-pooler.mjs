import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "packages", "database", "package.json")
);
const pg = require("pg");

const ref = process.env.SUPABASE_PROJECT_ID ?? "icfqhigdbkzpfimxvdnl";
const password = process.env.SUPABASE_DB_PASSWORD ?? "Weepohlai88!";

const regions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "eu-central-2",
  "eu-north-1",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "sa-east-1",
  "af-south-1",
  "me-south-1",
  "ap-east-1",
];

for (const region of regions) {
  for (const prefix of ["aws-0", "aws-1"]) {
    const host = `${prefix}-${region}.pooler.supabase.com`;
    for (const port of [5432, 6543]) {
      const suffix = port === 6543 ? "?pgbouncer=true" : "";
      const url = `postgresql://postgres.${ref}:${encodeURIComponent(password)}@${host}:${port}/postgres${suffix}`;
      const pool = new pg.Pool({
        connectionString: url,
        max: 1,
        connectionTimeoutMillis: 5000,
      });

      try {
        const client = await pool.connect();
        await client.query("select 1 as ok");
        client.release();
        await pool.end();
        console.log(JSON.stringify({ host, port, region, prefix }, null, 2));
        process.exit(0);
      } catch {
        await pool.end().catch(() => {});
      }
    }
  }
}

console.error("No working Supavisor pooler found.");
process.exit(1);
