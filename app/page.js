import { getSupabaseServerClient, getCoverUrl } from "../lib/supabase/server";
import CatalogGrid from "../components/CatalogGrid";
import AuthNav from "../components/AuthNav";
import BundleCtaButton from "../components/BundleCtaButton";
import { ADMIN_EMAIL } from "../lib/admin";

const HERO_IMAGES = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  src: `/hero/hero-${n}.jpg`,
  positionClass: `t${n}`,
}));

export default async function HomePage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = user?.email === ADMIN_EMAIL;
  const { data } = await supabase
    .from("scripts")
    .select("*")
    .order("sort_order", { ascending: true });

  const scripts = (data || []).map((script) => ({
    ...script,
    coverUrl: getCoverUrl(supabase, script.cover_path),
  }));

  let hasBundleAccess = false;
  if (user) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    hasBundleAccess = !!purchase;
  }

  const bundleScripts = ["explhub", "dropkick"]
    .map((slug) => scripts.find((s) => s.slug === slug))
    .filter(Boolean);

  return (
    <>
      <header className="site-header">
        <a className="logo" href="#topo">
          <span className="logo-badge">
            <img className="logo-mark" src="/charmander-logo.png" alt="" width="64" height="64" />
          </span>
          <span className="logo-text">CHARMANDER<span className="logo-suffix"> SCRIPTS</span></span>
        </a>
        <nav className="main-nav">
          <div className="nav-links">
            <a href="/links" className="nav-link-links">
              <svg className="nav-link-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.5 14.5l5-5M10.5 8.5l.9-.9a3 3 0 1 1 4.2 4.2l-.9.9M13.5 15.5l-.9.9a3 3 0 1 1-4.2-4.2l.9-.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="nav-link-text">Links</span>
            </a>
          </div>
          <AuthNav user={user} isAdmin={isAdmin} />
          <div className="social-links">
            <a
              href="https://www.instagram.com/charmandersafado?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@charmanderscript?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                />
              </svg>
            </a>
            <a
              href="https://youtube.com/@charmandersafado?si=It3tJ905O0u-LRlj"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path fill="currentColor" d="M10 8.5L16 12L10 15.5V8.5Z" />
              </svg>
            </a>
          </div>
        </nav>
      </header>

      <main id="topo">
        <section className="hero">
          <div className="hero-thumbs" aria-hidden="true">
            {HERO_IMAGES.map((img) => (
              <img
                key={img.src}
                className={`hero-thumb ${img.positionClass}`}
                src={img.src}
                alt=""
              />
            ))}
          </div>
          <div className="hero-content">
            <p className="eyebrow">Hub de scripts &mdash; acesso direto</p>
            <h1>CHARMANDER SCRIPTS</h1>
            <p className="lede">Scripts que eu uso para gravar os vídeos</p>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#catalogo">Ver scripts</a>
            </div>
          </div>
        </section>

        {!hasBundleAccess && bundleScripts.length === 2 && (
          <div className="featured-cards">
            <div className="wrap bundle-panel">
              <p className="bundle-eyebrow">Pacote premium</p>
              <p className="bundle-price">R$ 4,99</p>
              <p className="bundle-price-note">os 2 scripts pagos, de uma vez</p>
              <div className="bundle-cards">
                {bundleScripts.map((s) => (
                  <article className="card card-simple" key={s.slug}>
                    <a className="card-link" href={`/scripts/${s.slug}`}>
                      <div className="card-cover-wrap">
                        <img
                          className="card-cover"
                          src={s.coverUrl}
                          alt={s.name}
                          loading="lazy"
                          decoding="async"
                          width="480"
                          height="240"
                        />
                      </div>
                      <div className="card-name-row">
                        <span className="card-name">{s.name}</span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
              <BundleCtaButton href="/api/checkout?next=/">Quero os 2 agora</BundleCtaButton>
            </div>
          </div>
        )}

        <section id="catalogo">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">scripts</p>
                <h2>Scripts prontos pra rodar</h2>
              </div>
            </div>

            <CatalogGrid scripts={scripts} locked={!user} />

            <p className="coming-soon">🔥 Mais scripts chegando em breve — fica de olho.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <span>&copy; 2026 CHARMANDER &mdash; hub de scripts.</span>
          <div className="footer-links">
            <a href="#">Documentação</a>
            <a href="#">Changelog</a>
            <a href="#">Status</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
}
