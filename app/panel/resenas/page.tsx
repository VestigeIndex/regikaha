"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";

interface ReviewRow { id: string; client_name: string; service_label: string; rating: number; comment: string; reply?: string | null; status: string; created_at: string }

export default function ResenasPage() {
  const [reviews, setReviews] = useState<ReviewRow[] | null>(null);
  const [summary, setSummary] = useState({ average: 0, total: 0, replied: 0 });
  const [replying, setReplying] = useState("");
  const [reply, setReply] = useState("");

  function load() {
    fetch("/api/reviews", { cache: "no-store", credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("reviews unavailable")))
      .then((data) => { setReviews(data.reviews || []); setSummary(data.summary || { average: 0, total: 0, replied: 0 }); })
      .catch(() => setReviews([]));
  }

  useEffect(load, []);

  async function sendReply(reviewId: string) {
    const response = await fetch("/api/reviews", { method: "PATCH", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ reviewId, reply }) });
    if (response.ok) { setReply(""); setReplying(""); load(); }
  }

  return (
    <>
      <DashboardHeader title="Valoraciones" subtitle="Responde a clientes con interacción verificada. Las reseñas legítimas no se eliminan por pago." />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Star size={19} />} label="Valoración media" value={summary.total ? `${summary.average}/5` : "—"} loading={reviews === null} />
        <StatCard icon={<MessageSquare size={19} />} label="Publicadas" value={summary.total} loading={reviews === null} />
        <StatCard icon={<MessageSquare size={19} />} label="Respondidas" value={summary.replied} loading={reviews === null} />
        <StatCard icon={<Star size={19} />} label="En moderación" value={reviews?.filter((review) => review.status === "pending").length || 0} loading={reviews === null} />
      </div>
      <div className="space-y-4">
        {reviews === null && Array.from({ length: 3 }).map((_, index) => <div key={index} className="card h-36 animate-pulse bg-ink/5" aria-hidden="true" />)}
        {reviews?.map((review) => <article key={review.id} className="card p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold text-ink">{review.client_name}</h2><span className="text-sm font-semibold text-amber-600">{review.rating}/5</span></div><p className="mt-1 text-xs text-muted">{review.service_label} · {review.status === "pending" ? "En moderación" : "Publicada"}</p><p className="mt-4 text-sm leading-relaxed text-ink/80">{review.comment}</p>{review.reply ? <div className="mt-4 border-l-2 border-forest-300 pl-3 text-sm text-muted">{review.reply}</div> : replying === review.id ? <div className="mt-4"><textarea value={reply} onChange={(event) => setReply(event.target.value)} className="input min-h-24" maxLength={1500} /><div className="mt-2 flex gap-2"><button type="button" onClick={() => void sendReply(review.id)} className="btn btn-primary text-sm">Publicar respuesta</button><button type="button" onClick={() => setReplying("")} className="btn btn-secondary text-sm">Cancelar</button></div></div> : <button type="button" onClick={() => setReplying(review.id)} className="btn btn-secondary mt-4 text-sm">Responder</button>}</article>)}
        {reviews?.length === 0 && <div className="card p-8 text-center"><h2 className="font-bold text-ink">Aún no hay valoraciones</h2><p className="mt-2 text-sm text-muted">Las reseñas aparecerán aquí después de una interacción real y su revisión de moderación.</p></div>}
      </div>
    </>
  );
}
