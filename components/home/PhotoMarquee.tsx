"use client";

import { useContent } from "@/lib/i18n/useLocalizedContent";

const photos = [
  { src: "/images/photos/ventanas.webp", categoryId: "reformas-integrales" },
  { src: "/images/photos/carpinteria.webp", categoryId: "carpinteria" },
  { src: "/images/photos/domotica.webp", categoryId: "electricidad" },
  { src: "/images/photos/climatizacion.webp", categoryId: "climatizacion" },
  { src: "/images/photos/suelos.webp", categoryId: "albanileria" },
  { src: "/images/photos/puertas.webp", categoryId: "carpinteria" },
  { src: "/images/photos/tejado.webp", categoryId: "fachadas-tejados" },
  { src: "/images/photos/fachada.webp", categoryId: "aislamiento-impermeabilizacion" },
  { src: "/images/photos/mantenimiento.webp", categoryId: "mantenimiento-industrial" },
  { src: "/images/photos/pavimentacion.webp", categoryId: "albanileria" },
];

/** Banda de fotos reales en movimiento continuo (marquee, pausa al pasar el cursor). */
export function PhotoMarquee() {
  const content = useContent();
  const items = [...photos, ...photos];
  return (
    <section className="py-10 overflow-hidden border-y hairline bg-canvas">
      <div className="marquee">
        <div className="marquee-track gap-4">
          {items.map((p, i) => (
            <figure
              key={i}
              className="relative h-44 w-72 shrink-0 rounded-2xl overflow-hidden shadow-soft ring-1 ring-forest-600/10 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-transparent" />
              <figcaption className="absolute bottom-2.5 left-3 text-white text-sm font-semibold drop-shadow">
                {content.categories[p.categoryId].name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
