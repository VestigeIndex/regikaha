import type { QuoteStatus } from "@/lib/types";

const map: Record<QuoteStatus, { label: string; cls: string }> = {
  new: { label: "Nueva", cls: "bg-forest-500/14 text-forest-800" },
  contacted: { label: "Contactado", cls: "bg-amber-100 text-amber-800" },
  quoted: { label: "Presupuestado", cls: "bg-blue-100 text-blue-800" },
  won: { label: "Ganada", cls: "bg-forest-600 text-white" },
  lost: { label: "Perdida", cls: "bg-slate-100 text-slate-600" },
  closed: { label: "Cerrada", cls: "bg-slate-100 text-slate-600" },
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const s = map[status];
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}
