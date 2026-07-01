import { contentDictionaries } from "../lib/i18n/content";
import { isLocale, type Locale } from "../lib/i18n/config";

const countryLocales: Record<string, Locale[]> = {
  ES: ["es"],
  FR: ["fr"],
  IT: ["it"],
  PT: ["pt"],
  DE: ["de"],
  NL: ["nl"],
  BE: ["nl", "fr", "de"],
  CH: ["de", "fr", "it"],
  IE: ["en"],
  GB: ["en"],
};

const intlLocales: Record<Locale, string> = {
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
  de: "de-DE",
  nl: "nl-NL",
  en: "en-GB",
};

type ProfileCopy = {
  activeMarkets: string;
  verifiedProfessional: string;
  projects: string;
  years: string;
  from: string;
  rating: string;
  about: string;
  operationArea: string;
  services: string;
  portfolio: string;
  quoteTitle: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  project: string;
  disclaimer: string;
  submit: string;
  sent: string;
  sendError: string;
  serviceProfessional: string;
  timeToConfirm: string;
  includes: string;
  excludes: string;
  process: string;
  visitDefault: string;
  serviceDisclaimer: string;
  respondsIn: (hours: unknown) => string;
  titleProfile: (name: string, area: string) => string;
  titleService: (service: string, area: string, professional: string) => string;
};

