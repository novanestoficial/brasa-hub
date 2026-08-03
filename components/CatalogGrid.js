"use client";

import { useState } from "react";

const FILTERS = [
  { filter: "todos", label: "Todos", featured: false },
  { filter: "desastre", label: "Desastre", featured: false },
  { filter: "gravar", label: "🎥 Scripts que uso pra gravar", featured: true },
];

export default function CatalogGrid({ scripts }) {
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
              </div>
              <div className="card-name-row">
                <span className="card-name">{script.name}</span>
                {script.is_paid && (
                  <span className="badge-group">
                    <span className="pill pill-premium"><span className="pill-star">★</span> Premium</span>
                    <span className="pill pill-no-key">Sem key</span>
                  </span>
                )}
              </div>
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
