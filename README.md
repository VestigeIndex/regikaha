# RegiKaha

**Marketplace español de profesionales verificados** para reformas, construcción,
instalaciones, mantenimiento, arquitectura, ingeniería y servicios técnicos.

> Compara profesionales verificados por precio, calidad, portfolio y valoraciones reales.
> Gratis para clientes · Ranking justo, sin pay-to-win.

Identidad verde · Europa por países · construido con Next.js.

---

## ✨ Qué incluye

- **Home premium** con hero + buscador, banda de confianza, categorías, profesionales
  destacados, cómo funciona, trabajos (antes/después), testimonios (slider), ranking justo,
  oferta fundadores y CTA.
- **Buscador** con filtros (categoría, ubicación, valoración, tipo, idioma, verificado, seguro,
  factura, urgencias, portfolio) y orden **por mérito, nunca por pago**.
- **Perfiles SEO** de profesional (`/profesionales/[slug]`) con servicios, portfolio, reseñas
  verificadas, desglose de valoraciones y formulario de presupuesto.
- **Páginas de servicio** SEO (`/profesionales/[slug]/[service]`) con incluye/no incluye,
  proceso y FAQs.
- **Categorías** (`/categorias` y `/categorias/[slug]`) con profesionales y servicios populares.
- **Registro profesional** por pasos con la oferta fundadores.
- **Panel del profesional** (`/panel`): resumen, solicitudes, perfil, servicios y reseñas.
- **Panel de administración** (`/admin`): verificaciones, profesionales, moderación de reseñas.
- **Páginas de empresa y legales**: para clientes, para profesionales, precios, fundadores,
  cómo funciona, trabajos, sobre, FAQ, contacto + 7 documentos legales.
- **SEO**: metadata por página, `sitemap.xml`, `robots.txt`, JSON-LD (Organization,
  HomeAndConstructionBusiness, Service, FAQPage, AggregateRating, BreadcrumbList).
- **Animaciones**: revelado al hacer scroll (con _progressive enhancement_), slider de
  testimonios y micro-interacciones; respeta `prefers-reduced-motion`.

## 🧱 Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 3** (identidad verde, ver `tailwind.config.ts`)
- **lucide-react** (iconos)
- Sin backend en la fase inicial: datos mock realistas en `lib/data`, servidos a través de
  interfaces tipadas para **migrar a Cloudflare D1 / PostgreSQL sin tocar la UI**.

## 🚀 Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck  # comprobación de tipos
```

Requisitos: Node.js 20+.

## 📁 Estructura

```
app/
  (site)/            Páginas públicas (Header + Footer + banner de cookies)
    page.tsx         Home
    buscar/          Buscador con filtros
    categorias/      Listado y detalle de categoría
    profesionales/   Perfil SEO + página de servicio
    registro/        Alta profesional
    para-clientes, para-profesionales, precios, fundadores,
    como-funciona, trabajos, sobre, faq, contacto, legal/...
  panel/             Panel del profesional (sin indexar)
  admin/             Panel de administración (sin indexar)
  sitemap.ts, robots.ts, not-found.tsx
components/
  site/   ui/   marketplace/   home/   dashboard/
lib/
  types.ts           Modelo de datos (entidades del marketplace)
  data/              Datos mock + capa de consulta y RANKING JUSTO (index.ts)
  images.ts          Manifiesto de las 10 imágenes del brief
  seo.ts  site.ts  utils.ts  icons.ts
public/
  images/            Placeholders SVG (categorías, portfolio, marca)
  image-prompts/     Los 10 prompts para generar las fotos reales
scripts/
  generate-assets.mjs  Generador de los SVG de /public
docs/brief/          Brief original (master prompt, web copy, arquitectura, imágenes)
```

## ⚖️ Ranking justo (núcleo ético)

El orden por defecto se calcula en `lib/data/index.ts` → `meritScore()` a partir de
**valoración, número de reseñas, proyectos completados, rapidez de respuesta y verificación**.
**No existe ningún factor de pago, plan ni puja.** Ningún profesional puede pagar para subir.

## 🖼️ Imágenes

El paquete original incluye **10 prompts** (no fotos). Cada uno está en
`public/image-prompts/` y mapeado en `lib/images.ts` a un placeholder SVG premium en
`public/images/brand/`. Para usar fotos reales:

1. Genera la imagen con el prompt indicado.
2. Guárdala en `public/images/brand/` (p. ej. `01-hero.jpg`).
3. Cambia la ruta `src` en `lib/images.ts`. El resto de la app no cambia.

Regenerar todos los SVG: `node scripts/generate-assets.mjs`.

## ☁️ Despliegue — Cloudflare Pages (auto-deploy)

El sitio se exporta como **HTML estático** (`output: "export"` → carpeta `out/`) y se publica en
**Cloudflare Pages**. El despliegue es automático con **GitHub Actions**:

- Workflow: `.github/workflows/deploy.yml` (se ejecuta en cada push a `main`).
- Crea/actualiza el proyecto Pages `regikaha`, despliega `out/` y vincula el dominio
  **regikaha.com** + `www`.
- Secrets necesarios en el repo (`Settings → Secrets and variables → Actions`):
  - `CLOUDFLARE_API_TOKEN` — token con permisos *Cloudflare Pages: Edit* (+ *Zone: DNS Edit* para el dominio).
  - `CLOUDFLARE_ACCOUNT_ID` — id de la cuenta.

Requisito para el dominio: **regikaha.com** debe estar añadido como **zona** en la misma cuenta de
Cloudflare para que el CNAME se cree solo. URL provisional: `https://regikaha.pages.dev`.

Despliegue manual (opcional): `npm run build && npx wrangler pages deploy out --project-name=regikaha`.

La capa de datos está aislada detrás de interfaces (`lib/types.ts`) para migrar de mock a
**D1 / R2** sin reescribir la UI (conectar `QuoteForm` y registro a Workers + D1, imágenes a R2).

## 📌 Notas

- Los datos de profesionales, reseñas y precios son **mock realistas** para demostración.
- Los documentos legales son **plantillas** y deben revisarse con asesoría jurídica.
- Cliente gratis · Autónomo Nacional 19,95 €/mes o 215,46 €/año + IVA/VAT · Europa Pro 49,95 €/mes o 539,46 €/año + IVA/VAT · Primeros 300 verificados: 5 meses gratis.
