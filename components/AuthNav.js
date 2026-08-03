"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function AuthNav({ user }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <div className="auth-nav">
        <a href="/login">Entrar</a>
      </div>
    );
  }

  return (
    <div className="auth-nav">
      <span className="auth-email">{user.email}</span>
      <button type="button" className="auth-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
