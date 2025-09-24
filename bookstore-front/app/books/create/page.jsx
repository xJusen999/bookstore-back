"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBookPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({
    title: "", description: "", publishDate: "", image: "", authorId: ""
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/authors", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setAuthors(await res.json());
      } catch (e) { setErr(e.message||String(e)); }
    })();
  }, []);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true); setErr(null);
      //create libro
      const rb = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          publishDate: form.publishDate,
          image: form.image,
        }),
      });
      if (!rb.ok) throw new Error(`HTTP ${rb.status}`);
      const book = await rb.json();

      // asocioar libro autor
      const link = await fetch(`/api/authors/${form.authorId}/books/${book.id}`, { method: "POST" });
      if (!link.ok) throw new Error(`No se pudo asociar Autor↔Libro (HTTP ${link.status})`);

      alert("Libro creado.");
      router.push("/admin/activity");
    } catch (e) { setErr(e.message||String(e)); } finally { setSaving(false); }
  }

  return (
    <section className="grid">
      <div><div className="kicker">Libros</div><h1 className="h1">Crear libro</h1></div>
      <form className="form" onSubmit={onSubmit}>
        <div><div className="label">Título</div>
          <input className="input" name="title" value={form.title} onChange={onChange} required/></div>

        <div className="row">
          <div><div className="label">Fecha de publicación</div>
            <input className="input" type="date" name="publishDate" value={form.publishDate} onChange={onChange}/></div>
          <div><div className="label">URL de imagen</div>
            <input className="input" name="image" value={form.image} onChange={onChange} placeholder="https://…"/></div>
        </div>

        <div><div className="label">Autor</div>
          <select className="input" name="authorId" value={form.authorId} onChange={onChange} required>
            <option value="">Selecciona autor…</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        <div><div className="label">Descripción</div>
          <textarea className="textarea" name="description" rows={4} value={form.description} onChange={onChange}/></div>

        {err && <div className="alert"><b>Error:</b> {err}</div>}
        <div className="row-end">
          <a className="btn" href="/admin/activity">Cancelar</a>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </form>
    </section>
  );
}
