import type { Metadata } from "next";
import { categories } from "@/lib/data/categories";
import { seedPlaces } from "@/lib/geo/places";
import type { Place } from "@/lib/geo/types";
import { contentDictionaries } from "@/lib/i18n/content";
import { locales, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";

export const indexablePlaces = seedPlaces.filter((place) => place.isIndexable);

export const openGraphLocales: Record<Locale, string> = {
  es: "es_ES",
  fr: "fr_FR",
  it: "it_IT",
  pt: "pt_PT",
  de: "de_DE",
  nl: "nl_NL",
  en: "en_GB",
};

export const primaryLocaleByCountry: Record<string, Locale> = {
  ES: "es",
  FR: "fr",
  IT: "it",
  PT: "pt",
  CH: "de",
  DE: "de",
  NL: "nl",
  BE: "nl",
  IE: "en",
  GB: "en",
};

export function placeRouteId(place: Place): string {
  return `${place.countryCode.toLowerCase()}-${place.slug}`;
}

export function getPlaceByRouteId(value: string): Place | undefined {
  return indexablePlaces.find((place) => placeRouteId(place) === value);
}

export function placeName(place: Place): string {
  return place.localityName || place.municipalityName || place.slug;
}

export function countryName(countryCode: string, locale: Locale): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
}

export function localityPath(locale: Locale, place: Place): string {
  return `/${locale}/professionals/${placeRouteId(place)}`;
}

export function localServicePath(locale: Locale, categorySlug: string, place: Place): string {
  return `/${locale}/services/${categorySlug}/${placeRouteId(place)}`;
}

export function localizedAlternates(pathForLocale: (locale: Locale) => string) {
  const languages = Object.fromEntries(locales.map((locale) => [locale, `${site.url}${pathForLocale(locale)}`]));
  return { ...languages, "x-default": `${site.url}${pathForLocale("en")}` };
}

const photoPool = [
  "/images/photos/ventanas.webp",
  "/images/photos/domotica.webp",
  "/images/photos/climatizacion.webp",
  "/images/photos/carpinteria.webp",
  "/images/photos/tejado.webp",
  "/images/photos/fachada.webp",
];

export function categorySeoImage(categoryId: string): string {
  const index = Math.max(0, categories.findIndex((category) => category.id === categoryId));
  return photoPool[index % photoPool.length];
}

export interface LocalSeoCopy {
  marketEyebrow: string;
  professionalsEyebrow: string;
  locationType: Record<"city" | "town" | "village" | "commune" | "other", string>;
  professionalsTitle: (place: string) => string;
  professionalsDescription: (place: string, country: string) => string;
  categoryTitle: (category: string, place: string) => string;
  categoryDescription: (category: string, place: string, country: string) => string;
  categoriesTitle: string;
  categoriesText: string;
  popularTitle: string;
  coverageTitle: string;
  coverageText: (place: string) => string;
  processTitle: string;
  process: string[];
  nearbyTitle: string;
  relatedTitle: string;
  search: string;
  map: string;
  publish: string;
  join: string;
  home: string;
  professionals: string;
  services: string;
  faqTitle: string;
  faqs: (category: string, place: string) => { q: string; a: string }[];
}

