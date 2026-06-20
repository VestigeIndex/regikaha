import type { Category } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";

export const tradeCategoryIds = [
  "cerrajeria-cerramientos",
  "suelos-pladur",
  "jardineria-piscinas",
  "limpieza-saneamiento",
  "seguridad-telecomunicaciones",
  "reparaciones-electrodomesticos",
  "mudanzas-vaciados",
  "metal-demoliciones",
  "ascensores-incendios",
] as const;
type TradeId = (typeof tradeCategoryIds)[number];

type TradeCopy = { name: string; noun: string; plural: string; services: [string, string, string] };

const copies: Record<Locale, Record<TradeId, TradeCopy>> = {
  es: {
    "cerrajeria-cerramientos": { name: "Cerrajeros, cristaleros y cerramientos", noun: "especialista en cerrajería y cerramientos", plural: "cerrajeros-cristaleros-cerramientos", services: ["Apertura y cambio de cerraduras", "Cristalería a medida", "Ventanas y cerramientos"] },
    "suelos-pladur": { name: "Suelos, alicatados, yeso y pladur", noun: "especialista en suelos y pladur", plural: "suelos-alicatados-pladur", services: ["Colocación de parquet y tarima", "Alicatado y pavimentos", "Tabiques y techos de pladur"] },
    "jardineria-piscinas": { name: "Jardinería, piscinas y exteriores", noun: "especialista en exteriores", plural: "jardineros-piscinas-exteriores", services: ["Diseño y mantenimiento de jardines", "Construcción y reparación de piscinas", "Riego, poda y paisajismo"] },
    "limpieza-saneamiento": { name: "Limpieza, plagas y saneamiento", noun: "especialista en limpieza y saneamiento", plural: "limpieza-plagas-saneamiento", services: ["Limpieza profesional y fin de obra", "Control de plagas", "Pocería y desatascos"] },
    "seguridad-telecomunicaciones": { name: "Seguridad, telecomunicaciones y domótica", noun: "instalador de seguridad y telecomunicaciones", plural: "seguridad-telecomunicaciones-domotica", services: ["Alarmas y videovigilancia", "Antenas, redes y fibra", "Domótica y control de accesos"] },
    "reparaciones-electrodomesticos": { name: "Reparación de electrodomésticos", noun: "técnico de electrodomésticos", plural: "tecnicos-electrodomesticos", services: ["Reparación de lavadoras", "Hornos, frigoríficos y lavavajillas", "Instalación de electrodomésticos"] },
    "mudanzas-vaciados": { name: "Mudanzas, vaciados y gestión de residuos", noun: "empresa de mudanzas y vaciados", plural: "mudanzas-vaciados-residuos", services: ["Mudanza de vivienda u oficina", "Vaciado de pisos y locales", "Retirada y gestión de residuos"] },
    "metal-demoliciones": { name: "Soldadura, metal, demoliciones y excavaciones", noun: "especialista en metal y obra pesada", plural: "soldadores-demoliciones-excavaciones", services: ["Soldadura y estructuras metálicas", "Demoliciones controladas", "Excavaciones y movimiento de tierras"] },
    "ascensores-incendios": { name: "Ascensores y protección contra incendios", noun: "técnico de ascensores y protección", plural: "ascensores-proteccion-incendios", services: ["Instalación y mantenimiento de ascensores", "Extintores y sistemas contra incendios", "Inspección y adecuación normativa"] },
  },
  fr: {
    "cerrajeria-cerramientos": { name: "Serruriers, vitriers et fermetures", noun: "spécialiste en serrurerie et fermetures", plural: "serruriers-vitriers-fermetures", services: ["Ouverture et remplacement de serrures", "Vitrerie sur mesure", "Fenêtres et fermetures"] },
    "suelos-pladur": { name: "Sols, carrelage, plâtre et plaques de plâtre", noun: "spécialiste des sols et cloisons sèches", plural: "sols-carrelage-plaques-platre", services: ["Pose de parquet et stratifié", "Carrelage et revêtements de sol", "Cloisons et plafonds en plaques de plâtre"] },
    "jardineria-piscinas": { name: "Jardinage, piscines et extérieurs", noun: "spécialiste des extérieurs", plural: "jardiniers-piscines-exterieurs", services: ["Création et entretien de jardins", "Construction et réparation de piscines", "Arrosage, taille et paysage"] },
    "limpieza-saneamiento": { name: "Nettoyage, nuisibles et assainissement", noun: "spécialiste du nettoyage et de l’assainissement", plural: "nettoyage-nuisibles-assainissement", services: ["Nettoyage professionnel et fin de chantier", "Lutte contre les nuisibles", "Curage et débouchage"] },
    "seguridad-telecomunicaciones": { name: "Sécurité, télécommunications et domotique", noun: "installateur sécurité et télécommunications", plural: "securite-telecommunications-domotique", services: ["Alarmes et vidéosurveillance", "Antennes, réseaux et fibre", "Domotique et contrôle d’accès"] },
    "reparaciones-electrodomesticos": { name: "Dépannage électroménager", noun: "technicien électroménager", plural: "techniciens-electromenager", services: ["Réparation de lave-linge", "Fours, réfrigérateurs et lave-vaisselle", "Installation d’appareils"] },
    "mudanzas-vaciados": { name: "Déménagements, débarras et déchets", noun: "entreprise de déménagement et débarras", plural: "demenagements-debarras-dechets", services: ["Déménagement logement ou bureau", "Débarras de logements et locaux", "Enlèvement et gestion des déchets"] },
    "metal-demoliciones": { name: "Soudure, métallerie, démolition et terrassement", noun: "spécialiste métal et travaux lourds", plural: "soudeurs-demolition-terrassement", services: ["Soudure et structures métalliques", "Démolition contrôlée", "Terrassement et excavation"] },
    "ascensores-incendios": { name: "Ascenseurs et protection incendie", noun: "technicien ascenseurs et incendie", plural: "ascenseurs-protection-incendie", services: ["Installation et entretien d’ascenseurs", "Extincteurs et systèmes incendie", "Inspection et mise en conformité"] },
  },
  it: {
    "cerrajeria-cerramientos": { name: "Fabbri, vetrai e serramenti", noun: "specialista in serrature e serramenti", plural: "fabbri-vetrai-serramenti", services: ["Apertura e sostituzione serrature", "Vetreria su misura", "Finestre e serramenti"] },
    "suelos-pladur": { name: "Pavimenti, piastrelle, gesso e cartongesso", noun: "specialista in pavimenti e cartongesso", plural: "pavimenti-piastrelle-cartongesso", services: ["Posa parquet e laminato", "Piastrelle e pavimentazioni", "Pareti e soffitti in cartongesso"] },
    "jardineria-piscinas": { name: "Giardinaggio, piscine ed esterni", noun: "specialista di spazi esterni", plural: "giardinieri-piscine-esterni", services: ["Progettazione e manutenzione giardini", "Costruzione e riparazione piscine", "Irrigazione, potatura e paesaggio"] },
    "limpieza-saneamiento": { name: "Pulizia, disinfestazione e fognature", noun: "specialista in pulizia e risanamento", plural: "pulizia-disinfestazione-fognature", services: ["Pulizia professionale e fine cantiere", "Controllo infestanti", "Spurgo e disostruzione"] },
    "seguridad-telecomunicaciones": { name: "Sicurezza, telecomunicazioni e domotica", noun: "installatore di sicurezza e telecomunicazioni", plural: "sicurezza-telecomunicazioni-domotica", services: ["Allarmi e videosorveglianza", "Antenne, reti e fibra", "Domotica e controllo accessi"] },
    "reparaciones-electrodomesticos": { name: "Riparazione elettrodomestici", noun: "tecnico di elettrodomestici", plural: "tecnici-elettrodomestici", services: ["Riparazione lavatrici", "Forni, frigoriferi e lavastoviglie", "Installazione elettrodomestici"] },
    "mudanzas-vaciados": { name: "Traslochi, sgomberi e rifiuti", noun: "impresa di traslochi e sgomberi", plural: "traslochi-sgomberi-rifiuti", services: ["Trasloco casa o ufficio", "Sgombero di abitazioni e locali", "Ritiro e gestione rifiuti"] },
    "metal-demoliciones": { name: "Saldatura, metallo, demolizioni e scavi", noun: "specialista in metallo e lavori pesanti", plural: "saldatori-demolizioni-scavi", services: ["Saldatura e strutture metalliche", "Demolizioni controllate", "Scavi e movimento terra"] },
    "ascensores-incendios": { name: "Ascensori e protezione antincendio", noun: "tecnico ascensori e antincendio", plural: "ascensori-protezione-antincendio", services: ["Installazione e manutenzione ascensori", "Estintori e sistemi antincendio", "Ispezione e adeguamento normativo"] },
  },
  pt: {
    "cerrajeria-cerramientos": { name: "Serralheiros, vidraceiros e caixilharia", noun: "especialista em serralharia e caixilharia", plural: "serralheiros-vidraceiros-caixilharia", services: ["Abertura e troca de fechaduras", "Vidros por medida", "Janelas e caixilharia"] },
    "suelos-pladur": { name: "Pavimentos, azulejos, gesso e pladur", noun: "especialista em pavimentos e pladur", plural: "pavimentos-azulejos-pladur", services: ["Colocação de parquet e laminado", "Azulejos e pavimentos", "Divisórias e tetos em pladur"] },
    "jardineria-piscinas": { name: "Jardinagem, piscinas e exteriores", noun: "especialista em exteriores", plural: "jardineiros-piscinas-exteriores", services: ["Projeto e manutenção de jardins", "Construção e reparação de piscinas", "Rega, poda e paisagismo"] },
    "limpieza-saneamiento": { name: "Limpeza, pragas e saneamento", noun: "especialista em limpeza e saneamento", plural: "limpeza-pragas-saneamento", services: ["Limpeza profissional e fim de obra", "Controlo de pragas", "Desentupimentos e saneamento"] },
    "seguridad-telecomunicaciones": { name: "Segurança, telecomunicações e domótica", noun: "instalador de segurança e telecomunicações", plural: "seguranca-telecomunicacoes-domotica", services: ["Alarmes e videovigilância", "Antenas, redes e fibra", "Domótica e controlo de acessos"] },
    "reparaciones-electrodomesticos": { name: "Reparação de eletrodomésticos", noun: "técnico de eletrodomésticos", plural: "tecnicos-eletrodomesticos", services: ["Reparação de máquinas de lavar", "Fornos, frigoríficos e máquinas de louça", "Instalação de eletrodomésticos"] },
    "mudanzas-vaciados": { name: "Mudanças, esvaziamentos e resíduos", noun: "empresa de mudanças e esvaziamentos", plural: "mudancas-esvaziamentos-residuos", services: ["Mudança de casa ou escritório", "Esvaziamento de imóveis", "Remoção e gestão de resíduos"] },
    "metal-demoliciones": { name: "Soldadura, metal, demolições e escavações", noun: "especialista em metal e obra pesada", plural: "soldadores-demolicoes-escavacoes", services: ["Soldadura e estruturas metálicas", "Demolições controladas", "Escavações e movimento de terras"] },
    "ascensores-incendios": { name: "Elevadores e proteção contra incêndios", noun: "técnico de elevadores e incêndios", plural: "elevadores-protecao-incendios", services: ["Instalação e manutenção de elevadores", "Extintores e sistemas de incêndio", "Inspeção e conformidade"] },
  },
  de: {
    "cerrajeria-cerramientos": { name: "Schlüsseldienst, Glaserei und Fensterbau", noun: "Fachbetrieb für Schlösser und Fenster", plural: "schluesseldienste-glasereien-fensterbau", services: ["Türöffnung und Schlosswechsel", "Glas nach Maß", "Fenster und Verglasungen"] },
    "suelos-pladur": { name: "Böden, Fliesen, Putz und Trockenbau", noun: "Fachbetrieb für Böden und Trockenbau", plural: "boeden-fliesen-trockenbau", services: ["Parkett und Laminat verlegen", "Fliesen und Bodenbeläge", "Trockenbauwände und Decken"] },
    "jardineria-piscinas": { name: "Gartenbau, Pools und Außenanlagen", noun: "Fachbetrieb für Außenanlagen", plural: "gartenbau-pools-aussenanlagen", services: ["Gartenplanung und Pflege", "Poolbau und Reparatur", "Bewässerung, Baumschnitt und Landschaftsbau"] },
    "limpieza-saneamiento": { name: "Reinigung, Schädlingsbekämpfung und Entwässerung", noun: "Fachbetrieb für Reinigung und Entwässerung", plural: "reinigung-schaedlinge-entwaesserung", services: ["Gebäude- und Bauendreinigung", "Schädlingsbekämpfung", "Rohr- und Kanalreinigung"] },
    "seguridad-telecomunicaciones": { name: "Sicherheit, Telekommunikation und Smart Home", noun: "Installateur für Sicherheit und Kommunikation", plural: "sicherheit-telekommunikation-smart-home", services: ["Alarmanlagen und Videoüberwachung", "Antennen, Netzwerke und Glasfaser", "Smart Home und Zutrittskontrolle"] },
    "reparaciones-electrodomesticos": { name: "Haushaltsgeräte-Reparatur", noun: "Hausgerätetechniker", plural: "hausgeraetetechniker", services: ["Waschmaschinen reparieren", "Öfen, Kühlschränke und Geschirrspüler", "Haushaltsgeräte installieren"] },
    "mudanzas-vaciados": { name: "Umzüge, Entrümpelung und Entsorgung", noun: "Umzugs- und Entrümpelungsunternehmen", plural: "umzuege-entruempelung-entsorgung", services: ["Wohnungs- oder Büroumzug", "Entrümpelung von Immobilien", "Abholung und Entsorgung"] },
    "metal-demoliciones": { name: "Schweißen, Metallbau, Abbruch und Erdbau", noun: "Fachbetrieb für Metall und schwere Arbeiten", plural: "schweisser-abbruch-erdbau", services: ["Schweißarbeiten und Stahlbau", "Kontrollierter Abbruch", "Aushub und Erdbewegung"] },
    "ascensores-incendios": { name: "Aufzüge und Brandschutz", noun: "Aufzugs- und Brandschutztechniker", plural: "aufzuege-brandschutz", services: ["Aufzugseinbau und Wartung", "Feuerlöscher und Brandschutzanlagen", "Prüfung und Normenanpassung"] },
  },
  nl: {
    "cerrajeria-cerramientos": { name: "Slotenmakers, glaszetters en kozijnen", noun: "specialist in sloten en kozijnen", plural: "slotenmakers-glaszetters-kozijnen", services: ["Deur openen en slot vervangen", "Glas op maat", "Ramen en kozijnen"] },
    "suelos-pladur": { name: "Vloeren, tegels, stucwerk en gipsplaten", noun: "specialist in vloeren en droogbouw", plural: "vloeren-tegels-droogbouw", services: ["Parket en laminaat leggen", "Tegelwerk en vloeren", "Wanden en plafonds met gipsplaten"] },
    "jardineria-piscinas": { name: "Tuinen, zwembaden en buitenruimte", noun: "specialist in buitenruimte", plural: "hoveniers-zwembaden-buitenruimte", services: ["Tuinontwerp en onderhoud", "Zwembadbouw en reparatie", "Beregening, snoeiwerk en landschap"] },
    "limpieza-saneamiento": { name: "Reiniging, ongedierte en riolering", noun: "specialist in reiniging en riolering", plural: "reiniging-ongedierte-riolering", services: ["Professionele en opleveringsschoonmaak", "Ongediertebestrijding", "Rioolreiniging en ontstoppen"] },
    "seguridad-telecomunicaciones": { name: "Beveiliging, telecom en domotica", noun: "installateur beveiliging en telecom", plural: "beveiliging-telecom-domotica", services: ["Alarmen en camerabewaking", "Antennes, netwerken en glasvezel", "Domotica en toegangscontrole"] },
    "reparaciones-electrodomesticos": { name: "Reparatie van huishoudelijke apparaten", noun: "witgoedmonteur", plural: "witgoedmonteurs", services: ["Wasmachine repareren", "Ovens, koelkasten en vaatwassers", "Apparaten installeren"] },
    "mudanzas-vaciados": { name: "Verhuizingen, ontruiming en afval", noun: "verhuis- en ontruimingsbedrijf", plural: "verhuizingen-ontruiming-afval", services: ["Woning- of kantoorverhuizing", "Woning en pand ontruimen", "Afvoer en afvalbeheer"] },
    "metal-demoliciones": { name: "Lassen, metaal, sloop en grondwerk", noun: "specialist in metaal en zwaar werk", plural: "lassers-sloop-grondwerk", services: ["Laswerk en staalconstructies", "Gecontroleerde sloop", "Graaf- en grondwerk"] },
    "ascensores-incendios": { name: "Liften en brandbeveiliging", noun: "lift- en brandveiligheidstechnicus", plural: "liften-brandbeveiliging", services: ["Liftinstallatie en onderhoud", "Blussers en brandbeveiliging", "Inspectie en normaanpassing"] },
  },
  en: {
    "cerrajeria-cerramientos": { name: "Locksmiths, glazing and windows", noun: "locksmith and glazing specialist", plural: "locksmiths-glaziers-windows", services: ["Emergency entry and lock replacement", "Made-to-measure glazing", "Windows and enclosures"] },
    "suelos-pladur": { name: "Flooring, tiling, plastering and drywall", noun: "flooring and drywall specialist", plural: "flooring-tiling-drywall", services: ["Parquet and laminate fitting", "Tiling and floor finishes", "Drywall partitions and ceilings"] },
    "jardineria-piscinas": { name: "Gardens, pools and outdoor spaces", noun: "outdoor spaces specialist", plural: "gardeners-pools-outdoors", services: ["Garden design and maintenance", "Pool construction and repair", "Irrigation, pruning and landscaping"] },
    "limpieza-saneamiento": { name: "Cleaning, pest control and drainage", noun: "cleaning and drainage specialist", plural: "cleaning-pest-control-drainage", services: ["Professional and post-build cleaning", "Pest control", "Drain and sewer clearance"] },
    "seguridad-telecomunicaciones": { name: "Security, telecommunications and smart home", noun: "security and telecom installer", plural: "security-telecom-smart-home", services: ["Alarms and CCTV", "Aerials, networks and fibre", "Smart home and access control"] },
    "reparaciones-electrodomesticos": { name: "Appliance repair", noun: "appliance technician", plural: "appliance-technicians", services: ["Washing machine repair", "Ovens, fridges and dishwashers", "Appliance installation"] },
    "mudanzas-vaciados": { name: "Removals, clearances and waste", noun: "removal and clearance company", plural: "removals-clearances-waste", services: ["Home or office removals", "Property and site clearance", "Waste collection and management"] },
    "metal-demoliciones": { name: "Welding, metalwork, demolition and excavation", noun: "metalwork and heavy works specialist", plural: "welders-demolition-excavation", services: ["Welding and steel structures", "Controlled demolition", "Excavation and earthworks"] },
    "ascensores-incendios": { name: "Lifts and fire protection", noun: "lift and fire protection technician", plural: "lifts-fire-protection", services: ["Lift installation and maintenance", "Extinguishers and fire systems", "Inspection and compliance upgrades"] },
  },
};

