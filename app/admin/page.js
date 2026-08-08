import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import { getSupabaseAdminClient } from "../../lib/supabase/admin";
import { ADMIN_EMAIL } from "../../lib/admin";
import HourlyChart from "../../components/HourlyChart";
import AdminScriptForm from "../../components/AdminScriptForm";

export const metadata = {
  title: "Admin — CHARMANDER SCRIPTS",
  robots: "noindex, nofollow",
};

// agrupa por hora no fuso de Brasília (UTC-3, sem horário de verão) pra o
// "horário de pico" bater com a hora real de quem tá vendo o painel
function bucketByHourBR(rows) {
  const buckets = new Array(24).fill(0);
  for (const row of rows || []) {
    const hourUTC = new Date(row.created_at).getUTCHours();
    const hourBR = (hourUTC + 24 - 3) % 24;
    buckets[hourBR]++;
  }
  return buckets;
}

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    notFound();
  }

  const admin = getSupabaseAdminClient();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: scripts },
    { data: siteStats },
    { data: usersResult },
    { count: purchaseCount },
    { data: visitsTodayRows, count: visitsToday },
    { data: visitsWeekRows, count: visitsWeek },
    { data: scriptViewsTodayRows, count: scriptViewsToday },
    { data: scriptViewsWeekRows, count: scriptViewsWeek },
  ] = await Promise.all([
    admin.from("scripts").select("*").order("views", { ascending: false }),
    admin.from("site_stats").select("total_visits").eq("id", 1).maybeSingle(),
    admin.auth.admin.listUsers({ perPage: 200 }),
    admin.from("purchases").select("*", { count: "exact", head: true }),
    admin.from("visit_log").select("created_at", { count: "exact" }).gte("created_at", startOfToday),
    admin.from("visit_log").select("created_at", { count: "exact" }).gte("created_at", startOfWeek),
    admin.from("script_view_log").select("created_at", { count: "exact" }).gte("created_at", startOfToday),
    admin.from("script_view_log").select("created_at", { count: "exact" }).gte("created_at", startOfWeek),
  ]);

  const visitsTodayHourly = bucketByHourBR(visitsTodayRows);
  const visitsWeekHourly = bucketByHourBR(visitsWeekRows);
  const scriptViewsTodayHourly = bucketByHourBR(scriptViewsTodayRows);
  const scriptViewsWeekHourly = bucketByHourBR(scriptViewsWeekRows);

  const totalVisits = siteStats?.total_visits ?? 0;
  const users = usersResult?.users ?? [];
  const totalUsers = users.length;
  const totalPurchases = purchaseCount ?? 0;
  const paidPrice = 4.99;
  const estimatedRevenue = (totalPurchases * paidPrice).toFixed(2).replace(".", ",");

  const scriptList = scripts ?? [];
  const totalScriptViews = scriptList.reduce((sum, s) => sum + (s.views || 0), 0);
  const totalLikes = scriptList.reduce((sum, s) => sum + (s.likes || 0), 0);
  const mostLiked = [...scriptList].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
  const conversionRate =
    totalUsers > 0 ? ((totalPurchases / totalUsers) * 100).toFixed(1).replace(".", ",") : "0,0";

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  return (
    <>
      <header className="site-header">
        <a className="logo" href="/">
          <span className="logo-badge">
            <img className="logo-mark" src="/charmander-logo.png" alt="" width="64" height="64" />
          </span>
          <span className="logo-text">CHARMANDER<span className="logo-suffix"> SCRIPTS</span></span>
        </a>
        <a className="btn btn-ghost" href="/">
          <span className="back-full">&larr; Voltar ao site</span>
          <span className="back-short">&larr; Voltar</span>
        </a>
      </header>

      <main>
      <div className="wrap admin-wrap">
        <p className="eyebrow">Admin</p>
        <h1 className="detail-title">Painel</h1>

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
          <h2>Adicionar script</h2>
          <AdminScriptForm />
        </section>

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
      </main>
    </>
  );
}
