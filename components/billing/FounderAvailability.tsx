"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { detectMarketCountry } from "@/lib/market-country";

type FounderStatus = { available: boolean };

// Público: solo indica si HAY plazas por país, nunca el conteo real (eso es admin).
export function FounderAvailability({ compact = false }: { compact?: boolean }) {
  const { locale } = useI18n();
  const [status, setStatus] = useState<FounderStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    detectMarketCountry(locale)
      .then((country) => fetch(`/api/billing/founder-status?country=${encodeURIComponent(country)}`))
      .then((response) => response.json())
      .then((data) => { if (!cancelled) setStatus(data); })
      .catch(() => null);
    return () => { cancelled = true; };
  }, [locale]);

  const available = status?.available !== false;
  const availableLabel = ({
    es: "Plazas fundadoras disponibles por país", fr: "Places fondatrices disponibles par pays",
    it: "Posti fondatori disponibili per Paese", pt: "Vagas fundadoras disponíveis por país",
    de: "Gründerplätze pro Land verfügbar", nl: "Oprichtersplaatsen per land beschikbaar",
    en: "Founder slots available per country",
  } as const)[locale];
  const soldOutLabel = ({
    es: "Plazas fundadoras agotadas en tu país por ahora", fr: "Places fondatrices épuisées dans votre pays pour l'instant",
    it: "Posti fondatori esauriti nel tuo Paese per ora", pt: "Vagas fundadoras esgotadas no teu país por agora",
    de: "Gründerplätze in deinem Land derzeit ausgeschöpft", nl: "Oprichtersplaatsen in jouw land voorlopig vol",
    en: "Founder slots in your country are full for now",
  } as const)[locale];
  const label = available ? availableLabel : soldOutLabel;

  if (compact) {
    return <span className="text-sm font-semibold text-forest-800">{label}</span>;
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800">
      <span className={`h-2 w-2 rounded-full ${available ? "bg-forest-600" : "bg-amber-500"}`} />
      {label}
    </span>
  );
}
