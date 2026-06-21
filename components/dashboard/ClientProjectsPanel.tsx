"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Inbox } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardShell";

type Project = {
  id: string;
  title?: string | null;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  category_id?: string | null;
  subcategory?: string | null;
  urgency?: string | null;
  budget_range?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export function ClientProjectsPanel() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/client/projects", { credentials: "same-origin", cache: "no-store" })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error("projects")))
      .then((data) => { if (!cancelled) setProjects(data.projects || []); })
      .catch(() => { if (!cancelled) setError("No se pudieron cargar tus proyectos."); });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <DashboardHeader
        title="Mis proyectos"
        subtitle="Sigue tus reformas, reparaciones, instalaciones y pre-presupuestos desde el modo cliente."
        action={<Link href="/publicar-proyecto" className="btn btn-primary text-sm">Publicar proyecto gratis <ArrowRight size={15} /></Link>}
      />
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {projects === null && !error && <div className="card p-8 text-sm text-muted">Cargando proyectos...</div>}
      {projects?.length === 0 && (
        <div className="card p-8 text-center">
          <Inbox size={36} className="mx-auto text-forest-600" />
          <h2 className="mt-4 text-xl font-bold text-ink">Todavía no tienes proyectos publicados</h2>
          <p className="mt-2 text-muted">Publica tu primera reforma o reparación para recibir pre-presupuestos no vinculantes.</p>
          <Link href="/publicar-proyecto" className="btn btn-primary mt-5">Publicar proyecto gratis</Link>
        </div>
      )}
      {Boolean(projects?.length) && (
        <div className="space-y-4">
          {projects!.map((project) => (
            <article key={project.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">{project.status || "published"}</p>
                  <h2 className="mt-1 text-lg font-bold text-ink">{project.title || project.subcategory || project.category_id || "Proyecto"}</h2>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{project.description}</p>
                </div>
                <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest-800">{project.city || project.country}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                {project.budget_range && <span className="chip">Presupuesto: {project.budget_range}</span>}
                {project.urgency && <span className="chip">Urgencia: {project.urgency}</span>}
                {project.created_at && <span className="chip">Publicado: {new Date(project.created_at).toLocaleDateString()}</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
