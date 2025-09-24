"use client";

import { useEffect, useMemo, useState } from "react";

export default function HomePage() {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErr(null);
        const [ra, rb] = await Promise.all([
          fetch("/api/authors", { cache: "no-store" }),
          fetch("/api/books", { cache: "no-store" }),
        ]);
        if (!ra.ok) throw new Error(`Error autores (HTTP ${ra.status})`);
        if (!rb.ok) throw new Error(`Error libros (HTTP ${rb.status})`);
        const [A, B] = await Promise.all([ra.json(), rb.json()]);
        setAuthors(Array.isArray(A) ? A : []);
        setBooks(Array.isArray(B) ? B : []);
      } catch (e) {
        setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalAuthors = authors.length;
  const totalBooks = books.length;
  const lastAuthor = useMemo(() => authors[authors.length - 1] ?? null, [authors]);
  const lastBook = useMemo(() => books[books.length - 1] ?? null, [books]);

  return (
    <section className="grid">
      <div>
        <div className="kicker">Inicio</div>
        <h1 className="h1">Home</h1>
      </div>

      {loading && <div className="center">Cargando datos…</div>}
      {err && <div className="alert"><b>Error:</b> {err}</div>}

      {!loading && !err && (
        <>
          <div className="grid" style={{ gridTemplateColumns:"repeat(3, 1fr)" }}>
            <div className="card" style={{ padding:16 }}>
              <div className="meta">Total autores</div>
              <div style={{ fontSize:28, fontWeight:800 }}>{totalAuthors}</div>
            </div>
            <div className="card" style={{ padding:16 }}>
              <div className="meta">Total libros</div>
              <div style={{ fontSize:28, fontWeight:800 }}>{totalBooks}</div>
            </div>
            <div className="card" style={{ padding:16 }}>
              <div className="meta">Último agregado</div>
              <div style={{ fontWeight:700 }}>{lastBook?.title ?? lastAuthor?.name ?? "—"}</div>
            </div>
          </div>

          <div>
            <div className="kicker">Recientes</div>
            <h2 className="h1" style={{ fontSize:24, marginTop:6 }}>Últimos autores</h2>
          </div>
          <div className="grid grid-cards">
            {authors.slice(-4).reverse().map((a) => (
              <article key={a.id} className="card">
                <div className="thumb">{a.image ? <img src={a.image} alt={a.name}/> : null}</div>
                <div className="card-body">
                  <div className="title">{a.name}</div>
                  <div className="desc">{a.description}</div>
                  <div className="meta">{a.birthDate}</div>
                </div>
              </article>
            ))}
            {authors.length === 0 && <div className="empty">Sin autores.</div>}
          </div>

          <div>
            <div className="kicker">Recientes</div>
            <h2 className="h1" style={{ fontSize:24, marginTop:6 }}>Últimos libros</h2>
          </div>
          <div className="grid grid-cards">
            {books.slice(-4).reverse().map((b) => (
              <article key={b.id} className="card">
                <div className="thumb">{b.image ? <img src={b.image} alt={b.title}/> : null}</div>
                <div className="card-body">
                  <div className="title">{b.title}</div>
                  <div className="desc">{b.description}</div>
                  <div className="meta">{b.publishDate || b.publicationDate || ""}</div>
                </div>
              </article>
            ))}
            {books.length === 0 && <div className="empty">Sin libros.</div>}
          </div>
        </>
      )}
    </section>
  );
}
