"use client";

import { useState } from "react";
import HourlyChart from "./HourlyChart";
import AdminScriptForm from "./AdminScriptForm";
import AdminScriptList from "./AdminScriptList";

const TABS = [
  {
    id: "stats",
    label: "Estatísticas",
    shortLabel: "Estatísticas",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20V10M12 20V4M20 20v-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "users",
    label: "Usuários cadastrados",
    shortLabel: "Usuários",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 19c.6-3.2 3-5 5.5-5s4.9 1.8 5.5 5M15.5 5.5a3.2 3.2 0 0 1 0 6.2M20.5 19c-.4-2.4-1.7-4-3.6-4.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "add",
    label: "Adicionar script",
    shortLabel: "Adicionar",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "manage",
    label: "Gerenciar scripts",
    shortLabel: "Gerenciar",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AdminDashboard({
  totalVisits,
  totalUsers,
  totalPurchases,
  estimatedRevenue,
  totalScriptViews,
  totalLikes,
  conversionRate,
  mostLiked,
  visitsToday,
  visitsWeek,
  scriptViewsToday,
  scriptViewsWeek,
  visitsTodayHourly,
  visitsWeekHourly,
  scriptViewsTodayHourly,
  scriptViewsWeekHourly,
  scriptList,
  recentUsers,
  existingCategories,
}) {
  const [active, setActive] = useState("stats");

  function renderNavItems(variant) {
    return TABS.map((tab) => (
      <button
        key={tab.id}
        type="button"
        className={`admin-sidebar-item${active === tab.id ? " is-active" : ""}`}
        onClick={() => setActive(tab.id)}
        aria-current={active === tab.id ? "page" : undefined}
      >
        <span className="admin-sidebar-icon">{tab.icon}</span>
        {variant === "header" ? tab.shortLabel : tab.label}
      </button>
    ));
  }

  return (
    <>
      <header className="site-header">
        <a className="logo" href="/">
          <span className="logo-badge">
            <img className="logo-mark" src="/charmander-logo.png" alt="" width="64" height="64" />
          </span>
          <span className="logo-text">CHARMANDER<span className="logo-suffix"> SCRIPTS</span></span>
        </a>

        <nav className="admin-header-nav" aria-label="Seções do admin">
          {renderNavItems("header")}
        </nav>

        <a className="btn btn-ghost" href="/">
          <span className="back-full">&larr; Voltar ao site</span>
          <span className="back-short">&larr; Voltar</span>
        </a>
      </header>

      <main>
      <div className="wrap admin-wrap">
        <p className="eyebrow">Admin</p>
        <h1 className="detail-title">Painel</h1>

      <div className="admin-shell">
      <nav className="admin-mobile-nav" aria-label="Seções do admin (mobile)">
        {renderNavItems("mobile")}
      </nav>

      <div className="admin-content">
        {active === "stats" && (
          <div className="admin-tab-panel">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="admin-stat-label">Visitas totais</span>
                <span className="admin-stat-value">{totalVisits}</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Usuários cadastrados</span>
                <span className="admin-stat-value">{totalUsers}</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Compras</span>
                <span className="admin-stat-value">{totalPurchases}</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Receita estimada</span>
                <span className="admin-stat-value">R$ {estimatedRevenue}</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Views nos scripts (total)</span>
                <span className="admin-stat-value">{totalScriptViews}</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Likes totais</span>
                <span className="admin-stat-value">{totalLikes}</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-label">Taxa de conversão</span>
                <span className="admin-stat-value">{conversionRate}%</span>
              </div>
              {mostLiked && (
                <div className="admin-stat-card">
                  <span className="admin-stat-label">Mais curtido</span>
                  <span className="admin-stat-value admin-stat-value-sm">{mostLiked.name}</span>
                </div>
              )}
            </div>

            <div className="admin-today-panel">
              <p className="admin-today-heading">Hoje &amp; essa semana</p>
              <div className="admin-today-grid">
                <div className="admin-today-card">
                  <span className="admin-today-period">Hoje</span>
                  <span className="admin-today-value">{visitsToday ?? 0}</span>
                  <span className="admin-today-label">Visitas</span>
                  <HourlyChart buckets={visitsTodayHourly} unitLabel="visitas" />
                </div>
                <div className="admin-today-card">
                  <span className="admin-today-period">Semana</span>
                  <span className="admin-today-value">{visitsWeek ?? 0}</span>
                  <span className="admin-today-label">Visitas</span>
                  <HourlyChart buckets={visitsWeekHourly} unitLabel="visitas" />
                </div>
                <div className="admin-today-card">
                  <span className="admin-today-period">Hoje</span>
                  <span className="admin-today-value">{scriptViewsToday ?? 0}</span>
                  <span className="admin-today-label">Cliques em scripts</span>
                  <HourlyChart buckets={scriptViewsTodayHourly} unitLabel="cliques" />
                </div>
                <div className="admin-today-card">
                  <span className="admin-today-period">Semana</span>
                  <span className="admin-today-value">{scriptViewsWeek ?? 0}</span>
                  <span className="admin-today-label">Cliques em scripts</span>
                  <HourlyChart buckets={scriptViewsWeekHourly} unitLabel="cliques" />
                </div>
              </div>
            </div>

            <section className="admin-section">
              <h2>Scripts mais vistos</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Script</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scriptList.map((s) => (
                      <tr key={s.slug}>
                        <td>{s.name}</td>
                        <td>{s.views}</td>
                        <td>{s.likes}</td>
                        <td>{s.is_paid ? "Sim" : "Não"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {active === "users" && (
          <div className="admin-tab-panel">
            <section className="admin-section">
              <h2>Usuários cadastrados ({totalUsers})</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>E-mail</th>
                      <th>Cadastro</th>
                      <th>Provedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                        <td>{u.app_metadata?.provider || "email"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalUsers > recentUsers.length && (
                <p className="admin-note">Mostrando os 10 cadastros mais recentes de {totalUsers}.</p>
              )}
            </section>
          </div>
        )}

        {active === "add" && (
          <div className="admin-tab-panel">
            <section className="admin-section">
              <h2>Adicionar script</h2>
              <AdminScriptForm existingCategories={existingCategories} />
            </section>
          </div>
        )}

        {active === "manage" && (
          <div className="admin-tab-panel">
            <section className="admin-section admin-section-compact">
              <h2>Gerenciar scripts</h2>
              <AdminScriptList
                scripts={[...scriptList]
                  .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                  .map((s) => ({ slug: s.slug, name: s.name }))}
              />
            </section>
          </div>
        )}
      </div>
      </div>
      </div>
      </main>
    </>
  );
}
