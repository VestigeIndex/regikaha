import type { Locale } from "./config";

/**
 * Diccionarios de Regi Kaha. `en` define la FORMA del diccionario; todos los
 * demás idiomas se tipan como `Dictionary`, por lo que TypeScript obliga a que
 * cada idioma tenga TODAS las claves (sin fallback). Al añadir una clave nueva,
 * el build falla hasta traducirla en los 7 idiomas activos.
 */
const en = {
  nav: {
    search: "Find professionals",
    categories: "Categories",
    howItWorks: "How it works",
    forPros: "For professionals",
    pricing: "Pricing",
  },
  actions: {
    search: "Search",
    imPro: "I'm a professional",
    requestQuote: "Request an initial estimate",
    viewProfile: "View profile",
    viewAll: "View all",
    joinPro: "Join as a professional",
  },
  hero: {
    eyebrow: "Verified professionals in selected European markets",
    title: "Find verified professionals and subcontractors for renovations, works and installations",
    subtitle:
      "Publish your project for free, receive non-binding initial estimates, compare professionals on the map and confirm the final quote before hiring.",
  },
  searchBar: { what: "What do you need?", where: "Where?", category: "Category", button: "Search" },
  trust: {
    verified: "Verified professionals",
    realReviews: "Real reviews",
    noPaidRanking: "No paid rankings",
    freeForClients: "Free for clients",
  },
  lang: { label: "Language" },
  footer: {
    tagline:
      "Marketplace for verified professionals in selected European markets. Ranked on merit, never on payment.",
    rights: "All rights reserved.",
  },
};

export type Dictionary = typeof en;





const nl: Dictionary = {
  nav: { search: "Vakmensen vinden", categories: "Categorieën", howItWorks: "Hoe het werkt", forPros: "Voor vakmensen", pricing: "Prijzen" },
  actions: { search: "Zoeken", imPro: "Ik ben vakman", requestQuote: "Offerte aanvragen", viewProfile: "Profiel bekijken", viewAll: "Alles bekijken", joinPro: "Word vakman" },
  hero: { eyebrow: "Geverifieerde vakmensen in geselecteerde Europese markten", title: "Vergelijk geverifieerde vakmensen voor renovaties en technische diensten", subtitle: "Vind renovatiebedrijven, technici, installateurs, architecten en ingenieurs op prijs, kwaliteit, werkgebied, portfolio en echte beoordelingen." },
  searchBar: { what: "Wat heeft u nodig?", where: "Waar?", category: "Categorie", button: "Zoeken" },
  trust: { verified: "Geverifieerde vakmensen", realReviews: "Echte beoordelingen", noPaidRanking: "Geen betaalde rankings", freeForClients: "Gratis voor klanten" },
  lang: { label: "Taal" },
  footer: { tagline: "Marktplaats voor geverifieerde vakmensen in geselecteerde Europese markten. Gerangschikt op verdienste, nooit op betaling.", rights: "Alle rechten voorbehouden." },
};



const fr: Dictionary = {
  nav: { search: "Trouver des professionnels", categories: "Catégories", howItWorks: "Comment ça marche", forPros: "Pour les professionnels", pricing: "Tarifs" },
  actions: { search: "Rechercher", imPro: "Je suis un professionnel", requestQuote: "Demander un devis", viewProfile: "Voir le profil", viewAll: "Voir tout", joinPro: "Devenir professionnel" },
  hero: { eyebrow: "Professionnels vérifiés dans des marchés européens sélectionnés", title: "Comparez des professionnels vérifiés pour vos rénovations et services techniques", subtitle: "Trouvez des entreprises de rénovation, des techniciens, des installateurs, des architectes et des ingénieurs selon le prix, la qualité, la zone d'intervention, le portfolio et de vrais avis." },
  searchBar: { what: "De quoi avez-vous besoin ?", where: "Où ?", category: "Catégorie", button: "Rechercher" },
  trust: { verified: "Professionnels vérifiés", realReviews: "Avis réels", noPaidRanking: "Aucun classement payant", freeForClients: "Gratuit pour les clients" },
  lang: { label: "Langue" },
  footer: { tagline: "Place de marché de professionnels vérifiés dans des marchés européens sélectionnés. Classement au mérite, jamais payant.", rights: "Tous droits réservés." },
};

