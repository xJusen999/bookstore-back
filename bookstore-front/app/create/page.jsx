"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateAuthorPage(){
  const router = useRouter();
  const [form, setForm] = useState({ name:"", description:"", birthDate:"", image:"" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const onChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}));

  async function onSubmit(e){
    e.preventDefault();
    try{
      setSaving(true); setError(null);
      const res = await fetch("/api/authors", {
        method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form)
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push("/authors");
    }catch(err){ setError(err.message||String(err)); }finally{ setSaving(false); }
  }

  return (
    <section className="grid">
      <div>
        <div className="kicker">Administración</div>
        <h1 className="h1">Crear autor</h1>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <div>
          <div className="label">Nombre</div>
          <input className="input" name="name" value={form.name} onChange={onChange} required />
        </div>

        <div className="row">
          <div>
            <div className="label">Fecha de nacimiento</div>
            <input className="input" type="date" name="birthDate" value={form.birthDate} onChange={onChange} required />
          </div>
          <div>
            <div className="label">URL de imagen</div>
            <input className="input" name="image" value={form.image} onChange={onChange} placeholder="https://…" />
          </div>
        </div>

        <div>
          <div className="label">Descripción</div>
          <textarea className="textarea" rows={4} name="description" value={form.description} onChange={onChange} />
        </div>

        {form.image && (
          <div className="card">
            <div className="thumb">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={form.image} alt="preview" /></div>
            <div className="card-body"><div className="meta">Vista previa</div></div>
          </div>
        )}

        {error && <div className="alert"><b>Error:</b> {error}</div>}

        <div className="row-end">
          <a className="btn" href="/authors">Cancelar</a>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </form>
    </section>
  );
}
