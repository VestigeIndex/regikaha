"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type FounderStatus = {
  limit: number;
  claimed: number;
  remaining: number;
  available: boolean;
  trialMonths: number;
};

export function FounderAvailability({ compact = false }: { compact?: boolean }) {
  const { locale } = useI18n();
  const [status, setStatus] = useState<FounderStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/billing/founder-status")
      .then((response) => response.json())
      .then((data) => { if (!cancelled) setStatus(data); })
      .catch(() => null);
    return () => { cancelled = true; };
  }, []);

  if (!status) return <span className="text-sm text-muted">Consultando plazas reales...</span>;
  const percent = Math.min(100, Math.round((status.claimed / status.limit) * 100));
  const availableLabel = ({
    es: `${status.remaining} de ${status.limit} plazas disponibles`, fr: `${status.remaining} places disponibles sur ${status.limit}`,
    it: `${status.remaining} posti disponibili su ${status.limit}`, pt: `${status.remaining} de ${status.limit} vagas disponíveis`,
    de: `${status.remaining} von ${status.limit} Plätzen verfügbar`, nl: `${status.remaining} van ${status.limit} plaatsen beschikbaar`,
    en: `${status.remaining} of ${status.limit} places available`,
  } as const)[locale];
  const claimedLabel = ({
    es: `${status.claimed} plazas activadas o reservadas`, fr: `${status.claimed} places activées ou réservées`,
    it: `${status.claimed} posti attivati o prenotati`, pt: `${status.claimed} vagas ativadas ou reservadas`,
    de: `${status.claimed} Plätze aktiviert oder reserviert`, nl: `${status.claimed} plaatsen geactiveerd of gereserveerd`,
    en: `${status.claimed} places activated or reserved`,
  } as const)[locale];
  if (compact) {
    return (
      <span className="text-sm font-semibold text-forest-800">
        {status.available ? availableLabel : "Plazas fundador agotadas"}
      </span>
    );
  }
  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted">{claimedLabel}</span>
        <span className="font-semibold text-forest-800">{availableLabel}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas-alt" aria-label={`${percent}% de plazas ocupadas`}>
        <div className="h-full rounded-full bg-forest-600 transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
