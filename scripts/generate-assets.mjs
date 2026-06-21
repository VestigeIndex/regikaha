/**
 * Generador de recursos SVG de Regi Kaha.
 *
 * Produce placeholders premium con la identidad verde para la fase inicial.
 * Cuando se conecten fotos reales (R2 / CDN) se sustituyen estos archivos sin
 * tocar el código: las rutas se mantienen.
 *
 * Uso: node scripts/generate-assets.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pub = join(root, "public");

function write(rel, content) {
  const full = join(pub, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content.trim() + "\n", "utf8");
  console.log("·", rel);
}

const GREEN = { deep: "#0F5C4A", main: "#198C68", bright: "#2AB673", mint: "#DDF4EA", ink: "#122019" };

/* ---------- Marca: favicon ---------- */
write(
  "favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${GREEN.deep}"/><stop offset="0.55" stop-color="${GREEN.main}"/><stop offset="1" stop-color="${GREEN.bright}"/>
  </linearGradient></defs>
  <rect width="64" height="64" rx="16" fill="url(#g)"/>
  <path d="M16 31 32 16l16 15" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20 29v17a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V29" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32 49V38" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
</svg>`,
);

/* ---------- Open Graph 1200x630 ---------- */
write(
  "og-image.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN.deep}"/><stop offset="0.6" stop-color="${GREEN.main}"/><stop offset="1" stop-color="${GREEN.bright}"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <g transform="translate(90,210)">
    <rect x="0" y="0" width="92" height="92" rx="22" fill="rgba(255,255,255,0.16)"/>
    <path d="M24 47 46 26l22 21" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 44v25a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V44" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="210" y="278" font-family="Inter, sans-serif" font-size="58" font-weight="800" fill="#fff">Regi Kaha</text>
  <text x="92" y="396" font-family="Inter, sans-serif" font-size="40" font-weight="700" fill="#fff">Profesionales verificados para</text>
  <text x="92" y="448" font-family="Inter, sans-serif" font-size="40" font-weight="700" fill="${GREEN.mint}">reformas y servicios técnicos</text>
  <text x="92" y="516" font-family="Inter, sans-serif" font-size="26" fill="rgba(255,255,255,0.85)">Compara por precio, calidad, portfolio y valoraciones reales · Gratis para clientes</text>
</svg>`,
);

