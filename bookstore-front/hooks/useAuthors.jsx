import { useEffect, useState } from "react";

export function useAuthors(autoLoad = true) {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);

  async function list() {
    try {
      setLoading(true); setError(null);
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

  async function create(author) {
    const res = await fetch("/api/authors", {
      method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(author)
    });
    if (!res.ok) throw new Error(`No se pudo crear (HTTP ${res.status})`);
    await list();
  }

  async function update(id, author) {
    const res = await fetch(`/api/authors/${id}`, {
      method:"PUT", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ ...author, id })
    });
    if (!res.ok) throw new Error(`No se pudo actualizar (HTTP ${res.status})`);
    await list();
  }

  async function remove(id) {
    const res = await fetch(`/api/authors/${id}`, { method:"DELETE" });
    if (!res.ok) throw new Error(`No se pudo eliminar (HTTP ${res.status})`);
    setAuthors(prev => prev.filter(a => a.id !== id));
  }

  useEffect(() => { if (autoLoad) list(); }, [autoLoad]);

  return { authors, loading, error, list, create, update, remove };
}