const copy: Record<Locale, ProfileCopy> = {
  es: {
    activeMarkets: "mercados activos",
    verifiedProfessional: "Profesional verificado",
    projects: "Proyectos",
    years: "Años",
    from: "Desde",
    rating: "Valoración",
    about: "Sobre",
    operationArea: "Zona de operación",
    services: "Servicios",
    portfolio: "Trabajos realizados",
    quoteTitle: "Pide pre-presupuesto gratis",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    city: "Ciudad",
    country: "País",
    project: "Proyecto",
    disclaimer: "Los pre-presupuestos son estimaciones iniciales no vinculantes. El precio final puede variar tras visita técnica, mediciones, materiales, permisos o revisión del estado real.",
    submit: "Enviar solicitud",
    sent: "Solicitud enviada correctamente.",
    sendError: "No se pudo enviar",
    serviceProfessional: "Servicio profesional",
    timeToConfirm: "Tiempo a concretar",
    includes: "Incluye",
    excludes: "No incluye",
    process: "Proceso",
    visitDefault: "Se concreta en la visita o primera valoración.",
    serviceDisclaimer: "Estimación inicial no vinculante. El precio definitivo puede variar tras visita técnica, mediciones, materiales, permisos o revisión real del trabajo.",
    respondsIn: (hours) => `responde en ${hours || 24} h`,
    titleProfile: (name, area) => `${name} - profesional verificado en ${area} | Regi Kaha`,
    titleService: (service, area, professional) => `${service} en ${area} | ${professional} | Regi Kaha`,
  },
  fr: {
    activeMarkets: "marchés actifs",
    verifiedProfessional: "Professionnel vérifié",
    projects: "Projets",
    years: "Années",
    from: "À partir de",
    rating: "Note",
    about: "À propos de",
    operationArea: "Zone d'intervention",
    services: "Services",
    portfolio: "Réalisations",
    quoteTitle: "Demander une première estimation gratuite",
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    city: "Ville",
    country: "Pays",
    project: "Projet",
    disclaimer: "Les premières estimations sont indicatives et sans engagement. Le prix final peut varier après visite technique, mesures, matériaux, autorisations ou examen de l'état réel.",
    submit: "Envoyer la demande",
    sent: "Demande envoyée correctement.",
    sendError: "La demande n'a pas pu être envoyée",
    serviceProfessional: "Service professionnel",
    timeToConfirm: "Délai à confirmer",
    includes: "Inclus",
    excludes: "Non inclus",
    process: "Processus",
    visitDefault: "Précisé lors de la visite ou de la première évaluation.",
    serviceDisclaimer: "Estimation initiale non contraignante. Le prix définitif peut varier après visite technique, mesures, matériaux, autorisations ou vérification réelle du travail.",
    respondsIn: (hours) => `répond sous ${hours || 24} h`,
    titleProfile: (name, area) => `${name} - professionnel vérifié à ${area} | Regi Kaha`,
    titleService: (service, area, professional) => `${service} à ${area} | ${professional} | Regi Kaha`,
  },
  it: {
    activeMarkets: "mercati attivi",
    verifiedProfessional: "Professionista verificato",
    projects: "Progetti",
    years: "Anni",
    from: "Da",
    rating: "Valutazione",
    about: "Informazioni su",
    operationArea: "Area operativa",
    services: "Servizi",
    portfolio: "Lavori realizzati",
    quoteTitle: "Richiedi una stima iniziale gratuita",
    name: "Nome",
    email: "Email",
    phone: "Telefono",
    city: "Città",
    country: "Paese",
    project: "Progetto",
    disclaimer: "Le stime iniziali sono indicative e non vincolanti. Il prezzo finale può variare dopo sopralluogo tecnico, misurazioni, materiali, permessi o verifica dello stato reale.",
    submit: "Invia richiesta",
    sent: "Richiesta inviata correttamente.",
    sendError: "Impossibile inviare",
    serviceProfessional: "Servizio professionale",
    timeToConfirm: "Tempi da confermare",
    includes: "Include",
    excludes: "Non include",
    process: "Processo",
    visitDefault: "Si definisce durante il sopralluogo o la prima valutazione.",
    serviceDisclaimer: "Stima iniziale non vincolante. Il prezzo definitivo può variare dopo sopralluogo tecnico, misurazioni, materiali, permessi o verifica reale del lavoro.",
    respondsIn: (hours) => `risponde in ${hours || 24} h`,
    titleProfile: (name, area) => `${name} - professionista verificato a ${area} | Regi Kaha`,
    titleService: (service, area, professional) => `${service} a ${area} | ${professional} | Regi Kaha`,
  },
  pt: {
    activeMarkets: "mercados ativos",
    verifiedProfessional: "Profissional verificado",
    projects: "Projetos",
    years: "Anos",
    from: "Desde",
    rating: "Avaliação",
    about: "Sobre",
    operationArea: "Zona de operação",
    services: "Serviços",
    portfolio: "Trabalhos realizados",
    quoteTitle: "Pedir estimativa inicial grátis",
    name: "Nome",
    email: "Email",
    phone: "Telefone",
    city: "Cidade",
    country: "País",
    project: "Projeto",
    disclaimer: "As estimativas iniciais são indicativas e não vinculativas. O preço final pode variar após visita técnica, medições, materiais, licenças ou revisão do estado real.",
    submit: "Enviar pedido",
    sent: "Pedido enviado corretamente.",
    sendError: "Não foi possível enviar",
    serviceProfessional: "Serviço profissional",
    timeToConfirm: "Prazo a confirmar",
    includes: "Inclui",
    excludes: "Não inclui",
    process: "Processo",
    visitDefault: "Define-se na visita ou primeira avaliação.",
    serviceDisclaimer: "Estimativa inicial não vinculativa. O preço definitivo pode variar após visita técnica, medições, materiais, licenças ou revisão real do trabalho.",
    respondsIn: (hours) => `responde em ${hours || 24} h`,
    titleProfile: (name, area) => `${name} - profissional verificado em ${area} | Regi Kaha`,
    titleService: (service, area, professional) => `${service} em ${area} | ${professional} | Regi Kaha`,
  },
  de: {
    activeMarkets: "aktive Märkte",
    verifiedProfessional: "Verifizierter Fachbetrieb",
    projects: "Projekte",
    years: "Jahre",
    from: "Ab",
    rating: "Bewertung",
    about: "Über",
    operationArea: "Einsatzgebiet",
    services: "Leistungen",
    portfolio: "Ausgeführte Arbeiten",
    quoteTitle: "Kostenlose Ersteinschätzung anfragen",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    city: "Stadt",
    country: "Land",
    project: "Projekt",
    disclaimer: "Ersteinschätzungen sind unverbindliche Richtwerte. Der Endpreis kann sich nach technischer Besichtigung, Aufmaß, Materialien, Genehmigungen oder Prüfung des tatsächlichen Zustands ändern.",
    submit: "Anfrage senden",
    sent: "Anfrage erfolgreich gesendet.",
    sendError: "Anfrage konnte nicht gesendet werden",
    serviceProfessional: "Professionelle Leistung",
    timeToConfirm: "Zeit noch zu bestätigen",
    includes: "Enthält",
    excludes: "Nicht enthalten",
    process: "Ablauf",
    visitDefault: "Wird beim Termin oder bei der ersten Bewertung konkretisiert.",
    serviceDisclaimer: "Unverbindliche Ersteinschätzung. Der endgültige Preis kann sich nach technischer Besichtigung, Aufmaß, Materialien, Genehmigungen oder realer Prüfung der Arbeit ändern.",
    respondsIn: (hours) => `antwortet in ${hours || 24} Std.`,
    titleProfile: (name, area) => `${name} - verifizierter Fachbetrieb in ${area} | Regi Kaha`,
    titleService: (service, area, professional) => `${service} in ${area} | ${professional} | Regi Kaha`,
  },
  nl: {
    activeMarkets: "actieve markten",
    verifiedProfessional: "Geverifieerde professional",
    projects: "Projecten",
    years: "Jaren",
    from: "Vanaf",
    rating: "Beoordeling",
    about: "Over",
    operationArea: "Werkgebied",
    services: "Diensten",
    portfolio: "Uitgevoerd werk",
    quoteTitle: "Vraag gratis een eerste raming aan",
    name: "Naam",
    email: "E-mail",
    phone: "Telefoon",
    city: "Stad",
    country: "Land",
    project: "Project",
    disclaimer: "Eerste ramingen zijn indicatief en niet bindend. De eindprijs kan wijzigen na technische opname, metingen, materialen, vergunningen of controle van de werkelijke staat.",
    submit: "Aanvraag verzenden",
    sent: "Aanvraag correct verzonden.",
    sendError: "Verzenden is mislukt",
    serviceProfessional: "Professionele dienst",
    timeToConfirm: "Tijd te bevestigen",
    includes: "Inbegrepen",
    excludes: "Niet inbegrepen",
    process: "Proces",
    visitDefault: "Wordt bepaald tijdens het bezoek of de eerste beoordeling.",
    serviceDisclaimer: "Niet-bindende eerste raming. De definitieve prijs kan wijzigen na technische opname, metingen, materialen, vergunningen of echte controle van het werk.",
    respondsIn: (hours) => `antwoordt binnen ${hours || 24} u`,
    titleProfile: (name, area) => `${name} - geverifieerde professional in ${area} | Regi Kaha`,
    titleService: (service, area, professional) => `${service} in ${area} | ${professional} | Regi Kaha`,
  },
  en: {
    activeMarkets: "active markets",
    verifiedProfessional: "Verified professional",
    projects: "Projects",
    years: "Years",
    from: "From",
    rating: "Rating",
    about: "About",
    operationArea: "Operating area",
    services: "Services",
    portfolio: "Completed work",
    quoteTitle: "Request a free initial estimate",
    name: "Name",
    email: "Email",
    phone: "Phone",
    city: "City",
    country: "Country",
    project: "Project",
    disclaimer: "Initial estimates are non-binding indications. The final price may change after a technical visit, measurements, materials, permits or review of the real condition.",
    submit: "Send request",
    sent: "Request sent successfully.",
    sendError: "Could not send",
    serviceProfessional: "Professional service",
    timeToConfirm: "Time to confirm",
    includes: "Includes",
    excludes: "Excludes",
    process: "Process",
    visitDefault: "Confirmed during the visit or first assessment.",
    serviceDisclaimer: "Non-binding initial estimate. The final price may change after a technical visit, measurements, materials, permits or real review of the job.",
    respondsIn: (hours) => `replies in ${hours || 24} h`,
    titleProfile: (name, area) => `${name} - verified professional in ${area} | Regi Kaha`,
    titleService: (service, area, professional) => `${service} in ${area} | ${professional} | Regi Kaha`,
  },
};

