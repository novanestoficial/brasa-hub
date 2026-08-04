import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

export async function POST() {
  const supabase = await getSupabaseServerClient();
  await supabase.rpc("log_site_visit");
  return NextResponse.json({ ok: true });
}
