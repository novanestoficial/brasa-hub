"use client";

import { useActionState, useEffect, useRef } from "react";
import { createScript } from "../app/admin/actions";

const initialState = {};

export default function AdminScriptForm() {
  const [state, formAction, pending] = useActionState(createScript, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form className="auth-form admin-script-form" action={formAction} ref={formRef}>
      <label className="auth-label">
        Título
        <input className="auth-input" type="text" name="name" required maxLength={160} />
      </label>

      <label className="auth-label">
        Descrição
        <textarea className="auth-input admin-form-textarea" name="description" required rows={3} />
      </label>

      <label className="auth-label">
        Imagem de capa
        <input className="auth-input" type="file" name="cover" accept="image/*" required />
      </label>

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
        <label className="admin-form-toggle">
          <input type="checkbox" name="is_paid" />
          Script pago
        </label>
        <label className="admin-form-toggle">
          <input type="checkbox" name="has_key" />
          Precisa de key
        </label>
      </div>

      {state?.error && <p className="auth-error">{state.error}</p>}
      {state?.success && <p className="auth-success">"{state.name}" adicionado com sucesso.</p>}

      <button className="btn btn-primary auth-submit" type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Adicionar script"}
      </button>
    </form>
  );
}
