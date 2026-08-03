export default function ScriptBadges({ script }) {
  const hasKey = script.slug === "atherhub";

  if (script.is_paid) {
    return (
      <span className="badge-group">
        <span className="pill pill-premium"><span className="pill-star">★</span> Premium</span>
        <span className="pill pill-no-key">Sem key</span>
      </span>
    );
  }

  return (
    <span className="badge-group">
      <span className="pill pill-gratis"><span className="pill-star">★</span> Grátis</span>
      <span className={hasKey ? "pill pill-com-key" : "pill pill-no-key"}>
        {hasKey ? "Com key" : "Sem key"}
      </span>
    </span>
  );
}
