import { getSupabaseServerClient, getCoverUrl } from "../lib/supabase/server";
import CatalogGrid from "../components/CatalogGrid";
import SiteHeader from "../components/SiteHeader";
import BundleCtaButton from "../components/BundleCtaButton";

const HERO_IMAGES = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  src: `/hero/hero-${n}.jpg`,
  positionClass: `t${n}`,
}));

export default async function HomePage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
      <SiteHeader logoHref="#topo" />

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
