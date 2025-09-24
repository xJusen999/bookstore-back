"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateAuthorCascadePage() {
  const router = useRouter();

  // autor base
  const [aForm, setAForm] = useState({
    name: "",
    description: "",
    birthDate: "",
    image: "",
  });

  // libro info esperada
  const [bForm, setBForm] = useState({
    title: "",
    description: "",
    publishDate: "",
    image: "",
  });

  // premio info esperada
  const [pForm, setPForm] = useState({
    name: "",
    description: "",
    awardDate: "", 
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const onA = (e) => setAForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onB = (e) => setBForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onP = (e) => setPForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);

    if (!aForm.name || !bForm.title || !pForm.name) {
      setErr("Autor (nombre), Libro (título) y Premio (nombre) son obligatorios.");
      return;
    }

    try {
      setSaving(true);

      // creacion de autor 
      const ra = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aForm),
      });
      if (!ra.ok) throw new Error(`Error creando autor (HTTP ${ra.status})`);
      const author = await ra.json();
      const authorId = author.id;

      // create libro
      const rb = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bForm),
      });
      if (!rb.ok) throw new Error(`Error creando libro (HTTP ${rb.status})`);
      const book = await rb.json();
      const bookId = book.id;

      // asocioan de libo con autor
      const rlinkAB = await fetch(`/api/authors/${authorId}/books/${bookId}`, {
        method: "POST",
      });
      if (!rlinkAB.ok) throw new Error(`Error asociando libro y autor (HTTP ${rlinkAB.status})`);

      // creacion de premio
      const rp = await fetch("/api/prizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pForm),
      });
      if (!rp.ok) throw new Error(`Error creando premio (HTTP ${rp.status})`);
      const prize = await rp.json();
      const prizeId = prize.id;

      // premio a  autor
      const rlinkPA = await fetch(`/api/prizes/${prizeId}/author/${authorId}`, {
        method: "POST",
      });
      if (!rlinkPA.ok) throw new Error(`Error asociando premio y autor (HTTP ${rlinkPA.status})`);

      alert("Autor creado y asociado con libro y premio correctamente.");
      router.push("/authors");
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="grid">
      <div>
        <div className="kicker">Administración</div>
        <h1 className="h1">Crear autor + libro + premio</h1>
      </div>

      <form className="form" onSubmit={onSubmit}>
        {}
        <div className="card" style={{ padding: 16 }}>
          <div className="kicker">Autor</div>
          <div className="row">
            <div>
              <div className="label">Nombre *</div>
              <input className="input" name="name" value={aForm.name} onChange={onA} required />
            </div>
            <div>
              <div className="label">Fecha de nacimiento</div>
              <input className="input" type="date" name="birthDate" value={aForm.birthDate} onChange={onA} />
            </div>
          </div>
          <div>
            <div className="label">URL de imagen</div>
            <input className="input" name="image" value={aForm.image} onChange={onA} placeholder="https://…" />
          </div>
          <div>
            <div className="label">Descripción</div>
            <textarea className="textarea" rows={3} name="description" value={aForm.description} onChange={onA} />
          </div>
        </div>

        {}
        <div className="card" style={{ padding: 16 }}>
          <div className="kicker">Libro</div>
          <div className="row">
            <div>
              <div className="label">Título *</div>
              <input className="input" name="title" value={bForm.title} onChange={onB} required />
            </div>
            <div>
              <div className="label">Fecha de publicación</div>
              <input className="input" type="date" name="publishDate" value={bForm.publishDate} onChange={onB} />
            </div>
          </div>
          <div>
            <div className="label">URL de imagen</div>
            <input className="input" name="image" value={bForm.image} onChange={onB} placeholder="https://…" />
          </div>
          <div>
            <div className="label">Descripción</div>
            <textarea className="textarea" rows={3} name="description" value={bForm.description} onChange={onB} />
          </div>
        </div>

        {}
        <div className="card" style={{ padding: 16 }}>
          <div className="kicker">Premio</div>
          <div className="row">
            <div>
              <div className="label">Nombre *</div>
              <input className="input" name="name" value={pForm.name} onChange={onP} required />
            </div>
            <div>
              <div className="label">Fecha del premio</div>
              <input className="input" type="date" name="awardDate" value={pForm.awardDate} onChange={onP} />
            </div>
          </div>
          <div>
            <div className="label">Descripción</div>
            <textarea className="textarea" rows={3} name="description" value={pForm.description} onChange={onP} />
          </div>
        </div>

        {err && <div className="alert"><b>Error:</b> {err}</div>}

        <div className="row-end">
          <a className="btn" href="/authors">Cancelar</a>
          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar todo"}
          </button>
        </div>
      </form>
    </section>
  );
}

