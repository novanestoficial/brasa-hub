"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createScript } from "../app/admin/actions";
import ImageDropzone from "./ImageDropzone";
import ScriptBadges from "./ScriptBadges";

const initialState = {};

export default function AdminScriptForm() {
  const [state, formAction, pending] = useActionState(createScript, initialState);
  const formRef = useRef(null);

  const [name, setName] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setName("");
      setIsPaid(false);
      setHasKey(false);
      setCoverPreviewUrl(null);
    }
  }, [state]);

  const previewScript = { is_paid: isPaid, has_key: hasKey };

  return (
    <div className="admin-script-editor">
      <form className="auth-form admin-script-form" action={formAction} ref={formRef}>
        <label className="auth-label">
          Título
          <input
            className="auth-input"
            type="text"
            name="name"
            required
            maxLength={160}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="auth-label">
          Descrição
          <textarea className="auth-input admin-form-textarea" name="description" required rows={3} />
        </label>

        <div className="auth-label">
          Imagem de capa
          <ImageDropzone name="cover" onFileChange={(file, url) => setCoverPreviewUrl(url)} />
        </div>

        <label className="auth-label">
          Loadstring
          <textarea
            className="auth-input admin-form-textarea admin-form-mono"
            name="copy_command"
            required
            rows={2}
            placeholder='loadstring(game:HttpGet("..."))()'
          />
        </label>

        <div className="admin-form-toggles">
          <label className="admin-toggle-chip">
            <input
              type="checkbox"
              name="is_paid"
              className="admin-toggle-input"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            <span className="admin-toggle-box" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="admin-toggle-label">Script pago</span>
          </label>

          <label className="admin-toggle-chip">
            <input
              type="checkbox"
              name="has_key"
              className="admin-toggle-input"
              checked={hasKey}
              onChange={(e) => setHasKey(e.target.checked)}
            />
            <span className="admin-toggle-box" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="admin-toggle-label">Precisa de key</span>
          </label>
        </div>

        {state?.error && <p className="auth-error">{state.error}</p>}
        {state?.success && <p className="auth-success">"{state.name}" adicionado com sucesso.</p>}

        <button className="btn btn-primary auth-submit" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Adicionar script"}
        </button>
      </form>

      <div className="admin-script-preview">
        <p className="admin-script-preview-label">Preview do card</p>
        <article className="card card-simple">
          <div className="card-cover-wrap">
            {coverPreviewUrl ? (
              <img className="card-cover" src={coverPreviewUrl} alt="" />
            ) : (
              <div className="card-cover card-cover-placeholder" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="8.5" cy="9.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M5 15l4.5-4 3.5 3 2.5-2.5L20 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            <span className="stats-overlay stat-views">👁 0</span>
            <span className="stats-overlay stat-likes">❤️ 0</span>
          </div>
          <div className="card-name-row">
            <span className="card-name">{name || "Nome do script"}</span>
            <ScriptBadges script={previewScript} />
          </div>
        </article>
      </div>
    </div>
  );
}