export const localSeoDictionaries: Record<Locale, LocalSeoCopy> = {
  es: {
    marketEyebrow: "Cobertura local RegiKaha", professionalsEyebrow: "Profesionales por localidad", locationType: { city: "Ciudad", town: "Municipio", village: "Pueblo", commune: "Comuna", other: "Localidad" },
    professionalsTitle: (place) => `Profesionales verificados en ${place}`,
    professionalsDescription: (place, country) => `Explora servicios de reformas, construcción, instalaciones y mantenimiento en ${place}, ${country}. Consulta la cobertura actual y publica tu proyecto gratis.`,
    categoryTitle: (category, place) => `${category} en ${place}: profesionales y presupuestos`,
    categoryDescription: (category, place, country) => `Encuentra servicios de ${category.toLowerCase()} en ${place}, ${country}. Compara cobertura, trabajos, precios orientativos y valoraciones cuando haya profesionales disponibles.`,
    categoriesTitle: "Servicios disponibles en esta localidad", categoriesText: "Abre una categoría para consultar cobertura, servicios habituales y profesionales disponibles en la zona.", popularTitle: "Servicios más solicitados", coverageTitle: "Cobertura transparente", coverageText: (place) => `RegiKaha muestra la oferta disponible en ${place}. Si todavía no hay suficientes profesionales, tu solicitud activa captación local sin inventar resultados.`, processTitle: "Cómo encontrar al profesional adecuado", process: ["Selecciona el servicio y describe el trabajo.", "Compara perfiles, portfolio, zona y valoraciones reales.", "Solicita un pre-presupuesto inicial no vinculante."], nearbyTitle: "Otras localidades del país", relatedTitle: "Otros servicios en la zona", search: "Comprobar cobertura", map: "Ver en el mapa", publish: "Publicar proyecto gratis", join: "Ofrecer servicios aquí", home: "Inicio", professionals: "Profesionales", services: "Servicios", faqTitle: "Preguntas frecuentes", faqs: (category, place) => [{ q: `¿Cómo encontrar ${category.toLowerCase()} en ${place}?`, a: "Consulta la cobertura actual, compara perfiles por mérito y publica tu necesidad para recibir respuestas cuando haya profesionales disponibles." }, { q: "¿Pedir un pre-presupuesto tiene coste?", a: "No. Publicar un proyecto y solicitar estimaciones iniciales es gratis para clientes." }, { q: "¿Los primeros importes son vinculantes?", a: "No. Son orientativos hasta que el profesional revise el alcance, las medidas, los materiales y las condiciones del trabajo." }],
  },
  fr: {
    marketEyebrow: "Couverture locale RegiKaha", professionalsEyebrow: "Professionnels par localité", locationType: { city: "Ville", town: "Commune", village: "Village", commune: "Commune", other: "Localité" },
    professionalsTitle: (place) => `Professionnels vérifiés à ${place}`,
    professionalsDescription: (place, country) => `Explorez les services de rénovation, construction, installation et maintenance à ${place}, ${country}. Vérifiez la couverture actuelle et publiez gratuitement votre projet.`,
    categoryTitle: (category, place) => `${category} à ${place} : professionnels et devis`,
    categoryDescription: (category, place, country) => `Trouvez des services de ${category.toLowerCase()} à ${place}, ${country}. Comparez la couverture, les réalisations, les prix indicatifs et les avis lorsque des professionnels sont disponibles.`,
    categoriesTitle: "Services dans cette localité", categoriesText: "Ouvrez une catégorie pour consulter la couverture, les prestations courantes et les professionnels disponibles dans la zone.", popularTitle: "Prestations les plus demandées", coverageTitle: "Une couverture transparente", coverageText: (place) => `RegiKaha affiche l'offre disponible à ${place}. Si elle est encore insuffisante, votre demande déclenche une prospection locale sans inventer de résultats.`, processTitle: "Comment trouver le bon professionnel", process: ["Choisissez le service et décrivez les travaux.", "Comparez les profils, portfolios, zones et avis réels.", "Demandez une première estimation sans engagement."], nearbyTitle: "Autres localités du pays", relatedTitle: "Autres services dans la zone", search: "Vérifier la couverture", map: "Voir sur la carte", publish: "Publier un projet gratuitement", join: "Proposer mes services ici", home: "Accueil", professionals: "Professionnels", services: "Services", faqTitle: "Questions fréquentes", faqs: (category, place) => [{ q: `Comment trouver un service de ${category.toLowerCase()} à ${place} ?`, a: "Consultez la couverture, comparez les profils selon leur mérite et publiez votre besoin pour recevoir des réponses lorsque des professionnels sont disponibles." }, { q: "La demande d'estimation est-elle gratuite ?", a: "Oui. La publication d'un projet et la demande d'une première estimation sont gratuites pour les clients." }, { q: "Les premiers montants sont-ils définitifs ?", a: "Non. Ils restent indicatifs jusqu'à la vérification du périmètre, des mesures, des matériaux et des conditions du chantier." }],
  },
  it: {
    marketEyebrow: "Copertura locale RegiKaha", professionalsEyebrow: "Professionisti per località", locationType: { city: "Città", town: "Comune", village: "Paese", commune: "Comune", other: "Località" },
    professionalsTitle: (place) => `Professionisti verificati a ${place}`,
    professionalsDescription: (place, country) => `Esplora servizi di ristrutturazione, edilizia, impianti e manutenzione a ${place}, ${country}. Controlla la copertura e pubblica gratuitamente il progetto.`,
    categoryTitle: (category, place) => `${category} a ${place}: professionisti e preventivi`,
    categoryDescription: (category, place, country) => `Trova servizi di ${category.toLowerCase()} a ${place}, ${country}. Confronta copertura, lavori, prezzi indicativi e recensioni quando sono disponibili professionisti.`,
    categoriesTitle: "Servizi in questa località", categoriesText: "Apri una categoria per consultare copertura, interventi comuni e professionisti disponibili nella zona.", popularTitle: "Servizi più richiesti", coverageTitle: "Copertura trasparente", coverageText: (place) => `RegiKaha mostra l'offerta disponibile a ${place}. Se non è ancora sufficiente, la richiesta attiva la ricerca locale senza inventare risultati.`, processTitle: "Come trovare il professionista giusto", process: ["Scegli il servizio e descrivi il lavoro.", "Confronta profili, portfolio, zone e recensioni reali.", "Richiedi una stima iniziale non vincolante."], nearbyTitle: "Altre località del paese", relatedTitle: "Altri servizi nella zona", search: "Controlla la copertura", map: "Vedi sulla mappa", publish: "Pubblica progetto gratis", join: "Offri servizi qui", home: "Home", professionals: "Professionisti", services: "Servizi", faqTitle: "Domande frequenti", faqs: (category, place) => [{ q: `Come trovare servizi di ${category.toLowerCase()} a ${place}?`, a: "Controlla la copertura, confronta i profili per merito e pubblica la richiesta per ricevere risposte quando ci sono professionisti disponibili." }, { q: "Richiedere una stima costa?", a: "No. Pubblicare un progetto e richiedere stime iniziali è gratuito per i clienti." }, { q: "Gli importi iniziali sono vincolanti?", a: "No. Sono indicativi finché il professionista non verifica ambito, misure, materiali e condizioni del lavoro." }],
  },
  pt: {
    marketEyebrow: "Cobertura local RegiKaha", professionalsEyebrow: "Profissionais por localidade", locationType: { city: "Cidade", town: "Município", village: "Vila", commune: "Comuna", other: "Localidade" },
    professionalsTitle: (place) => `Profissionais verificados em ${place}`,
    professionalsDescription: (place, country) => `Explore serviços de renovação, construção, instalações e manutenção em ${place}, ${country}. Consulte a cobertura atual e publique o projeto gratuitamente.`,
    categoryTitle: (category, place) => `${category} em ${place}: profissionais e orçamentos`,
    categoryDescription: (category, place, country) => `Encontre serviços de ${category.toLowerCase()} em ${place}, ${country}. Compare cobertura, trabalhos, preços indicativos e avaliações quando existirem profissionais disponíveis.`,
    categoriesTitle: "Serviços nesta localidade", categoriesText: "Abra uma categoria para consultar cobertura, serviços habituais e profissionais disponíveis na zona.", popularTitle: "Serviços mais procurados", coverageTitle: "Cobertura transparente", coverageText: (place) => `A RegiKaha mostra a oferta disponível em ${place}. Se ainda for insuficiente, o seu pedido ativa captação local sem inventar resultados.`, processTitle: "Como encontrar o profissional certo", process: ["Escolha o serviço e descreva o trabalho.", "Compare perfis, portefólios, zonas e avaliações reais.", "Peça uma estimativa inicial não vinculativa."], nearbyTitle: "Outras localidades do país", relatedTitle: "Outros serviços na zona", search: "Verificar cobertura", map: "Ver no mapa", publish: "Publicar projeto grátis", join: "Oferecer serviços aqui", home: "Início", professionals: "Profissionais", services: "Serviços", faqTitle: "Perguntas frequentes", faqs: (category, place) => [{ q: `Como encontrar serviços de ${category.toLowerCase()} em ${place}?`, a: "Consulte a cobertura, compare perfis por mérito e publique a necessidade para receber respostas quando houver profissionais disponíveis." }, { q: "Pedir uma estimativa tem custo?", a: "Não. Publicar um projeto e pedir estimativas iniciais é gratuito para clientes." }, { q: "Os valores iniciais são vinculativos?", a: "Não. São indicativos até o profissional verificar o âmbito, as medidas, os materiais e as condições do trabalho." }],
  },
  de: {
    marketEyebrow: "Lokale RegiKaha-Abdeckung", professionalsEyebrow: "Fachbetriebe nach Ort", locationType: { city: "Stadt", town: "Gemeinde", village: "Dorf", commune: "Gemeinde", other: "Ort" },
    professionalsTitle: (place) => `Verifizierte Fachbetriebe in ${place}`,
    professionalsDescription: (place, country) => `Entdecken Sie Renovierungs-, Bau-, Installations- und Wartungsleistungen in ${place}, ${country}. Prüfen Sie die aktuelle Abdeckung und veröffentlichen Sie Ihr Projekt kostenlos.`,
    categoryTitle: (category, place) => `${category} in ${place}: Fachbetriebe und Angebote`,
    categoryDescription: (category, place, country) => `Finden Sie ${category}-Leistungen in ${place}, ${country}. Vergleichen Sie Abdeckung, Referenzen, Richtpreise und Bewertungen, sobald Fachbetriebe verfügbar sind.`,
    categoriesTitle: "Leistungen an diesem Ort", categoriesText: "Öffnen Sie eine Kategorie, um Abdeckung, typische Leistungen und verfügbare Fachbetriebe in der Region zu prüfen.", popularTitle: "Häufig gefragte Leistungen", coverageTitle: "Transparente Abdeckung", coverageText: (place) => `RegiKaha zeigt das verfügbare Angebot in ${place}. Reicht es noch nicht aus, löst Ihre Anfrage eine lokale Akquise aus, ohne Ergebnisse vorzutäuschen.`, processTitle: "So finden Sie den passenden Fachbetrieb", process: ["Wählen Sie die Leistung und beschreiben Sie das Vorhaben.", "Vergleichen Sie Profile, Referenzen, Einsatzgebiete und echte Bewertungen.", "Fordern Sie eine unverbindliche Ersteinschätzung an."], nearbyTitle: "Weitere Orte im Land", relatedTitle: "Weitere Leistungen in der Region", search: "Abdeckung prüfen", map: "Auf der Karte ansehen", publish: "Projekt kostenlos einstellen", join: "Hier Leistungen anbieten", home: "Startseite", professionals: "Fachbetriebe", services: "Leistungen", faqTitle: "Häufige Fragen", faqs: (category, place) => [{ q: `Wie finde ich ${category}-Leistungen in ${place}?`, a: "Prüfen Sie die Abdeckung, vergleichen Sie Profile nach Leistung und veröffentlichen Sie Ihre Anfrage, um Antworten verfügbarer Fachbetriebe zu erhalten." }, { q: "Kostet eine Ersteinschätzung etwas?", a: "Nein. Das Einstellen eines Projekts und die Anfrage einer ersten Einschätzung sind für Kunden kostenlos." }, { q: "Sind erste Preisangaben verbindlich?", a: "Nein. Sie sind Richtwerte, bis Umfang, Maße, Materialien und Arbeitsbedingungen geprüft wurden." }],
  },
  nl: {
    marketEyebrow: "Lokale RegiKaha-dekking", professionalsEyebrow: "Vakmensen per plaats", locationType: { city: "Stad", town: "Gemeente", village: "Dorp", commune: "Gemeente", other: "Plaats" },
    professionalsTitle: (place) => `Geverifieerde vakmensen in ${place}`,
    professionalsDescription: (place, country) => `Ontdek renovatie-, bouw-, installatie- en onderhoudsdiensten in ${place}, ${country}. Bekijk de actuele dekking en publiceer je project gratis.`,
    categoryTitle: (category, place) => `${category} in ${place}: vakmensen en offertes`,
    categoryDescription: (category, place, country) => `Vind diensten voor ${category.toLowerCase()} in ${place}, ${country}. Vergelijk dekking, werk, richtprijzen en beoordelingen zodra vakmensen beschikbaar zijn.`,
    categoriesTitle: "Diensten in deze plaats", categoriesText: "Open een categorie om de dekking, gangbare werkzaamheden en beschikbare vakmensen in de regio te bekijken.", popularTitle: "Meest gevraagde diensten", coverageTitle: "Transparante dekking", coverageText: (place) => `RegiKaha toont het beschikbare aanbod in ${place}. Is dat nog onvoldoende, dan activeert je aanvraag lokale werving zonder resultaten te verzinnen.`, processTitle: "Zo vind je de juiste vakman", process: ["Kies de dienst en beschrijf het werk.", "Vergelijk profielen, portfolio's, werkgebieden en echte beoordelingen.", "Vraag een vrijblijvende eerste raming aan."], nearbyTitle: "Andere plaatsen in het land", relatedTitle: "Andere diensten in de regio", search: "Dekking bekijken", map: "Op de kaart bekijken", publish: "Project gratis publiceren", join: "Hier diensten aanbieden", home: "Home", professionals: "Vakmensen", services: "Diensten", faqTitle: "Veelgestelde vragen", faqs: (category, place) => [{ q: `Hoe vind ik ${category.toLowerCase()} in ${place}?`, a: "Bekijk de dekking, vergelijk profielen op kwaliteit en publiceer je aanvraag om reacties te ontvangen wanneer vakmensen beschikbaar zijn." }, { q: "Kost een eerste raming geld?", a: "Nee. Een project publiceren en eerste ramingen aanvragen is gratis voor klanten." }, { q: "Zijn eerste bedragen bindend?", a: "Nee. Het zijn richtbedragen totdat omvang, maten, materialen en werkomstandigheden zijn gecontroleerd." }],
  },
  en: {
    marketEyebrow: "Local RegiKaha coverage", professionalsEyebrow: "Professionals by location", locationType: { city: "City", town: "Town", village: "Village", commune: "Municipality", other: "Location" },
    professionalsTitle: (place) => `Verified professionals in ${place}`,
    professionalsDescription: (place, country) => `Explore renovation, construction, installation and maintenance services in ${place}, ${country}. Check current coverage and publish your project for free.`,
    categoryTitle: (category, place) => `${category} in ${place}: professionals and quotes`,
    categoryDescription: (category, place, country) => `Find ${category.toLowerCase()} services in ${place}, ${country}. Compare coverage, previous work, indicative prices and reviews when professionals are available.`,
    categoriesTitle: "Services in this location", categoriesText: "Open a category to check coverage, common services and professionals available in the area.", popularTitle: "Most requested services", coverageTitle: "Transparent coverage", coverageText: (place) => `RegiKaha shows the supply available in ${place}. If there are not enough professionals yet, your request activates local acquisition without inventing results.`, processTitle: "How to find the right professional", process: ["Choose the service and describe the work.", "Compare profiles, portfolios, service areas and real reviews.", "Request a non-binding initial estimate."], nearbyTitle: "Other locations in the country", relatedTitle: "Other services in the area", search: "Check coverage", map: "View on the map", publish: "Publish a project for free", join: "Offer services here", home: "Home", professionals: "Professionals", services: "Services", faqTitle: "Frequently asked questions", faqs: (category, place) => [{ q: `How do I find ${category.toLowerCase()} services in ${place}?`, a: "Check current coverage, compare profiles by merit and publish your requirement to receive responses when professionals are available." }, { q: "Does an initial estimate cost anything?", a: "No. Publishing a project and requesting initial estimates is free for clients." }, { q: "Are initial prices binding?", a: "No. They are indicative until the professional checks scope, measurements, materials and working conditions." }],
  },
};

export function localizedMetadata(options: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image: string;
  alternatePath: (locale: Locale) => string;
}): Metadata {
  const url = `${site.url}${options.path}`;
  return {
    title: options.title,
    description: options.description,
    alternates: { canonical: url, languages: localizedAlternates(options.alternatePath) },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: options.title,
      description: options.description,
      url,
      locale: openGraphLocales[options.locale],
      alternateLocale: locales.filter((locale) => locale !== options.locale).map((locale) => openGraphLocales[locale]),
      images: [{ url: options.image, alt: options.title }],
    },
    twitter: { card: "summary_large_image", title: options.title, description: options.description, images: [options.image] },
  };
}

export function localizedCategory(locale: Locale, categoryId: string) {
  return contentDictionaries[locale].categories[categoryId];
}
