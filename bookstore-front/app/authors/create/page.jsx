"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAuthorPage() {
  const router = useRouter();
  const [prizes, setPrizes] = useState([]);
  const [form, setForm] = useState({
    name: "", description: "", birthDate: "", image: "", prizeId: ""
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/prizes", { cache: "no-store" });
        if (res.ok) setPrizes(await res.json());
      } catch {}
    })();
  }, []);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true); setErr(null);
      // 1) Crear autor
      const ra = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          birthDate: form.birthDate,
          image: form.image,
        }),
      });
      if (!ra.ok) throw new Error(`HTTP ${ra.status}`);
      const author = await ra.json();

      if (form.prizeId) {
        const rp = await fetch(`/api/prizes/${form.prizeId}/author/${author.id}`, { method: "POST" });
        if (!rp.ok) throw new Error(`No se pudo asociar premio (HTTP ${rp.status})`);
      }

      alert("Autor creado.");
      router.push("/admin/activity");
    } catch (e) { setErr(e.message||String(e)); } finally { setSaving(false); }
  }

  return (
    <section className="grid">
      <div><div className="kicker">Autores</div><h1 className="h1">Crear autor</h1></div>
      <form className="form" onSubmit={onSubmit}>
        <div className="row">
          <div><div className="label">Nombre</div>
            <input className="input" name="name" value={form.name} onChange={onChange} required/></div>
          <div><div className="label">Nacimiento</div>
            <input className="input" type="date" name="birthDate" value={form.birthDate} onChange={onChange}/></div>
        </div>
        <div><div className="label">URL de imagen</div>
          <input className="input" name="image" value={form.image} onChange={onChange} placeholder="https://…"/></div>
        <div><div className="label">Descripción</div>
          <textarea className="textarea" name="description" rows={3} value={form.description} onChange={onChange}/></div>

        <div><div className="label">Asociar premio</div>
          <select className="input" name="prizeId" value={form.prizeId} onChange={onChange}>
            <option value="">— ninguno —</option>
            {prizes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {err && <div className="alert"><b>Error:</b> {err}</div>}
        <div className="row-end">
          <a className="btn" href="/admin/activity">Cancelar</a>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </form>
    </section>
  );
}
