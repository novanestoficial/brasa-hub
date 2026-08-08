"use client";

import { useState } from "react";
import ScriptBadges from "./ScriptBadges";

const FILTERS = [
  { filter: "todos", label: "Todos", featured: false },
  { filter: "desastre", label: "Desastre", featured: false },
  { filter: "universal", label: "Universal", featured: false },
  { filter: "blox-fruits", label: "Blox Fruits", featured: false },
  { filter: "gravar", label: "🎥 Scripts que uso pra gravar", featured: true },
];

function LockBadge() {
  return (
    <span className="card-lock" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      </svg>
      Entrar
    </span>
  );
}

export default function CatalogGrid({ scripts, locked = false }) {
  const [activeFilter, setActiveFilter] = useState("todos");

  const visible = scripts.filter(
    (script) => activeFilter === "todos" || script.categories.includes(activeFilter)
  );

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrar por categoria">
        {FILTERS.map(({ filter, label, featured }) => (
          <button
            key={filter}
            className={featured ? "filter-pill filter-pill-featured" : "filter-pill"}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid" id="grid">
        {visible.map((script) => (
          <article className="card card-simple" key={script.slug}>
            <a className="card-link" href={`/scripts/${script.slug}`}>
              <div className="card-cover-wrap">
                <img
                  className="card-cover"
                  src={script.coverUrl}
                  alt={script.name}
                  loading="lazy"
                  decoding="async"
                  width="480"
                  height="240"
                />
                {locked && <LockBadge />}
                <span className="stats-overlay stat-views">👁 {script.views}</span>
                <span className="stats-overlay stat-likes">❤️ {script.likes}</span>
              </div>
              <div className="card-name-row">
                <span className="card-name">{script.name}</span>
                <ScriptBadges script={script} />
              </div>
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
