import type { Locale } from "./config";

/**
 * Extensión del diccionario para la HOME (fase 2). Se fusiona con el
 * diccionario base en el contexto. Tipado por `HomeDict` → completitud forzada
 * en los 7 idiomas activos (sin fallback).
 */
const en = {
  heroExtra: { avgRating: "Average rating", meritDesc: "Only merit and reputation" },
  trustExtra: {
    verifiedDesc: "Identity and activity checked.",
    realReviewsDesc: "Only from completed services.",
    noPaidRankingDesc: "No one pays to rank first.",
    freeForClientsDesc: "Search and request quotes for free.",
  },
  finalCta: {
    title: "Your next project starts by comparing verified professionals",
    text: "Free for clients. No paid rankings. Only verified professionals who stand out for their work.",
  },
};

export type HomeDict = typeof en;

const nl: HomeDict = {
  heroExtra: { avgRating: "Gemiddelde beoordeling", meritDesc: "Alleen verdienste en reputatie" },
  trustExtra: { verifiedDesc: "Identiteit en activiteit gecontroleerd.", realReviewsDesc: "Alleen van voltooide diensten.", noPaidRankingDesc: "Niemand betaalt voor de eerste plaats.", freeForClientsDesc: "Zoek en vraag gratis offertes aan." },
  finalCta: { title: "Uw volgende project begint met het vergelijken van geverifieerde vakmensen", text: "Gratis voor klanten. Geen betaalde rankings. Alleen geverifieerde vakmensen die uitblinken in hun werk." },
};
const fr: HomeDict = {
  heroExtra: { avgRating: "Note moyenne", meritDesc: "Au mérite et à la réputation" },
  trustExtra: { verifiedDesc: "Identité et activité vérifiées.", realReviewsDesc: "Uniquement de services réalisés.", noPaidRankingDesc: "Personne ne paie pour être premier.", freeForClientsDesc: "Cherchez et demandez un devis gratuitement." },
  finalCta: { title: "Votre prochain projet commence en comparant des professionnels vérifiés", text: "Gratuit pour les clients. Aucun classement payant. Uniquement des professionnels vérifiés qui se distinguent par leur travail." },
};
const de: HomeDict = {
  heroExtra: { avgRating: "Durchschnittsbewertung", meritDesc: "Nur Leistung und Reputation" },
  trustExtra: { verifiedDesc: "Identität und Tätigkeit geprüft.", realReviewsDesc: "Nur von erbrachten Leistungen.", noPaidRankingDesc: "Niemand zahlt für Platz eins.", freeForClientsDesc: "Kostenlos suchen und anfragen." },
  finalCta: { title: "Ihr nächstes Projekt beginnt mit dem Vergleich verifizierter Fachleute", text: "Kostenlos für Kunden. Keine bezahlten Rankings. Nur verifizierte Fachleute, die sich durch ihre Arbeit auszeichnen." },
};
const it: HomeDict = {
  heroExtra: { avgRating: "Valutazione media", meritDesc: "Solo merito e reputazione" },
  trustExtra: { verifiedDesc: "Identità e attività verificate.", realReviewsDesc: "Solo da servizi completati.", noPaidRankingDesc: "Nessuno paga per il primo posto.", freeForClientsDesc: "Cerca e richiedi preventivi gratis." },
  finalCta: { title: "Il tuo prossimo progetto inizia confrontando professionisti verificati", text: "Gratis per i clienti. Nessun posizionamento a pagamento. Solo professionisti verificati che si distinguono per il loro lavoro." },
};
const pt: HomeDict = {
  heroExtra: { avgRating: "Avaliação média", meritDesc: "Apenas mérito e reputação" },
  trustExtra: { verifiedDesc: "Identidade e atividade verificadas.", realReviewsDesc: "Apenas de serviços realizados.", noPaidRankingDesc: "Ninguém paga para aparecer primeiro.", freeForClientsDesc: "Pesquise e peça orçamento grátis." },
  finalCta: { title: "O seu próximo projeto começa comparando profissionais verificados", text: "Grátis para clientes. Sem classificações pagas. Apenas profissionais verificados que se destacam pelo seu trabalho." },
};
const es: HomeDict = {
  heroExtra: { avgRating: "Valoración media", meritDesc: "Solo mérito y reputación" },
  trustExtra: { verifiedDesc: "Identidad y actividad comprobadas.", realReviewsDesc: "Solo de servicios realizados.", noPaidRankingDesc: "Nadie paga por aparecer primero.", freeForClientsDesc: "Busca y pide presupuesto gratis." },
  finalCta: { title: "Tu próximo proyecto empieza comparando profesionales verificados", text: "Gratis para clientes. Sin rankings comprados. Solo profesionales verificados que destacan por su trabajo." },
};

export const homeDictionaries: Record<Locale, HomeDict> = {
  es, fr, it, pt, de, nl, en,
};
