"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/authors", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAuthors(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!confirm("¿Seguro que deseas eliminar este autor?")) return;

    try {
      const res = await fetch(`/api/authors/${id}`, { method: "DELETE" });

      if (res.status === 412) {
        // Regla del backend: no se puede eliminar (tiene relaciones, etc.)
        let msg = "No se puede eliminar: el autor tiene datos asociados (p. ej. libros).";
        try {
          const data = await res.json().catch(() => null);
          if (data?.message) msg = data.message;
        } catch {}
        alert(msg);
        return;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Eliminado OK -> actualiza estado
      setAuthors((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      alert(e.message || String(e));
    }
  }

  // (Opcional) Sembrar un autor demo rápido
  async function seedDemo() {
    const sample = {
      name: "J. K. Rowling",
      description: "British author and screenwriter.",
      birthDate: "1965-07-31",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg",
    };
    await fetch("/api/authors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sample),
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="grid">
      {/* Hero / encabezado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div className="kicker">Administración</div>
          <h1 className="h1">Autores</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/create" className="btn primary">➕ Crear</Link>
          <button className="btn ghost" onClick={seedDemo}>Sembrar demo</button>
        </div>
      </div>

      {/* Estados */}
      {loading && <div className="center">Cargando autores…</div>}
      {error && (
        <div className="alert">
          <b>Error:</b> {error}
          <div className="row-end" style={{ marginTop: 10 }}>
            <button className="btn" onClick={load}>Reintentar</button>
          </div>
        </div>
      )}
      {!loading && !error && authors.length === 0 && (
        <div className="empty">No hay autores todavía.</div>
      )}

      {/* Grilla de cards */}
      {!loading && !error && authors.length > 0 && (
        <div className="grid grid-cards">
          {authors.map((a) => (
            <article key={a.id} className="card">
              <div className="thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {a.image ? <img src={a.image} alt={a.name} /> : null}
              </div>

              <div className="card-body">
                <div className="title">{a.name}</div>
                <div className="desc">{a.description}</div>
                <div className="meta">{a.birthDate}</div>

                <div className="hr" />

                <div className="row-end">
                  <Link className="btn" href={`/edit/${a.id}`}>Editar</Link>
                  <button className="btn danger" onClick={() => remove(a.id)}>Eliminar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
