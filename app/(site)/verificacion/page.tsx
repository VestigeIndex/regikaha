import type { Metadata } from "next";
import { BadgeCheck, Building2, FileCheck2, MailCheck, PhoneCall, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Verificación de profesionales", description: "Niveles y proceso de verificación de identidad, contacto, empresa y documentación profesional en Regi Kaha.", path: "/verificacion" });

const levels = [
  { icon: BadgeCheck, title: "Nivel 0 · Perfil creado", text: "El perfil existe, pero todavía no muestra ninguna insignia de verificación." },
  { icon: MailCheck, title: "Nivel 1 · Email", text: "La dirección de correo ha sido confirmada por su titular." },
  { icon: PhoneCall, title: "Nivel 2 · Teléfono", text: "El número profesional ha superado el proceso de confirmación." },
  { icon: Building2, title: "Nivel 3 · Identidad o empresa", text: "El equipo ha revisado los datos declarados de la persona o empresa." },
  { icon: FileCheck2, title: "Nivel 4 · Documentación", text: "Se ha revisado documentación profesional aplicable al oficio y al país." },
  { icon: ShieldCheck, title: "Nivel 5 · Historial", text: "El perfil mantiene actividad e interacciones reales dentro de la plataforma." },
];

export default function VerificacionPage() {
  return <><PageHeader eyebrow="Confianza" title="La verificación se demuestra, no se compra" description="Cada insignia corresponde a comprobaciones concretas. Pagar un plan no mejora el nivel de verificación ni el ranking." breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Verificación" }]} /><section className="container-x py-14"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{levels.map(({ icon: Icon, title, text }) => <article key={title} className="card p-6"><Icon className="text-forest-600" size={22} /><h2 className="mt-4 font-bold text-ink">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">{text}</p></article>)}</div></section><CtaBand title="¿Quieres solicitar la revisión de tu perfil?" text="Completa primero tus datos, zonas, servicios y documentación." primary={{ label: "Crear perfil profesional", href: "/registro/profesional" }} secondary={{ label: "Política de verificación", href: "/legal/politica-verificacion" }} /></>;
}
