"use client";

import { useEffect, useState } from "react";
import { Check, X, ImageOff } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";

type Item = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  image_url: string;
  thumbnail_url?: string;
  professional?: string;
  country?: string;
};

export function AdminMediaModeration() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media-moderation", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No tienes permisos.");
      setItems(data.items || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function moderate(id: string, action: "approve" | "reject") {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/media-moderation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) setItems((current) => current.filter((item) => item.id !== id));
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Moderación de imágenes"
        subtitle="Aprueba o rechaza las fotos de portfolio antes de que sean visibles públicamente."
      />
      {error && <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div className="card p-8 text-sm text-muted">Cargando imágenes pendientes…</div>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center text-sm text-muted">
          <ImageOff size={28} className="mx-auto mb-2 text-forest-600" />
          No hay imágenes pendientes de moderación.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.thumbnail_url || item.image_url} alt={item.title} className="h-44 w-full object-cover bg-canvas-alt" />
              <div className="p-4">
                <p className="font-semibold text-ink truncate">{item.title || "Trabajo"}</p>
                <p className="text-xs text-muted truncate">{item.professional || "—"} · {item.country || "—"}</p>
                {item.description && <p className="mt-1 text-xs text-muted line-clamp-2">{item.description}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => moderate(item.id, "approve")} disabled={busy === item.id} className="btn btn-primary flex-1 text-sm disabled:opacity-60">
                    <Check size={15} /> Aprobar
                  </button>
                  <button onClick={() => moderate(item.id, "reject")} disabled={busy === item.id} className="btn btn-secondary flex-1 text-sm disabled:opacity-60">
                    <X size={15} /> Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
