const photos = [
  { src: "/images/photos/ventanas.webp", label: "Reformas integrales" },
  { src: "/images/photos/carpinteria.webp", label: "Carpintería a medida" },
  { src: "/images/photos/domotica.webp", label: "Electricidad y domótica" },
  { src: "/images/photos/climatizacion.webp", label: "Climatización" },
  { src: "/images/photos/suelos.webp", label: "Solados y alicatados" },
  { src: "/images/photos/puertas.webp", label: "Puertas y cerramientos" },
  { src: "/images/photos/tejado.webp", label: "Fachadas y tejados" },
  { src: "/images/photos/fachada.webp", label: "Aislamiento SATE" },
  { src: "/images/photos/mantenimiento.webp", label: "Mantenimiento" },
  { src: "/images/photos/pavimentacion.webp", label: "Pavimentación" },
];

/** Banda de fotos reales en movimiento continuo (marquee, pausa al pasar el cursor). */
export function PhotoMarquee() {
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
                alt={p.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-transparent" />
              <figcaption className="absolute bottom-2.5 left-3 text-white text-sm font-semibold drop-shadow">
                {p.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
