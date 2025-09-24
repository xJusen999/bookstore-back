"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

//organizacion basica
function prettyLabel(k = "") {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function isPlainObject(v) {
  return Object.prototype.toString.call(v) === "[object Object]";
}

function renderValue(v) {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) {
    // oragnizar map
    const parts = v.map((item) => {
      if (isPlainObject(item)) return item.name ?? item.title ?? item.id ?? JSON.stringify(item);
      return String(item);
    });
    return parts.join(", ");
  }
  if (isPlainObject(v)) {
    // se prioriza name y title
    return v.name ?? v.title ?? v.id ?? JSON.stringify(v);
  }
  return String(v);
}

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`/api/books/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBook(data);
      } catch (e) {
        setErr(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // campos conocidos del json
  const knownOrder = [
    "title",
    "subtitle",
    "author",
    "authors",
    "publishDate",
    "publicationDate",
    "publisher",
    "editorial",            
    "pages",
    "isbn",
    "language",
    "genre",
    "genres",
    "tags",
    "prizes",
    "awards",
    "rating",
  ];

  // reviews
  const reviews = useMemo(() => {
    if (!book) return [];
    return (
      book.reviews ||
      book.reviewList ||
      book.comentarios || //por si el json viene distinto
      []
    );
  }, [book]);

  // extra card de info
  const extraEntries = useMemo(() => {
    if (!book || !isPlainObject(book)) return [];
    const omit = new Set([
      ...knownOrder,
      "id",
      "image",
      "cover",
      "description",
      "sinopsis",
      "synopsis",
      "createdAt",
      "updatedAt",
    ]);
    return Object.entries(book).filter(([k]) => !omit.has(k));
  }, [book]);

  if (loading) return <div className="center">Cargando…</div>;
  if (err) return <div className="alert"><b>Error:</b> {err}</div>;
  if (!book) return <div className="empty">Libro no encontrado.</div>;

  // normalizacon de campios
  const title = book.title ?? book.name ?? `Libro #${book.id}`;
  const img   = book.image ?? book.cover ?? null;
  const desc  = book.description ?? book.sinopsis ?? book.synopsis ?? "";

  const author =
    book.author ??
    (Array.isArray(book.authors) ? book.authors[0] : undefined);

  const publisher =
    book.editorial ?? book.publisher ?? book.editor ?? null;

  const publishDate = book.publishDate ?? book.publicationDate ?? null;

  const genres =
    book.genres ?? book.genre ?? book.tags ?? null;

  const prizes =
    book.prizes ?? book.awards ?? null;

  return (
    <section className="grid">
      <div>
        <div className="kicker">Detalle</div>
        <h1 className="h1">{title}</h1>
      </div>

      <div className="card" style={{ padding: 16 }}>
        {}
        <div className="grid" style={{ gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
          <div className="thumb" style={{ aspectRatio: "16/10" }}>
            {}
            {img ? <img src={img} alt={title} /> : null}
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="meta">ID: {book.id}</div>

            {author && (
              <div className="meta">
                Autor: {renderValue(author)}
              </div>
            )}

            {publisher && (
              <div className="meta">
                Editorial: {renderValue(publisher)}
              </div>
            )}

            {publishDate && (
              <div className="meta">
                Fecha de publicación: {renderValue(publishDate)}
              </div>
            )}

            {"pages" in book && (
              <div className="meta">
                Páginas: {renderValue(book.pages)}
              </div>
            )}

            {"isbn" in book && (
              <div className="meta">
                ISBN: {renderValue(book.isbn)}
              </div>
            )}

            {"language" in book && (
              <div className="meta">
                Idioma: {renderValue(book.language)}
              </div>
            )}

            {genres && (
              <div className="meta">
                Género(s): {renderValue(genres)}
              </div>
            )}

            {prizes && (
              <div className="meta">
                Premio(s): {renderValue(prizes)}
              </div>
            )}

            {"rating" in book && (
              <div className="meta">
                Rating: {renderValue(book.rating)} / 5
              </div>
            )}

            <div className="hr" />
            <div style={{ whiteSpace: "pre-wrap" }}>{desc}</div>
          </div>
        </div>

        {}
        {extraEntries.length > 0 && (
          <>
            <div className="hr" />
            <h2 style={{ margin: "12px 0 8px" }}>Más detalles</h2>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {extraEntries.map(([k, v]) => (
                <div key={k} className="card" style={{ padding: 12 }}>
                  <div className="meta">{prettyLabel(k)}</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{renderValue(v)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {}
        <div className="hr" />
        <h2 style={{ margin: "12px 0 8px" }}>Reviews</h2>
        {(!reviews || reviews.length === 0) ? (
          <div className="empty">Aún no hay reviews.</div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {reviews.map((r, idx) => (
              <div key={r.id ?? idx} className="card" style={{ padding: 12 }}>
                <div className="title" style={{ fontSize: 16 }}>
                  {r.user ?? r.reviewer ?? "Anónimo"}
                </div>
                {"rating" in r && <div className="meta">Rating: {renderValue(r.rating)}</div>}
                {("date" in r || "createdAt" in r) && (
                  <div className="meta">Fecha: {r.date ?? r.createdAt}</div>
                )}
                <div className="desc" style={{ height: "auto", marginTop: 6 }}>
                  {r.comment ?? r.text ?? r.description ?? ""}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="row-end" style={{ marginTop: 12 }}>
          <a className="btn" href={`/books/${id}/reviews/create`}> Agregar review</a>
          <a className="btn" href="/books">Volver a Books</a>
        </div>
      </div>
    </section>
  );
}
