/** Configuración central del sitio: identidad, navegación y enlaces. */

export const site = {
  name: "RegiNova",
  legalName: "RegiNova",
  url: "https://reginova.es",
  email: "hola@reginova.es",
  tagline: "Compara profesionales verificados para reformas y servicios técnicos en toda España",
  description:
    "RegiNova es el marketplace español de profesionales verificados para reformas, construcción, instalaciones, mantenimiento, arquitectura e ingeniería. Compara por precio, calidad, portfolio y valoraciones reales. Gratis para clientes.",
  founderPrice: { monthly: "49,95 €/mes + IVA", yearly: "499 €/año + IVA" },
  founderSlots: 300,
  founderFreeMonths: 5,
} as const;

export const mainNav = [
  { label: "Buscar profesionales", href: "/buscar" },
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
      { label: "Categorías", href: "/categorias" },
      { label: "Trabajos realizados", href: "/trabajos" },
      { label: "Cómo funciona", href: "/como-funciona" },
    ],
  },
  {
    title: "Para clientes",
    links: [
      { label: "Para clientes", href: "/para-clientes" },
      { label: "Pedir presupuesto", href: "/buscar" },
      { label: "Preguntas frecuentes", href: "/faq" },
      { label: "Política de reseñas", href: "/legal/politica-resenas" },
    ],
  },
  {
    title: "Para profesionales",
    links: [
      { label: "Unirme como profesional", href: "/registro" },
      { label: "Para profesionales", href: "/para-profesionales" },
      { label: "Precios", href: "/precios" },
      { label: "Oferta fundadores", href: "/fundadores" },
      { label: "Política de verificación", href: "/legal/politica-verificacion" },
    ],
  },
  {
    title: "RegiNova",
    links: [
      { label: "Sobre RegiNova", href: "/sobre" },
      { label: "Contacto", href: "/contacto" },
      { label: "Aviso legal", href: "/legal/aviso-legal" },
      { label: "Privacidad", href: "/legal/privacidad" },
      { label: "Cookies", href: "/legal/cookies" },
    ],
  },
];

export const trustPoints = [
  "Profesionales verificados",
  "Valoraciones reales",
  "Sin rankings comprados",
  "Gratis para clientes",
];