const de: Dictionary = {
  nav: { search: "Fachleute finden", categories: "Kategorien", howItWorks: "So funktioniert's", forPros: "Für Fachleute", pricing: "Preise" },
  actions: { search: "Suchen", imPro: "Ich bin Fachmann", requestQuote: "Angebot anfordern", viewProfile: "Profil ansehen", viewAll: "Alle ansehen", joinPro: "Als Fachmann beitreten" },
  hero: { eyebrow: "Verifizierte Fachleute in ausgewählten europäischen Märkten", title: "Vergleichen Sie verifizierte Fachleute für Renovierungen und technische Dienstleistungen", subtitle: "Finden Sie Renovierungsfirmen, Techniker, Installateure, Architekten und Ingenieure nach Preis, Qualität, Einsatzgebiet, Portfolio und echten Bewertungen." },
  searchBar: { what: "Was brauchen Sie?", where: "Wo?", category: "Kategorie", button: "Suchen" },
  trust: { verified: "Verifizierte Fachleute", realReviews: "Echte Bewertungen", noPaidRanking: "Keine bezahlten Rankings", freeForClients: "Kostenlos für Kunden" },
  lang: { label: "Sprache" },
  footer: { tagline: "Marktplatz für verifizierte Fachleute in ausgewählten europäischen Märkten. Ranking nach Leistung, niemals nach Bezahlung.", rights: "Alle Rechte vorbehalten." },
};




const it: Dictionary = {
  nav: { search: "Trova professionisti", categories: "Categorie", howItWorks: "Come funziona", forPros: "Per i professionisti", pricing: "Prezzi" },
  actions: { search: "Cerca", imPro: "Sono un professionista", requestQuote: "Richiedi un preventivo", viewProfile: "Vedi profilo", viewAll: "Vedi tutti", joinPro: "Unisciti come professionista" },
  hero: { eyebrow: "Professionisti verificati in mercati europei selezionati", title: "Confronta professionisti verificati per ristrutturazioni e servizi tecnici", subtitle: "Trova imprese di ristrutturazione, tecnici, installatori, architetti e ingegneri per prezzo, qualità, zona di servizio, portfolio e recensioni reali." },
  searchBar: { what: "Di cosa hai bisogno?", where: "Dove?", category: "Categoria", button: "Cerca" },
  trust: { verified: "Professionisti verificati", realReviews: "Recensioni reali", noPaidRanking: "Nessun posizionamento a pagamento", freeForClients: "Gratis per i clienti" },
  lang: { label: "Lingua" },
  footer: { tagline: "Marketplace di professionisti verificati in mercati europei selezionati. Classifica per merito, mai a pagamento.", rights: "Tutti i diritti riservati." },
};





const pt: Dictionary = {
  nav: { search: "Encontrar profissionais", categories: "Categorias", howItWorks: "Como funciona", forPros: "Para profissionais", pricing: "Preços" },
  actions: { search: "Pesquisar", imPro: "Sou profissional", requestQuote: "Pedir orçamento", viewProfile: "Ver perfil", viewAll: "Ver todos", joinPro: "Juntar-me como profissional" },
  hero: { eyebrow: "Profissionais verificados em mercados europeus selecionados", title: "Compare profissionais verificados para remodelações e serviços técnicos", subtitle: "Encontre empresas de remodelação, técnicos, instaladores, arquitetos e engenheiros por preço, qualidade, área de serviço, portefólio e avaliações reais." },
  searchBar: { what: "Do que precisa?", where: "Onde?", category: "Categoria", button: "Pesquisar" },
  trust: { verified: "Profissionais verificados", realReviews: "Avaliações reais", noPaidRanking: "Sem classificações pagas", freeForClients: "Grátis para clientes" },
  lang: { label: "Idioma" },
  footer: { tagline: "Mercado de profissionais verificados em mercados europeus selecionados. Classificação por mérito, nunca por pagamento.", rights: "Todos os direitos reservados." },
};




const es: Dictionary = {
  nav: { search: "Buscar profesionales", categories: "Categorías", howItWorks: "Cómo funciona", forPros: "Para profesionales", pricing: "Precios" },
  actions: { search: "Buscar", imPro: "Soy profesional", requestQuote: "Pedir pre-presupuesto", viewProfile: "Ver perfil", viewAll: "Ver todos", joinPro: "Unirme como profesional" },
  hero: { eyebrow: "Profesionales y subcontratas verificadas en mercados activos", title: "Encuentra profesionales y subcontratas verificadas para reformas, obras e instalaciones", subtitle: "Publica tu proyecto gratis, recibe pre-presupuestos iniciales, compara profesionales en el mapa y confirma el presupuesto definitivo antes de contratar." },
  searchBar: { what: "¿Qué necesitas?", where: "¿Dónde?", category: "Categoría", button: "Buscar" },
  trust: { verified: "Profesionales verificados", realReviews: "Valoraciones reales", noPaidRanking: "Sin rankings comprados", freeForClients: "Gratis para clientes" },
  lang: { label: "Idioma" },
  footer: { tagline: "Marketplace de profesionales verificados en mercados europeos seleccionados. Posicionamiento por mérito, nunca por pago.", rights: "Todos los derechos reservados." },
};


export const dictionaries: Record<Locale, Dictionary> = {
  es, fr, it, pt, de, nl, en,
};
