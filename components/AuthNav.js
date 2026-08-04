"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function AuthNav({ user, isAdmin }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <div className="auth-nav">
        <a href="/login" className="auth-login" aria-label="Entrar">
          <svg className="auth-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4.5 20c1.4-4 4.2-6 7.5-6s6.1 2 7.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="auth-nav-text">Entrar</span>
        </a>
      </div>
    );
  }

  return (
    <div className="auth-nav">
      <span className="auth-email">{user.email}</span>
      {isAdmin && (
        <a href="/admin" className="auth-admin" aria-label="Painel admin">
          <svg className="auth-icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span className="auth-nav-text">Admin</span>
        </a>
      )}
      <button type="button" className="auth-logout" onClick={handleLogout} aria-label="Sair">
        <svg className="auth-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13 8l4 4-4 4M8 12h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="auth-nav-text">Sair</span>
      </button>
    </div>
  );
}
