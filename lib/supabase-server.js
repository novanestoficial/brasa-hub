import { createClient } from "@supabase/supabase-js";

const COVERS_BUCKET = "script-covers";

export function getSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );
}

export function getCoverUrl(supabase, coverPath) {
  return supabase.storage.from(COVERS_BUCKET).getPublicUrl(coverPath).data.publicUrl;
}
