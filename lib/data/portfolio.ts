import type { PortfolioItem } from "@/lib/types";

/** Trabajos realizados (antes/después) de los profesionales. */
export const portfolioItems: PortfolioItem[] = [
  {
    id: "port-1",
    professionalId: "pro-reformas-costa",
    title: "Reforma integral de piso en Ruzafa",
    category: "Reformas integrales",
    description:
      "Reforma completa de un piso de 95 m² en el barrio de Ruzafa: nueva distribución, cocina abierta al salón, dos baños y suelo continuo.",
    location: "Valencia",
    beforeImage: "/images/portfolio/reforma-piso-antes.svg",
    afterImage: "/images/portfolio/reforma-piso-despues.svg",
    galleryImages: [],
    completionDate: "2026-04-30",
  },
  {
    id: "port-2",
    professionalId: "pro-reformas-costa",
    title: "Cocina abierta con isla",
    category: "Baños y cocinas",
    description:
      "Apertura de cocina al salón con isla central, encimera de cuarzo compacto y electrodomésticos integrados.",
    location: "Valencia",
    beforeImage: "/images/portfolio/cocina-antes.svg",
    afterImage: "/images/categories/banos-cocinas.svg",
    galleryImages: [],
    completionDate: "2026-03-22",
  },
  {
    id: "port-3",
    professionalId: "pro-banos-premium",
    title: "Baño premium con ducha de obra",
    category: "Baños y cocinas",
    description:
      "Reforma de baño con plato de ducha de obra microcemento, mampara a medida y mueble suspendido.",
    location: "Madrid",
    beforeImage: "/images/portfolio/bano-antes.svg",
    afterImage: "/images/categories/banos-cocinas.svg",
    galleryImages: [],
    completionDate: "2026-05-18",
  },
  {
    id: "port-4",
    professionalId: "pro-solarhogar",
    title: "Autoconsumo de 5 kWp con baterías",
    category: "Energía solar",
    description:
      "Instalación fotovoltaica de 12 paneles con baterías en vivienda unifamiliar. Ahorro estimado del 70% en la factura.",
    location: "Málaga",
    beforeImage: "/images/portfolio/solar-antes.svg",
    afterImage: "/images/categories/energia-solar.svg",
    galleryImages: [],
    completionDate: "2026-05-10",
  },
  {
    id: "port-5",
    professionalId: "pro-cubiertas-bilbao",
    title: "Rehabilitación de fachada con SATE",
    category: "Fachadas y tejados",
    description:
      "Aislamiento SATE de fachada de edificio de viviendas, mejora de eficiencia energética y nuevo acabado de mortero.",
    location: "Bilbao",
    beforeImage: "/images/portfolio/fachada-antes.svg",
    afterImage: "/images/photos/tejado.webp",
    galleryImages: [],
    completionDate: "2026-05-22",
  },
  {
    id: "port-6",
    professionalId: "pro-estudio-nova",
    title: "Proyecto de reforma de local a vivienda",
    category: "Arquitectura y licencias",
    description:
      "Cambio de uso de local a vivienda con proyecto, licencia y dirección de obra. Espacio diáfano con mucha luz natural.",
    location: "Barcelona",
    beforeImage: "/images/portfolio/local-antes.svg",
    afterImage: "/images/categories/arquitectura-licencias.svg",
    galleryImages: [],
    completionDate: "2026-04-12",
  },
  {
    id: "port-7",
    professionalId: "pro-carpinteria-roble",
    title: "Vestidor a medida en roble",
    category: "Carpintería",
    description:
      "Vestidor completo a medida en chapa de roble natural con módulos abiertos, cajones y zona de calzado.",
    location: "Zaragoza",
    beforeImage: "/images/portfolio/vestidor-antes.svg",
    afterImage: "/images/photos/carpinteria.webp",
    galleryImages: [],
    completionDate: "2026-03-30",
  },
  {
    id: "port-8",
    professionalId: "pro-pinturas-mediterraneo",
    title: "Alisado y pintura de vivienda completa",
    category: "Pintura",
    description:
      "Eliminación de gotelé, alisado integral y pintura en tono cálido de una vivienda de 110 m².",
    location: "Alicante",
    beforeImage: "/images/portfolio/pintura-antes.svg",
    afterImage: "/images/categories/pintura.svg",
    galleryImages: [],
    completionDate: "2026-04-25",
  },
];

export function getPortfolioByProfessional(professionalId: string): PortfolioItem[] {
  return portfolioItems.filter((p) => p.professionalId === professionalId);
}

export const featuredPortfolio = portfolioItems.slice(0, 6);
