import type { Metadata } from "next";
import { DatabaseBackup, EyeOff, KeyRound, LockKeyhole, ShieldCheck, Siren } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Seguridad y protección", description: "Medidas de seguridad, privacidad, sesiones, moderación y notificación responsable de vulnerabilidades de Regi Kaha.", path: "/seguridad" });

const controls = [
  { icon: LockKeyhole, title: "Sesiones protegidas", text: "Cookies HttpOnly, Secure y SameSite; caducidad y revocación tras cambios críticos." },
  { icon: KeyRound, title: "Acceso y permisos", text: "Contraseñas derivadas con sal y permisos separados para cada rol y para administración." },
  { icon: EyeOff, title: "Datos privados", text: "Email, teléfono y dirección exacta no se publican en perfiles ni resultados de búsqueda." },
  { icon: ShieldCheck, title: "Protección de formularios", text: "Validación de servidor, límites de tamaño, rate limit, honeypot y Turnstile según riesgo." },
  { icon: DatabaseBackup, title: "Trazabilidad", text: "Acciones administrativas y cambios críticos quedan registrados para revisión y exportación." },
  { icon: Siren, title: "Divulgación responsable", text: "Los avisos de seguridad pueden enviarse al contacto publicado en security.txt." },
];

export default function SeguridadPage() {
  return <><PageHeader eyebrow="Seguridad" title="Protección práctica para cada interacción" description="Aplicamos defensa por capas y minimización de datos en cuentas, proyectos, mensajes, pagos y administración." breadcrumbs={[{ name: "Inicio", path: "/" }, { name: "Seguridad" }]} /><section className="container-x py-14"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{controls.map(({ icon: Icon, title, text }) => <article key={title} className="card p-6"><Icon className="text-forest-600" size={22} /><h2 className="mt-4 font-bold text-ink">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">{text}</p></article>)}</div></section><CtaBand title="¿Has detectado un problema de seguridad?" text="No incluyas datos personales innecesarios. Describe el impacto y los pasos mínimos para reproducirlo." primary={{ label: "Contactar", href: "/contacto" }} secondary={{ label: "Privacidad", href: "/legal/privacidad" }} /></>;
}
