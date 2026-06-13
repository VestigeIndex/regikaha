/**
 * Manifiesto de imágenes de marca (las 10 del brief de RegiNova).
 *
 * Cada entrada apunta a un placeholder SVG premium y al prompt original con el
 * que generar la foto hiperrealista definitiva. Para usar fotos reales:
 *   1. Genera la imagen con el prompt indicado (ver /public/image-prompts).
 *   2. Guarda el archivo en /public/images/brand/ (p. ej. 01-hero.jpg).
 *   3. Cambia `src` aquí por la nueva ruta. El resto de la app no cambia.
 */
export interface BrandImage {
  src: string;
  alt: string;
  /** Prompt para generar la foto real (también en /public/image-prompts). */
  prompt: string;
  promptFile: string;
}

export const brandImages = {
  hero: {
    src: "/images/brand/01-hero.svg",
    alt: "Reforma premium de vivienda con profesionales revisando el proyecto junto al cliente",
    prompt:
      "Imagen hiperrealista horizontal para hero web: vivienda moderna en reforma premium, dos profesionales revisando planos o tablet junto a un cliente, luz natural, acabados elegantes, ambiente español/europeo, sensación de confianza y calidad, sin texto.",
    promptFile: "/image-prompts/01_hero_reforma_premium.txt",
  },
  cocina: {
    src: "/images/brand/02-cocina.svg",
    alt: "Cocina moderna recién reformada con acabados limpios y luz natural",
    prompt:
      "Cocina moderna recién reformada, acabados limpios, madera clara, encimera premium, luz natural, sensación de hogar real y alta calidad. Sin texto.",
    promptFile: "/image-prompts/02_cocina_reformada.txt",
  },
  bano: {
    src: "/images/brand/03-bano.svg",
    alt: "Baño moderno premium reformado con ducha y azulejos elegantes",
    prompt:
      "Baño moderno premium con ducha, azulejos elegantes, iluminación cálida, resultado final de reforma profesional. Sin texto.",
    promptFile: "/image-prompts/03_bano_reformado.txt",
  },
  arquitecto: {
    src: "/images/brand/04-arquitecto.svg",
    alt: "Arquitecto revisando planos con un cliente en un ambiente profesional",
    prompt:
      "Arquitecto/a o aparejador/a revisando planos con cliente en obra o estudio, casco o tablet opcional, ambiente profesional y real. Sin texto.",
    promptFile: "/image-prompts/04_arquitecto_planos.txt",
  },
  electricista: {
    src: "/images/brand/05-electricista.svg",
    alt: "Electricista profesional revisando un cuadro eléctrico",
    prompt:
      "Electricista profesional revisando cuadro eléctrico o instalación limpia, con herramientas, ambiente seguro y profesional. Sin texto.",
    promptFile: "/image-prompts/05_electricista.txt",
  },
  fontanero: {
    src: "/images/brand/06-fontanero.svg",
    alt: "Fontanero profesional realizando una instalación en un baño",
    prompt:
      "Fontanero profesional realizando instalación o reparación en baño/cocina, escena limpia y creíble, no exagerada. Sin texto.",
    promptFile: "/image-prompts/06_fontanero.txt",
  },
  pintura: {
    src: "/images/brand/07-pintura.svg",
    alt: "Pintor aplicando el acabado en la pared de una vivienda luminosa",
    prompt:
      "Pintor o equipo aplicando acabado en pared de vivienda luminosa, sensación de detalle y trabajo cuidado. Sin texto.",
    promptFile: "/image-prompts/07_pintura_interiores.txt",
  },
  solar: {
    src: "/images/brand/08-solar.svg",
    alt: "Técnicos instalando placas solares en el tejado de una vivienda",
    prompt:
      "Técnicos instalando placas solares en tejado residencial español/europeo, día soleado, aspecto seguro y profesional. Sin texto.",
    promptFile: "/image-prompts/08_energia_solar.txt",
  },
  fachada: {
    src: "/images/brand/09-fachada.svg",
    alt: "Equipo trabajando en la rehabilitación de una fachada con medidas de seguridad",
    prompt:
      "Equipo trabajando en fachada, impermeabilización o tejado, con medidas de seguridad, edificio residencial, composición limpia. Sin texto.",
    promptFile: "/image-prompts/09_fachada_tejado.txt",
  },
  cliente: {
    src: "/images/brand/10-cliente.svg",
    alt: "Cliente y profesional revisando con satisfacción un espacio reformado terminado",
    prompt:
      "Cliente y profesional en espacio reformado terminado, revisando resultado o presupuesto, gesto natural de satisfacción y confianza. Sin texto.",
    promptFile: "/image-prompts/10_cliente_satisfecho.txt",
  },
} satisfies Record<string, BrandImage>;

export type BrandImageKey = keyof typeof brandImages;
