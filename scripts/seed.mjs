import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no ambiente.\n" +
      "Rode com: node --env-file=.env.local scripts/seed.mjs"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = "script-covers";

async function main() {
  const entries = JSON.parse(
    readFileSync(path.join(ROOT, "seed-data", "scripts.json"), "utf-8")
  );

  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
  });
  if (bucketError && !bucketError.message.includes("already exists")) {
    throw bucketError;
  }

  for (const entry of entries) {
    const coverFile = readFileSync(
      path.join(ROOT, "seed-data", "covers", entry.cover_filename)
    );

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(entry.cover_filename, coverFile, {
        contentType: entry.cover_mime,
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from("scripts").upsert(
      {
        slug: entry.slug,
        name: entry.name,
        tag: entry.tag,
        description: entry.description,
        copy_command: entry.copy_command,
        cover_path: entry.cover_filename,
        categories: entry.categories,
        is_paid: entry.is_paid,
        origin: entry.origin,
        sort_order: entry.sort_order,
        meta_description: entry.meta_description,
      },
      { onConflict: "slug" }
    );
    if (insertError) throw insertError;

    console.log(`Seeded ${entry.slug}`);
  }

  console.log(`\nDone — ${entries.length} scripts seeded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
