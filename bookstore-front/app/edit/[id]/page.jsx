"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditAuthorPage(){
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const onChange = e => setForm(f => ({...f, [e.target.name]: e.target.value}));

  useEffect(()=>{(async()=>{
    try{
      setLoading(true);
      const res = await fetch(`/api/authors/${id}`, { cache:"no-store" });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      setForm(await res.json());
    }catch(e){ setError(e.message||String(e)); }finally{ setLoading(false); }
  })();},[id]);

  async function onSubmit(e){
    e.preventDefault();
    try{
      setSaving(true); setError(null);
      const res = await fetch(`/api/authors/${form.id}`, {
        method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form)
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push("/authors");
    }catch(e){ setError(e.message||String(e)); }finally{ setSaving(false); }
  }

  if(loading) return <div className="center">Cargando…</div>;
  if(error) return <div className="alert"><b>Error:</b> {error}</div>;
  if(!form) return <div className="empty">No se encontró el autor.</div>;

  return (
    <section className="grid">
      <div>
        <div className="kicker">Administración</div>
        <h1 className="h1">Editar autor</h1>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <div>
          <div className="label">Nombre</div>
          <input className="input" name="name" value={form.name??""} onChange={onChange} required />
        </div>

        <div className="row">
          <div>
            <div className="label">Fecha de nacimiento</div>
            <input className="input" type="date" name="birthDate" value={form.birthDate??""} onChange={onChange} required />
          </div>
          <div>
            <div className="label">URL de imagen</div>
            <input className="input" name="image" value={form.image??""} onChange={onChange} />
          </div>
        </div>

        <div>
          <div className="label">Descripción</div>
          <textarea className="textarea" rows={4} name="description" value={form.description??""} onChange={onChange} />
        </div>

        {form.image && (
          <div className="card">
            <div className="thumb">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={form.image} alt="preview" /></div>
            <div className="card-body"><div className="meta">Vista previa</div></div>
          </div>
        )}

        <div className="row-end">
          <a className="btn" href="/authors">Cancelar</a>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
        </div>
      </form>
    </section>
  );
}