function acceptedLanguages(request: Request): Locale[] {
  return String(request.headers.get("Accept-Language") || "")
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())
    .filter((locale, index, list): locale is Locale => isLocale(locale) && list.indexOf(locale) === index);
}

function cookieLocale(request: Request): Locale | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)regikaha-locale=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : "";
  return isLocale(value) ? value : null;
}

export function detectPublicLocale(request: Request): Locale {
  const url = new URL(request.url);
  const queryLocale = url.searchParams.get("lang");
  if (queryLocale && isLocale(queryLocale)) return queryLocale;
  const fromCookie = cookieLocale(request);
  if (fromCookie) return fromCookie;
  const country = String((request as any).cf?.country || request.headers.get("CF-IPCountry") || "").toUpperCase();
  const preferred = acceptedLanguages(request);
  const allowed = countryLocales[country] || [];
  return preferred.find((candidate) => allowed.includes(candidate)) || allowed[0] || preferred[0] || "en";
}

export function publicProfileCopy(locale: Locale): ProfileCopy {
  return copy[locale];
}

export function publicMoney(value: unknown, locale: Locale, currency = "EUR"): string {
  return new Intl.NumberFormat(intlLocales[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function localizedCategoryLabel(locale: Locale, categoryId: string): string {
  return contentDictionaries[locale]?.categories?.[categoryId]?.name || categoryId;
}

export function publicHtmlHeaders(locale: Locale): Headers {
  return new Headers({
    "content-type": "text/html; charset=utf-8",
    "content-language": locale,
    "Cache-Control": "private, max-age=120",
    Vary: "Accept-Language, CF-IPCountry, Cookie",
  });
}
