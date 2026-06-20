import type { Category } from "@/lib/types";
import { tradeCategories } from "@/lib/data/trade-categories";

/**
 * Categorías y gremios del marketplace. El orden define la prioridad de
 * aparición en home y listados. `featured` marca las que se muestran en la
 * cuadrícula destacada de la home.
 */
export const categories: Category[] = [
  {
    id: "reformas-integrales",
    slug: "reformas-integrales",
    name: "Reformas integrales",
    professionalNoun: "empresa de reformas",
    professionalNounPlural: "reformas",
    shortDescription: "Reforma completa de viviendas y locales, llave en mano.",
    description:
      "Profesionales y empresas para reformas integrales de viviendas, pisos y locales: distribución, albañilería, instalaciones, acabados y coordinación de gremios bajo un único responsable de obra.",
    icon: "HardHat",
    image: "/images/photos/ventanas.webp",
    popularServices: [
      "Reforma integral de piso",
      "Reforma de local comercial",
      "Reforma de vivienda llave en mano",
    ],
    featured: true,
  },
  {
    id: "banos-cocinas",
    slug: "banos-y-cocinas",
    name: "Baños y cocinas",
    professionalNoun: "especialista en baños y cocinas",
    professionalNounPlural: "reformas-de-banos-y-cocinas",
    shortDescription: "Reforma de baños y cocinas con acabados premium.",
    description:
      "Especialistas en reforma de baños y cocinas: fontanería, electricidad, alicatado, muebles a medida, encimeras y acabados. Resultado funcional y duradero con materiales de calidad.",
    icon: "Bath",
    image: "/images/categories/banos-cocinas.svg",
    popularServices: ["Reforma de baño", "Reforma de cocina", "Cambio de bañera por ducha"],
    featured: true,
  },
  {
    id: "electricidad",
    slug: "electricidad",
    name: "Electricistas",
    professionalNoun: "electricista",
    professionalNounPlural: "electricistas",
    shortDescription: "Instalaciones y reparaciones eléctricas con boletín.",
    description:
      "Electricistas autorizados para instalaciones, cuadros eléctricos, boletines, puntos de recarga, domótica y reparaciones. Trabajo seguro y conforme a normativa con certificado cuando aplica.",
    icon: "Zap",
    image: "/images/photos/domotica.webp",
    popularServices: [
      "Instalación eléctrica de vivienda",
      "Boletín eléctrico",
      "Punto de recarga para coche eléctrico",
    ],
    featured: true,
  },
  {
    id: "fontaneria",
    slug: "fontaneria",
    name: "Fontanería",
    professionalNoun: "fontanero",
    professionalNounPlural: "fontaneros",
    shortDescription: "Fontanería, fugas, calderas y agua caliente.",
    description:
      "Fontaneros para instalaciones de agua, reparación de fugas, sustitución de tuberías, grifería, calentadores y calderas. Servicio rápido y limpio para vivienda y empresa.",
    icon: "Droplet",
    image: "/images/categories/fontaneria.svg",
    popularServices: ["Reparación de fugas", "Instalación de calentador", "Cambio de tuberías"],
    featured: true,
  },
  {
    id: "pintura",
    slug: "pintura",
    name: "Pintura",
    professionalNoun: "pintor",
    professionalNounPlural: "pintores",
    shortDescription: "Pintura interior y exterior con acabado cuidado.",
    description:
      "Pintores e interioristas para pintura de viviendas, locales y comunidades: alisado de paredes, esmaltado, pintura decorativa, fachadas y trabajos de detalle con acabado profesional.",
    icon: "Paintbrush",
    image: "/images/categories/pintura.svg",
    popularServices: ["Pintura interior de piso", "Alisado de paredes", "Pintura de fachada"],
    featured: true,
  },
  {
    id: "climatizacion",
    slug: "climatizacion",
    name: "Climatización",
    professionalNoun: "instalador de climatización",
    professionalNounPlural: "instaladores-de-climatizacion",
    shortDescription: "Aire acondicionado, aerotermia y ventilación.",
    description:
      "Instaladores de climatización para aire acondicionado, bombas de calor, aerotermia, suelo radiante y ventilación. Cálculo de potencia, instalación y mantenimiento con garantía.",
    icon: "Wind",
    image: "/images/photos/climatizacion.webp",
    popularServices: [
      "Instalación de aire acondicionado",
      "Aerotermia",
      "Mantenimiento de climatización",
    ],
    featured: true,
  },
  {
    id: "albanileria",
    slug: "albanileria",
    name: "Albañilería",
    professionalNoun: "albañil",
    professionalNounPlural: "albaniles",
    shortDescription: "Obra, tabiquería, solados y trabajos de albañilería.",
    description:
      "Albañiles para obra nueva y reforma: tabiquería, solados y alicatados, recrecidos, derribos controlados, pequeñas obras y trabajos de albañilería en general.",
    icon: "Building2",
    image: "/images/photos/suelos.webp",
    popularServices: ["Tabiquería y derribos", "Solado y alicatado", "Pequeñas obras"],
    featured: false,
  },
  {
    id: "carpinteria",
    slug: "carpinteria",
    name: "Carpintería",
    professionalNoun: "carpintero",
    professionalNounPlural: "carpinteros",
    shortDescription: "Carpintería de madera y aluminio a medida.",
    description:
      "Carpinteros para muebles a medida, armarios, puertas, tarima, cocinas y carpintería de aluminio y PVC. Diseño, fabricación e instalación con materiales seleccionados.",
    icon: "DoorOpen",
    image: "/images/photos/carpinteria.webp",
    popularServices: ["Armarios a medida", "Puertas interiores", "Tarima y suelo laminado"],
    featured: false,
  },
  {
    id: "fachadas-tejados",
    slug: "fachadas-y-tejados",
    name: "Fachadas y tejados",
    professionalNoun: "especialista en fachadas y tejados",
    professionalNounPlural: "fachadas-y-tejados",
    shortDescription: "Rehabilitación de fachadas, cubiertas y tejados.",
    description:
      "Empresas especializadas en fachadas y tejados: rehabilitación, SATE, impermeabilización de cubiertas, reparación de tejados, canalones y trabajos verticales con seguridad certificada.",
    icon: "Home",
    image: "/images/photos/tejado.webp",
    popularServices: ["Rehabilitación de fachada", "Reparación de tejado", "Aislamiento SATE"],
    featured: true,
  },
  {
    id: "aislamiento-impermeabilizacion",
    slug: "aislamiento-e-impermeabilizacion",
    name: "Aislamiento e impermeabilización",
    professionalNoun: "especialista en aislamiento",
    professionalNounPlural: "aislamiento-e-impermeabilizacion",
    shortDescription: "Aislamiento térmico, acústico e impermeabilizaciones.",
    description:
      "Profesionales de aislamiento térmico y acústico e impermeabilización de cubiertas, terrazas, sótanos y muros. Mejora la eficiencia energética y elimina humedades de forma duradera.",
    icon: "Layers",
    image: "/images/photos/fachada.webp",
    popularServices: [
      "Impermeabilización de terraza",
      "Aislamiento de cubierta",
      "Tratamiento de humedades",
    ],
    featured: true,
  },
  {
    id: "energia-solar",
    slug: "energia-solar",
    name: "Energía solar",
    professionalNoun: "instalador solar",
    professionalNounPlural: "instaladores-solares",
    shortDescription: "Placas solares y autoconsumo fotovoltaico.",
    description:
      "Instaladores de energía solar fotovoltaica y autoconsumo: estudio de ahorro, placas, baterías, legalización y mantenimiento. Reduce tu factura con una instalación bien dimensionada.",
    icon: "Sun",
    image: "/images/categories/energia-solar.svg",
    popularServices: [
      "Instalación de placas solares",
      "Autoconsumo con baterías",
      "Legalización fotovoltaica",
    ],
    featured: true,
  },
  {
    id: "arquitectura-licencias",
    slug: "arquitectura-y-licencias",
    name: "Arquitectura y licencias",
    professionalNoun: "arquitecto",
    professionalNounPlural: "arquitectos",
    shortDescription: "Proyectos, licencias y dirección de obra.",
    description:
      "Estudios de arquitectura para proyectos de obra, licencias de obra y actividad, certificados, reformas con proyecto y dirección facultativa. Tramitación técnica completa.",
    icon: "PencilRuler",
    image: "/images/categories/arquitectura-licencias.svg",
    popularServices: ["Proyecto de reforma", "Licencia de obra", "Dirección de obra"],
    featured: true,
  },
  {
    id: "aparejadores-ingenieria",
    slug: "aparejadores-e-ingenieria",
    name: "Aparejadores e ingeniería",
    professionalNoun: "aparejador",
    professionalNounPlural: "aparejadores",
    shortDescription: "Aparejadores, ingenieros y certificaciones técnicas.",
    description:
      "Aparejadores e ingenieros para certificados energéticos, ITE, cédulas, proyectos de instalaciones, legalizaciones y coordinación de seguridad y salud en obra.",
    icon: "Ruler",
    image: "/images/categories/aparejadores-ingenieria.svg",
    popularServices: ["Certificado energético", "ITE / inspección de edificio", "Cédula de habitabilidad"],
    featured: false,
  },
  {
    id: "peritos-tecnicos",
    slug: "peritos-tecnicos",
    name: "Peritos técnicos",
    professionalNoun: "perito técnico",
    professionalNounPlural: "peritos-tecnicos",
    shortDescription: "Peritajes, informes y dictámenes técnicos.",
    description:
      "Peritos técnicos para informes de patologías, humedades, grietas, valoraciones, dictámenes para seguros y peritajes judiciales con documentación rigurosa.",
    icon: "ClipboardCheck",
    image: "/images/categories/peritos-tecnicos.svg",
    popularServices: ["Informe pericial de humedades", "Peritaje de grietas", "Dictamen para seguro"],
    featured: false,
  },
  {
    id: "mantenimiento-industrial",
    slug: "mantenimiento-industrial",
    name: "Mantenimiento industrial",
    professionalNoun: "empresa de mantenimiento",
    professionalNounPlural: "mantenimiento-industrial",
    shortDescription: "Mantenimiento técnico para empresas e industria.",
    description:
      "Empresas de mantenimiento técnico e industrial: instalaciones, naves, climatización, electricidad, preventivo y correctivo para comercios, oficinas e industria con contratos a medida.",
    icon: "Factory",
    image: "/images/photos/mantenimiento.webp",
    popularServices: [
      "Contrato de mantenimiento preventivo",
      "Mantenimiento de instalaciones",
      "Mantenimiento industrial correctivo",
    ],
    featured: false,
  },
  ...tradeCategories,
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const featuredCategories = categories.filter((c) => c.featured);
