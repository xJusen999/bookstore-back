"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePrizePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    awardDate: "", // YYYY-MM-DD
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true); setErr(null);
      const res = await fetch("/api/prizes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert("Premio creado.");
      router.push("/admin/activity"); // o /prizes si la tienes
    } catch (e) { setErr(e.message||String(e)); } finally { setSaving(false); }
  }

  return (
    <section className="grid">
      <div><div className="kicker">Premios</div><h1 className="h1">Crear premio</h1></div>
      <form className="form" onSubmit={onSubmit}>
        <div><div className="label">Nombre</div>
          <input className="input" name="name" value={form.name} onChange={onChange} required/></div>
        <div className="row">
          <div><div className="label">Fecha del premio</div>
            <input className="input" type="date" name="awardDate" value={form.awardDate} onChange={onChange}/></div>
        </div>
        <div><div className="label">Descripción</div>
          <textarea className="textarea" name="description" rows={3} value={form.description} onChange={onChange}/></div>

        {err && <div className="alert"><b>Error:</b> {err}</div>}
        <div className="row-end">
          <a className="btn" href="/admin/activity">Cancelar</a>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </form>
    </section>
  );
}
