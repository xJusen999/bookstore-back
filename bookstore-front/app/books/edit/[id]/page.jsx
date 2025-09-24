"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!ready || !user) return;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const [rb, ra] = await Promise.all([
          fetch(`/api/books/${id}`, { cache: "no-store" }),
          fetch("/api/authors", { cache: "no-store" }),
        ]);
        if (!rb.ok) throw new Error(`HTTP ${rb.status}`);
        if (!ra.ok) throw new Error(`HTTP ${ra.status}`);
        const [book, authorsList] = await Promise.all([rb.json(), ra.json()]);
        setAuthors(Array.isArray(authorsList) ? authorsList : []);
    
        setForm({
          id: book.id,
          title: book.title || "",
          description: book.description || "",
          publishDate: book.publishDate || book.publicationDate || "",
          image: book.image || "",
          authorId: book.authorId ?? book.author?.id ?? "",
        });
      } catch (e) {
        setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, user, id]);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true); setErr(null);
      const res = await fetch(`/api/books/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push("/books");
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return null;
  if (!user) return null;
  if (loading) return <div className="center">Cargando…</div>;
  if (err) return <div className="alert"><b>Error:</b> {err}</div>;
  if (!form) return <div className="empty">No se encontró el libro.</div>;

  return (
    <section className="grid">
      <div>
        <div className="kicker">Catálogo</div>
        <h1 className="h1">Editar libro</h1>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <div>
          <div className="label">Título</div>
          <input className="input" name="title" value={form.title} onChange={onChange} required />
        </div>

        <div className="row">
          <div>
            <div className="label">Fecha de publicación</div>
            <input className="input" type="date" name="publishDate" value={form.publishDate} onChange={onChange} required />
          </div>
          <div>
            <div className="label">URL de imagen</div>
            <input className="input" name="image" value={form.image} onChange={onChange} placeholder="https://…" />
          </div>
        </div>

        <div>
          <div className="label">Autor</div>
          <select className="input" name="authorId" value={form.authorId} onChange={onChange} required>
            <option value="">Selecciona autor…</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        <div>
          <div className="label">Descripción</div>
          <textarea className="textarea" rows={4} name="description" value={form.description} onChange={onChange} />
        </div>

        {form.image && (
          <div className="card">
            <div className="thumb"><img src={form.image} alt="preview" /></div>
            <div className="card-body"><div className="meta">Vista previa</div></div>
          </div>
        )}

        <div className="row-end">
          <a className="btn" href="/books">Cancelar</a>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
        </div>
      </form>
    </section>
  );
}
