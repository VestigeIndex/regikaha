"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const TAGLINE: Record<string, string> = {
  es: "Red europea de profesionales verificados para reformas, construcción e instalaciones",
  en: "European network of verified professionals for renovations, construction and installations",
  fr: "Réseau européen de professionnels vérifiés pour rénovations, construction et installations",
  it: "Rete europea di professionisti verificati per ristrutturazioni, edilizia e impianti",
  pt: "Rede europeia de profissionais verificados para reformas, construção e instalações",
  de: "Europäisches Netzwerk verifizierter Fachbetriebe für Renovierung, Bau und Installation",
  nl: "Europees netwerk van geverifieerde vakmensen voor renovatie, bouw en installatie",
};

const PRO: Record<string, string> = {
  es: "Soy profesional", en: "I'm a professional", fr: "Je suis professionnel",
  it: "Sono un professionista", pt: "Sou profissional", de: "Ich bin Fachbetrieb", nl: "Ik ben vakman",
};

export function TopBar() {
  const { locale } = useI18n();
  return (
    <div className="bg-forest-900 text-white/85">
      <div className="container-x flex h-9 items-center justify-between gap-3 text-xs">
        <p className="flex min-w-0 items-center gap-1.5 truncate">
          <ShieldCheck size={13} className="shrink-0 text-forest-300" />
          <span className="truncate">{TAGLINE[locale] || TAGLINE.es}</span>
        </p>
        <Link href="/registro/profesional" className="ml-auto whitespace-nowrap font-semibold text-white/95 transition hover:text-white">
          {PRO[locale] || PRO.es} →
        </Link>
      </div>
    </div>
  );
}
