import { notFound } from "next/navigation";
import { getSupabaseServerClient, getCoverUrl } from "../../../lib/supabase/server";
import CopyButton from "../../../components/CopyButton";
import ScriptBadges from "../../../components/ScriptBadges";
import LikeButton from "../../../components/LikeButton";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: script } = await supabase
    .from("scripts")
    .select("name, meta_description")
    .eq("slug", slug)
    .single();

  if (!script) return {};

  return {
    title: `${script.name} — CHARMANDER SCRIPTS`,
    description: script.meta_description,
  };
}

export default async function ScriptDetailPage({ params }) {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: script } = await supabase
    .from("scripts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!script) notFound();

  await supabase.rpc("increment_views", { p_slug: slug });
  const views = script.views + 1;

  const coverUrl = getCoverUrl(supabase, script.cover_path);
  const categoryLabel = script.categories.includes("desastre") ? "Desastre" : script.categories[0];

  let hasAccess = !script.is_paid;
  if (script.is_paid) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      hasAccess = !!purchase;
    }
  }

  return (
    <>
      <header className="site-header">
        <a className="logo" href="/">
          CHARMANDER<span className="logo-suffix"> SCRIPTS</span>
        </a>
        <a className="btn btn-ghost" href="/#catalogo">
          <span className="back-full">&larr; Voltar ao catálogo</span>
          <span className="back-short">&larr; Voltar</span>
        </a>
      </header>

      <main>
        <div className="wrap detail-wrap">
          <p className="eyebrow">{categoryLabel} — {script.origin}</p>
          <div className="detail-title-row">
            <h1 className="detail-title">{script.name}</h1>
            <ScriptBadges script={script} />
          </div>

          <div className="detail-meta">
            <span className="pill pill-nova">Nova</span>
            <span className="detail-tag">{script.tag}</span>
          </div>

          <div className="detail-desc">
            <p>{script.description}</p>
          </div>

          <div className="detail-cover-wrap">
            <img
              className="detail-cover"
              src={coverUrl}
              alt={script.name}
              loading="lazy"
              decoding="async"
              width="480"
              height="270"
            />
            <span className="stats-overlay stat-views">👁 {views}</span>
            <LikeButton slug={slug} initialLikes={script.likes} />
          </div>

          {hasAccess ? (
            <>
              <div className="code-block">
                <code>{script.copy_command}</code>
              </div>
              <CopyButton command={script.copy_command} />
            </>
          ) : (
            <div className="paywall">
              <p className="paywall-price">R$ 4,99</p>
              <p>Esse script faz parte do pacote pago. Libera de uma vez o Explhub NDS e o Script da Voadora.</p>
              <a className="btn btn-primary auth-submit" href={`/api/checkout?next=/scripts/${slug}`}>
                Comprar acesso
              </a>
            </div>
          )}
        </div>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <span>&copy; 2026 CHARMANDER SCRIPTS.</span>
          <a className="detail-back" href="/#catalogo">&larr; Voltar ao catálogo</a>
        </div>
      </footer>
    </>
  );
}