/* ---------- Helper: tarjeta abstracta con etiqueta ---------- */
function sceneCard({ w = 800, h = 600, label, hueShift = 0, motif = "build" }) {
  const rot = 135 + hueShift;
  const motifSvg = {
    build: `<g stroke="rgba(255,255,255,0.5)" stroke-width="3" fill="none">
      <rect x="${w * 0.55}" y="${h * 0.42}" width="${w * 0.3}" height="${h * 0.4}" rx="6"/>
      <path d="M${w * 0.55} ${h * 0.42} L${w * 0.7} ${h * 0.3} L${w * 0.85} ${h * 0.42}"/>
      <line x1="${w * 0.62}" y1="${h * 0.55}" x2="${w * 0.78}" y2="${h * 0.55}"/>
      <line x1="${w * 0.62}" y1="${h * 0.65}" x2="${w * 0.78}" y2="${h * 0.65}"/>
    </g>`,
    tools: `<g stroke="rgba(255,255,255,0.5)" stroke-width="3" fill="none">
      <circle cx="${w * 0.72}" cy="${h * 0.4}" r="46"/>
      <path d="M${w * 0.72} ${h * 0.55} V${h * 0.8}"/>
      <path d="M${w * 0.6} ${h * 0.72} H${w * 0.84}"/>
    </g>`,
    spark: `<g stroke="rgba(255,255,255,0.5)" stroke-width="3" fill="none">
      <path d="M${w * 0.74} ${h * 0.3} l-${w * 0.08} ${h * 0.24} h${w * 0.06} l-${w * 0.05} ${h * 0.2}"/>
    </g>`,
  }[motif];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="cg" gradientTransform="rotate(${rot})">
      <stop offset="0" stop-color="${GREEN.deep}"/><stop offset="0.55" stop-color="${GREEN.main}"/><stop offset="1" stop-color="${GREEN.bright}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#cg)"/>
  <circle cx="${w * 0.18}" cy="${h * 0.22}" r="${h * 0.34}" fill="rgba(255,255,255,0.08)"/>
  <circle cx="${w * 0.85}" cy="${h * 0.9}" r="${h * 0.28}" fill="rgba(0,0,0,0.07)"/>
  ${motifSvg}
  <text x="48" y="${h - 56}" font-family="Inter, sans-serif" font-size="34" font-weight="700" fill="#fff">${label}</text>
  <text x="48" y="${h - 24}" font-family="Inter, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)">Regi Kaha · imagen de muestra</text>
</svg>`;
}

/* ---------- Hero ---------- */
write("images/hero-reforma.svg", sceneCard({ w: 800, h: 1000, label: "Reforma premium", hueShift: 0, motif: "build" }));

/* ---------- 10 imágenes del brief (placeholders semánticos) ----------
   Cada una corresponde 1:1 con un prompt de /public/image-prompts.
   Sustituir el .svg por la foto real (mismo nombre, extensión .jpg/.webp)
   y actualizar la ruta en lib/images.ts. */
const brand = [
  ["01-hero", "Hero · reforma premium", "build", 1200, 760],
  ["02-cocina", "Cocina reformada", "build", 800, 600],
  ["03-bano", "Baño reformado", "build", 800, 600],
  ["04-arquitecto", "Arquitecto con planos", "build", 800, 600],
  ["05-electricista", "Electricista", "spark", 800, 600],
  ["06-fontanero", "Fontanero", "tools", 800, 600],
  ["07-pintura", "Pintura / interiorismo", "tools", 800, 600],
  ["08-solar", "Energía solar", "spark", 800, 600],
  ["09-fachada", "Fachada / tejado", "build", 800, 600],
  ["10-cliente", "Cliente satisfecho", "tools", 1200, 600],
];
brand.forEach(([slug, label, motif, w, h], i) => {
  write(`images/brand/${slug}.svg`, sceneCard({ w, h, label, hueShift: i * 10, motif }));
});

/* ---------- Categorías ---------- */
const cats = [
  ["reformas-integrales", "Reformas integrales", "build"],
  ["banos-cocinas", "Baños y cocinas", "build"],
  ["electricidad", "Electricidad", "spark"],
  ["fontaneria", "Fontanería", "tools"],
  ["pintura", "Pintura", "tools"],
  ["climatizacion", "Climatización", "tools"],
  ["albanileria", "Albañilería", "build"],
  ["carpinteria", "Carpintería", "tools"],
  ["fachadas-tejados", "Fachadas y tejados", "build"],
  ["aislamiento-impermeabilizacion", "Aislamiento", "build"],
  ["energia-solar", "Energía solar", "spark"],
  ["arquitectura-licencias", "Arquitectura", "build"],
  ["aparejadores-ingenieria", "Aparejadores e ingeniería", "tools"],
  ["peritos-tecnicos", "Peritos técnicos", "tools"],
  ["mantenimiento-industrial", "Mantenimiento industrial", "tools"],
];
cats.forEach(([slug, label, motif], i) => {
  write(`images/categories/${slug}.svg`, sceneCard({ label, hueShift: i * 12, motif }));
});

/* ---------- Portfolio "antes" (tono apagado) ---------- */
function beforeCard(label) {
  const w = 800, h = 600;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#d8ded9"/>
  <rect width="${w}" height="${h}" fill="url(#n)" opacity="0.5"/>
  <g stroke="rgba(18,32,25,0.18)" stroke-width="2" fill="none">
    <rect x="${w * 0.5}" y="${h * 0.4}" width="${w * 0.32}" height="${h * 0.42}" rx="4"/>
    <line x1="${w * 0.1}" y1="${h * 0.82}" x2="${w * 0.9}" y2="${h * 0.82}"/>
  </g>
  <text x="40" y="56" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="rgba(18,32,25,0.55)">ANTES</text>
  <text x="40" y="${h - 32}" font-family="Inter, sans-serif" font-size="22" fill="rgba(18,32,25,0.5)">${label}</text>
</svg>`;
}
[
  ["reforma-piso-antes", "Piso a reformar"],
  ["cocina-antes", "Cocina antigua"],
  ["bano-antes", "Baño antiguo"],
  ["solar-antes", "Tejado sin placas"],
  ["fachada-antes", "Fachada deteriorada"],
  ["local-antes", "Local diáfano"],
  ["vestidor-antes", "Habitación sin vestidor"],
  ["pintura-antes", "Paredes con gotelé"],
].forEach(([slug, label]) => write(`images/portfolio/${slug}.svg`, beforeCard(label)));

console.log("\n✓ Recursos generados en /public");
