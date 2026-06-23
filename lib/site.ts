/** Configuración central del sitio: identidad, navegación y enlaces. */

import { formatIntervalPrice, professionalPlans } from "./pricing";

export const site = {
  name: "RegiKaha",
  legalName: "Regi Kaha",
  url: "https://regikaha.com",
  email: "help@regikaha.com",
  tagline: "Compara profesionales verificados para reformas y servicios técnicos en mercados europeos seleccionados",
  description:
    "Regi Kaha conecta clientes con profesionales verificados para reformas, construcción, instalaciones, mantenimiento, arquitectura e ingeniería en mercados europeos seleccionados. Compara por precio, calidad, zona de cobertura, portfolio y valoraciones reales. Gratis para clientes.",
  founderPrice: {
    monthly: formatIntervalPrice(professionalPlans[0], "monthly"),
    yearly: formatIntervalPrice(professionalPlans[0], "yearly"),
  },
  founderSlots: 300,
  founderFreeMonths: 5,
} as const;

export const mainNav = [
  { label: "Buscar profesionales", href: "/buscar" },
  { label: "Mapa", href: "/mapa" },
  { label: "Publicar proyecto", href: "/publicar-proyecto" },
  { label: "Categorías", href: "/categorias" },
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Para profesionales", href: "/para-profesionales" },
  { label: "Precios", href: "/precios" },
];

export const footerNav: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Buscar profesionales", href: "/buscar" },
      { label: "Mapa", href: "/mapa" },
      { label: "Publicar proyecto gratis", href: "/publicar-proyecto" },
      { label: "Categorías", href: "/categorias" },
      { label: "Trabajos realizados", href: "/trabajos" },
      { label: "Cómo funciona", href: "/como-funciona" },
    ],
  },
  {
    title: "Para clientes",
    links: [
      { label: "Para clientes", href: "/para-clientes" },
      { label: "Pedir pre-presupuesto", href: "/publicar-proyecto" },
      { label: "Política de pre-presupuestos", href: "/legal/politica-prepresupuestos" },
      { label: "Preguntas frecuentes", href: "/faq" },
      { label: "Política de reseñas", href: "/legal/politica-resenas" },
    ],
  },
  {
    title: "B2B",
    links: [
      { label: "Para constructoras", href: "/constructoras" },
      { label: "Publicar subcontrata", href: "/publicar-subcontrata" },
      { label: "Buscar en el mapa", href: "/mapa" },
      { label: "Subcontratas", href: "/subcontratas" },
    ],
  },
  {
    title: "Para profesionales",
    links: [
      { label: "Unirme como profesional", href: "/registro/profesional" },
      { label: "Para profesionales", href: "/para-profesionales" },
      { label: "Precios", href: "/precios" },
      { label: "Oferta fundadores", href: "/fundadores" },
      { label: "Política de verificación", href: "/legal/politica-verificacion" },
      { label: "Política de suscripción", href: "/legal/politica-suscripcion" },
      { label: "Uso aceptable", href: "/legal/uso-aceptable" },
    ],
  },
  {
    title: "Regi Kaha",
    links: [
      { label: "Sobre Regi Kaha", href: "/sobre" },
      { label: "Contacto", href: "/contacto" },
      { label: "Aviso legal", href: "/legal/aviso-legal" },
      { label: "Privacidad", href: "/legal/privacidad" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Reclamaciones", href: "/legal/reclamaciones" },
    ],
  },
];

export const trustPoints = [
  "Profesionales verificados",
  "Valoraciones reales",
  "Sin rankings comprados",
  "Gratis para clientes",
];
