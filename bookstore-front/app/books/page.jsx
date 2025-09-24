"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch("/api/books", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!confirm("¿Seguro que deseas eliminar este libro?")) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });

      if (res.status === 412) {
        let msg = "No se puede eliminar: el libro tiene datos asociados.";
        try {
          const data = await res.json().catch(() => null);
          if (data?.message) msg = data.message;
        } catch {}
        alert(msg);
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      alert(e.message || String(e));
    }
  }

  return (
    <section className="grid">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div className="kicker">Catálogo</div>
          <h1 className="h1">Books</h1>
        </div>
        <Link href="/books/create" className="btn primary"> Crear</Link>
      </div>

      {loading && <div className="center">Cargando libros…</div>}

      {err && (
        <div className="alert">
          <b>Error:</b> {err}
          <div className="row-end" style={{ marginTop: 8 }}>
            <button className="btn" onClick={load}>Reintentar</button>
          </div>
        </div>
      )}

      {!loading && !err && books.length === 0 && <div className="empty">No hay libros.</div>}

      {!loading && !err && books.length > 0 && (
        <div className="grid grid-cards">
          {books.map((b) => (
            <article key={b.id} className="card">
              {}
              <Link
                href={`/books/${b.id}`}
                className="card-link"
                aria-label={`Ver detalle de ${b.title}`}
              >
                <div className="thumb">
                {}
                {b.image ? <img src={b.image} alt={b.title} /> : null}
                </div>
                <div className="card-body">
                  <div className="title">{b.title}</div>
                  <div className="desc">{b.description}</div>
                  <div className="meta">{b.publishDate || b.publicationDate || ""}</div>
                </div>
              </Link>

              {}
              <div className="hr" />
              <div className="row-end">
                <Link className="btn" href={`/books/edit/${b.id}`}>Editar</Link>
                <button className="btn danger" onClick={() => remove(b.id)}>Eliminar</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
