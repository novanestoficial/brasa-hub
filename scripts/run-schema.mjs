import { Client } from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Falta DATABASE_URL no ambiente. Rode com: node --env-file=.env.local scripts/run-schema.mjs");
  process.exit(1);
}

const sql = readFileSync(path.join(ROOT, "supabase", "schema.sql"), "utf-8");

const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  await client.query(sql);
  console.log("Schema aplicado com sucesso.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => client.end());
