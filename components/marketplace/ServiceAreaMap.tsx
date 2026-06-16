import { MapPin } from "lucide-react";

export function ServiceAreaMap({
  query,
  label,
  radiusKm,
}: {
  query: string;
  label: string;
  radiusKm?: number;
}) {
  const mapQuery = encodeURIComponent(query || label);
  return (
    <section className="card overflow-hidden">
      <div className="p-5">
        <h2 className="font-bold text-ink inline-flex items-center gap-2">
          <MapPin size={18} className="text-forest-600" />
          Zona de operación
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          {label}{radiusKm ? ` · radio aproximado ${radiusKm} km` : ""}
        </p>
      </div>
      <iframe
        title={`Mapa de ${label}`}
        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-64 w-full border-0 bg-canvas-alt"
      />
    </section>
  );
}