const metadata: Record<TradeId, { icon: string; image: string }> = {
  "cerrajeria-cerramientos": { icon: "KeyRound", image: "/images/photos/ventanas.webp" },
  "suelos-pladur": { icon: "Grid2X2", image: "/images/photos/suelos.webp" },
  "jardineria-piscinas": { icon: "Trees", image: "/images/photos/fachada.webp" },
  "limpieza-saneamiento": { icon: "Sparkles", image: "/images/photos/mantenimiento.webp" },
  "seguridad-telecomunicaciones": { icon: "ShieldCheck", image: "/images/photos/domotica.webp" },
  "reparaciones-electrodomesticos": { icon: "Wrench", image: "/images/photos/climatizacion.webp" },
  "mudanzas-vaciados": { icon: "Truck", image: "/images/photos/carpinteria.webp" },
  "metal-demoliciones": { icon: "Hammer", image: "/images/photos/pavimentacion.webp" },
  "ascensores-incendios": { icon: "BellRing", image: "/images/photos/mantenimiento.webp" },
};

function descriptions(locale: Locale, copy: TradeCopy) {
  const services = copy.services.join(", ");
  switch (locale) {
    case "fr": return { shortDescription: `${copy.name} pour logements, entreprises et copropriétés.`, description: `Trouvez des ${copy.plural.replace(/-/g, " ")} pour ${services}. Comparez zone d’intervention, expérience, réalisations et disponibilité réelle.` };
    case "it": return { shortDescription: `${copy.name} per abitazioni, aziende e condomini.`, description: `Trova ${copy.plural.replace(/-/g, " ")} per ${services}. Confronta area operativa, esperienza, lavori e disponibilità reale.` };
    case "pt": return { shortDescription: `${copy.name} para habitações, empresas e condomínios.`, description: `Encontre ${copy.plural.replace(/-/g, " ")} para ${services}. Compare zona, experiência, trabalhos e disponibilidade real.` };
    case "de": return { shortDescription: `${copy.name} für Wohnungen, Unternehmen und Gebäude.`, description: `Finden Sie ${copy.plural.replace(/-/g, " ")} für ${services}. Vergleichen Sie Einsatzgebiet, Erfahrung, Referenzen und reale Verfügbarkeit.` };
    case "nl": return { shortDescription: `${copy.name} voor woningen, bedrijven en gebouwen.`, description: `Vind ${copy.plural.replace(/-/g, " ")} voor ${services}. Vergelijk werkgebied, ervaring, projecten en echte beschikbaarheid.` };
    case "en": return { shortDescription: `${copy.name} for homes, businesses and managed properties.`, description: `Find ${copy.plural.replace(/-/g, " ")} for ${services}. Compare service area, experience, completed work and real availability.` };
    default: return { shortDescription: `${copy.name} para viviendas, empresas y comunidades.`, description: `Encuentra ${copy.plural.replace(/-/g, " ")} para ${services}. Compara zona de trabajo, experiencia, trabajos y disponibilidad real.` };
  }
}

export const tradeCategoryTranslations = (Object.keys(copies) as Locale[]).reduce((result, locale) => {
  result[locale] = Object.fromEntries(tradeCategoryIds.map((id) => {
    const copy = copies[locale][id];
    return [id, { name: copy.name, professionalNoun: copy.noun, professionalNounPlural: copy.plural, ...descriptions(locale, copy), popularServices: copy.services }];
  })) as unknown as Record<TradeId, Omit<Category, "id" | "slug" | "icon" | "image" | "featured">>;
  return result;
}, {} as Record<Locale, Record<TradeId, Omit<Category, "id" | "slug" | "icon" | "image" | "featured">>>);

export const tradeCategories: Category[] = tradeCategoryIds.map((id) => ({
  id,
  slug: id,
  ...tradeCategoryTranslations.es[id],
  ...metadata[id],
  featured: false,
}));
