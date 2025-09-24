"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateReviewForBook() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ user: "", rating: 5, comment: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true); setErr(null);
      const res = await fetch(`/api/books/${id}/reviews`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert("Review creada.");
      router.push(`/books/${id}`);
    } catch (e) { setErr(e.message||String(e)); } finally { setSaving(false); }
  }

  return (
    <section className="grid">
      <div><div className="kicker">Reviews</div><h1 className="h1">Crear review</h1></div>

      <form className="form" onSubmit={onSubmit}>
        <div className="row">
          <div><div className="label">Usuario</div>
            <input className="input" name="user" value={form.user} onChange={onChange} placeholder="Tu nombre"/></div>
          <div><div className="label">Rating (1–5)</div>
            <input className="input" type="number" min={1} max={5} name="rating" value={form.rating} onChange={onChange}/></div>
        </div>
        <div><div className="label">Comentario</div>
          <textarea className="textarea" name="comment" rows={3} value={form.comment} onChange={onChange}/></div>

        {err && <div className="alert"><b>Error:</b> {err}</div>}
        <div className="row-end">
          <a className="btn" href={`/books/${id}`}>Cancelar</a>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Guardando…" : "Publicar review"}</button>
        </div>
      </form>
    </section>
  );
}
