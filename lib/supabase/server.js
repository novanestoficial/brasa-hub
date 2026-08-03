import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const COVERS_BUCKET = "script-covers";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // called from a Server Component render — middleware refreshes the session instead
          }
        },
      },
    }
  );
}

export function getCoverUrl(supabase, coverPath) {
  return supabase.storage.from(COVERS_BUCKET).getPublicUrl(coverPath).data.publicUrl;
}
