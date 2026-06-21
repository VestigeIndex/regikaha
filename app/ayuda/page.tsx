import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guía y ayuda — RegiKaha",
  description: "Guía de uso para clientes, profesionales, empresas y Regi Works.",
  alternates: { canonical: "https://regikaha.com/ayuda" },
};

const sections = [
  { lang: "ES", title: "Guía rápida", client: "Cliente: publica un proyecto, añade ciudad, fotos y detalles, compara profesionales y guarda favoritos.", pro: "Profesional: completa tu perfil, añade servicios, define zonas, revisa oportunidades y usa Regi Works para clientes, obras y presupuestos.", works: "Regi Works: crea cliente, obra, presupuesto, documento, radar de materiales y proveedores." },
  { lang: "FR", title: "Guide rapide", client: "Client : publiez un projet, ajoutez ville, photos et détails, comparez les professionnels et enregistrez vos favoris.", pro: "Professionnel : complétez votre profil, ajoutez des services, définissez vos zones, consultez les opportunités et utilisez Regi Works.", works: "Regi Works : créez client, chantier, devis, document, radar matériaux et fournisseurs." },
  { lang: "IT", title: "Guida rapida", client: "Cliente: pubblica un progetto, aggiungi città, foto e dettagli, confronta professionisti e salva preferiti.", pro: "Professionista: completa il profilo, aggiungi servizi, definisci zone, rivedi opportunità e usa Regi Works.", works: "Regi Works: crea cliente, cantiere, preventivo, documento, radar materiali e fornitori." },
  { lang: "PT", title: "Guia rápido", client: "Cliente: publique um projeto, adicione cidade, fotos e detalhes, compare profissionais e guarde favoritos.", pro: "Profissional: complete o perfil, adicione serviços, defina zonas, reveja oportunidades e use Regi Works.", works: "Regi Works: crie cliente, obra, orçamento, documento, radar de materiais e fornecedores." },
  { lang: "DE", title: "Kurzanleitung", client: "Kunde: Projekt veröffentlichen, Stadt, Fotos und Details hinzufügen, Fachleute vergleichen und Favoriten speichern.", pro: "Profi: Profil vervollständigen, Leistungen hinzufügen, Gebiete festlegen, Chancen prüfen und Regi Works nutzen.", works: "Regi Works: Kunde, Projekt, Angebot, Dokument, Materialradar und Lieferanten anlegen." },
  { lang: "NL", title: "Snelle gids", client: "Klant: plaats een project, voeg stad, foto's en details toe, vergelijk vakmensen en bewaar favorieten.", pro: "Vakman: vul profiel aan, voeg diensten toe, stel regio's in, bekijk kansen en gebruik Regi Works.", works: "Regi Works: maak klant, project, offerte, document, materiaalradar en leveranciers aan." },
  { lang: "EN", title: "Quick guide", client: "Client: publish a project, add city, photos and details, compare professionals and save favourites.", pro: "Professional: complete your profile, add services, set areas, review opportunities and use Regi Works.", works: "Regi Works: create client, job, quote, document, material radar and suppliers." },
];

const faq = [
  "¿Cómo publico un proyecto? / How do I publish a project?",
  "¿Cómo cambio entre modo cliente y profesional? / How do I switch between client and professional mode?",
  "¿Cómo uso Regi Works para presupuestos? / How do I use Regi Works for quotes?",
  "¿Cómo funciona el mapa y los proveedores? / How do maps and suppliers work?",
];

export default function HelpPage() {
  return <main className="bg-canvas"><section className="container-x py-12 sm:py-16"><div className="rounded-[34px] border border-forest-600/10 bg-white p-6 shadow-soft sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.32em] text-forest-700">RegiKaha</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-ink">Guía y ayuda</h1><p className="mt-3 max-w-3xl text-muted">Todo el funcionamiento esencial para clientes, profesionales, empresas y Regi Works, disponible en los idiomas principales de la interfaz.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/publicar-proyecto" className="btn btn-primary">Publicar proyecto</Link><Link href="/regi-works" className="btn btn-secondary">Regi Works</Link><Link href="/conectar" className="btn btn-ghost">Entrar / registrarse</Link></div></div><div className="mt-8 grid gap-4 lg:grid-cols-2">{sections.map((item) => <article key={item.lang} className="rounded-[28px] border border-forest-600/10 bg-white p-6 shadow-sm"><span className="chip bg-mint text-forest-800">{item.lang}</span><h2 className="mt-4 text-2xl font-bold text-ink">{item.title}</h2><ul className="mt-4 space-y-3 text-sm text-muted"><li><strong className="text-ink">Client:</strong> {item.client}</li><li><strong className="text-ink">Pro:</strong> {item.pro}</li><li><strong className="text-ink">Regi Works:</strong> {item.works}</li></ul></article>)}</div><div className="mt-8 rounded-[28px] border border-forest-600/10 bg-white p-6 shadow-sm"><h2 className="text-2xl font-bold text-ink">FAQ</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{faq.map((q) => <div key={q} className="rounded-2xl bg-mint/50 p-4 text-sm font-semibold text-ink">{q}</div>)}</div></div></section></main>;
}
