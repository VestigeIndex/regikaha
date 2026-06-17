import type { Locale } from "./config";

export interface MarketsDict {
  home: {
    eyebrow: string;
    title: string;
    description: string;
    statsCountries: string;
    statsCities: string;
    viewAll: string;
    openMarket: string;
  };
  index: {
    eyebrow: string;
    title: string;
    description: string;
    breadcrumb: string;
  };
  detail: {
    eyebrow: string;
    titlePrefix: string;
    descriptionPrefix: string;
    descriptionSuffix: string;
    searchCountry: string;
    publishProject: string;
    viewMap: string;
    citiesTitle: string;
    citiesText: string;
    categoriesTitle: string;
    categoriesText: string;
    clientsTitle: string;
    clientsText: string;
    prosTitle: string;
    prosText: string;
    noCities: string;
  };
}

export const marketsDictionaries: Record<Locale, MarketsDict> = {
  es: {
    home: {
      eyebrow: "Mercados activos",
      title: "Cobertura inicial por países concretos",
      description: "RegiKaha trabaja por ahora solo en estos mercados. La búsqueda puede filtrarse por país, ciudad y categoría para mantener la cobertura real y nacional.",
      statsCountries: "países activos",
      statsCities: "ciudades iniciales",
      viewAll: "Ver mercados",
      openMarket: "Abrir mercado",
    },
    index: {
      eyebrow: "Mercados activos",
      title: "RegiKaha por países",
      description: "Cobertura inicial en España, Francia, Italia, Portugal, Suiza, Alemania, Países Bajos, Bélgica, Irlanda y Reino Unido. Cada mercado tiene búsqueda nacional, ciudades iniciales y categorías principales.",
      breadcrumb: "Mercados",
    },
    detail: {
      eyebrow: "Mercado activo",
      titlePrefix: "RegiKaha en",
      descriptionPrefix: "Busca profesionales verificados en",
      descriptionSuffix: "por ciudad, categoría, portfolio, precios orientativos y valoraciones reales.",
      searchCountry: "Buscar en este país",
      publishProject: "Publicar proyecto",
      viewMap: "Ver mapa",
      citiesTitle: "Ciudades iniciales",
      citiesText: "Estas ciudades sirven como puntos de partida. La cobertura puede ampliarse por demanda real.",
      categoriesTitle: "Categorías principales",
      categoriesText: "Filtra por categoría y país para encontrar profesionales o activar captación si todavía no hay oferta suficiente.",
      clientsTitle: "Para clientes",
      clientsText: "Publica gratis tu proyecto y recibe pre-presupuestos iniciales no vinculantes cuando haya profesionales disponibles.",
      prosTitle: "Para profesionales",
      prosText: "Crea un perfil con SEO propio, servicios, zonas de operación, logo, portfolio y herramientas para enviar pre-presupuestos.",
      noCities: "Próximamente añadiremos ciudades iniciales para este mercado.",
    },
  },
  fr: {
    home: {
      eyebrow: "Marchés actifs",
      title: "Couverture initiale par pays précis",
      description: "RegiKaha travaille pour l’instant uniquement sur ces marchés. La recherche peut être filtrée par pays, ville et catégorie afin de garder une couverture réelle et nationale.",
      statsCountries: "pays actifs",
      statsCities: "villes initiales",
      viewAll: "Voir les marchés",
      openMarket: "Ouvrir le marché",
    },
    index: {
      eyebrow: "Marchés actifs",
      title: "RegiKaha par pays",
      description: "Couverture initiale en Espagne, France, Italie, Portugal, Suisse, Allemagne, Pays-Bas, Belgique, Irlande et Royaume-Uni. Chaque marché dispose d’une recherche nationale, de villes initiales et de catégories principales.",
      breadcrumb: "Marchés",
    },
    detail: {
      eyebrow: "Marché actif",
      titlePrefix: "RegiKaha en",
      descriptionPrefix: "Recherchez des professionnels vérifiés en",
      descriptionSuffix: "par ville, catégorie, portfolio, prix indicatifs et avis réels.",
      searchCountry: "Rechercher dans ce pays",
      publishProject: "Publier un projet",
      viewMap: "Voir la carte",
      citiesTitle: "Villes initiales",
      citiesText: "Ces villes servent de points de départ. La couverture peut s’étendre selon la demande réelle.",
      categoriesTitle: "Catégories principales",
      categoriesText: "Filtrez par catégorie et pays pour trouver des professionnels ou activer la prospection si l’offre est encore insuffisante.",
      clientsTitle: "Pour les clients",
      clientsText: "Publiez gratuitement votre projet et recevez des estimations initiales non contraignantes lorsque des professionnels sont disponibles.",
      prosTitle: "Pour les professionnels",
      prosText: "Créez un profil avec SEO propre, services, zones d’intervention, logo, portfolio et outils pour envoyer des estimations initiales.",
      noCities: "Nous ajouterons bientôt des villes initiales pour ce marché.",
    },
  },
  it: {
    home: {
      eyebrow: "Mercati attivi",
      title: "Copertura iniziale per paesi concreti",
      description: "RegiKaha opera per ora solo in questi mercati. La ricerca può essere filtrata per paese, città e categoria per mantenere una copertura reale e nazionale.",
      statsCountries: "paesi attivi",
      statsCities: "città iniziali",
      viewAll: "Vedi mercati",
      openMarket: "Apri mercato",
    },
    index: {
      eyebrow: "Mercati attivi",
      title: "RegiKaha per paese",
      description: "Copertura iniziale in Spagna, Francia, Italia, Portogallo, Svizzera, Germania, Paesi Bassi, Belgio, Irlanda e Regno Unito. Ogni mercato ha ricerca nazionale, città iniziali e categorie principali.",
      breadcrumb: "Mercati",
    },
    detail: {
      eyebrow: "Mercato attivo",
      titlePrefix: "RegiKaha in",
      descriptionPrefix: "Cerca professionisti verificati in",
      descriptionSuffix: "per città, categoria, portfolio, prezzi indicativi e recensioni reali.",
      searchCountry: "Cerca in questo paese",
      publishProject: "Pubblica progetto",
      viewMap: "Vedi mappa",
      citiesTitle: "Città iniziali",
      citiesText: "Queste città sono punti di partenza. La copertura può ampliarsi in base alla domanda reale.",
      categoriesTitle: "Categorie principali",
      categoriesText: "Filtra per categoria e paese per trovare professionisti o attivare l’acquisizione se l’offerta è ancora insufficiente.",
      clientsTitle: "Per i clienti",
      clientsText: "Pubblica gratis il tuo progetto e ricevi stime iniziali non vincolanti quando ci sono professionisti disponibili.",
      prosTitle: "Per i professionisti",
      prosText: "Crea un profilo con SEO proprio, servizi, aree operative, logo, portfolio e strumenti per inviare stime iniziali.",
      noCities: "Aggiungeremo presto città iniziali per questo mercato.",
    },
  },
  pt: {
    home: {
      eyebrow: "Mercados ativos",
      title: "Cobertura inicial por países concretos",
      description: "A RegiKaha trabalha por enquanto apenas nestes mercados. A pesquisa pode ser filtrada por país, cidade e categoria para manter cobertura real e nacional.",
      statsCountries: "países ativos",
      statsCities: "cidades iniciais",
      viewAll: "Ver mercados",
      openMarket: "Abrir mercado",
    },
    index: {
      eyebrow: "Mercados ativos",
      title: "RegiKaha por país",
      description: "Cobertura inicial em Espanha, França, Itália, Portugal, Suíça, Alemanha, Países Baixos, Bélgica, Irlanda e Reino Unido. Cada mercado tem pesquisa nacional, cidades iniciais e categorias principais.",
      breadcrumb: "Mercados",
    },
    detail: {
      eyebrow: "Mercado ativo",
      titlePrefix: "RegiKaha em",
      descriptionPrefix: "Pesquise profissionais verificados em",
      descriptionSuffix: "por cidade, categoria, portefólio, preços indicativos e avaliações reais.",
      searchCountry: "Pesquisar neste país",
      publishProject: "Publicar projeto",
      viewMap: "Ver mapa",
      citiesTitle: "Cidades iniciais",
      citiesText: "Estas cidades servem como pontos de partida. A cobertura pode expandir-se por procura real.",
      categoriesTitle: "Categorias principais",
      categoriesText: "Filtre por categoria e país para encontrar profissionais ou ativar captação se ainda não houver oferta suficiente.",
      clientsTitle: "Para clientes",
      clientsText: "Publique gratuitamente o seu projeto e receba estimativas iniciais não vinculativas quando houver profissionais disponíveis.",
      prosTitle: "Para profissionais",
      prosText: "Crie um perfil com SEO próprio, serviços, zonas de operação, logótipo, portefólio e ferramentas para enviar estimativas iniciais.",
      noCities: "Em breve adicionaremos cidades iniciais para este mercado.",
    },
  },
  de: {
    home: {
      eyebrow: "Aktive Märkte",
      title: "Startabdeckung nach konkreten Ländern",
      description: "RegiKaha arbeitet vorerst nur in diesen Märkten. Die Suche kann nach Land, Stadt und Kategorie gefiltert werden, damit die Abdeckung real und national bleibt.",
      statsCountries: "aktive Länder",
      statsCities: "Startstädte",
      viewAll: "Märkte ansehen",
      openMarket: "Markt öffnen",
    },
    index: {
      eyebrow: "Aktive Märkte",
      title: "RegiKaha nach Ländern",
      description: "Startabdeckung in Spanien, Frankreich, Italien, Portugal, Schweiz, Deutschland, Niederlande, Belgien, Irland und Vereinigtes Königreich. Jeder Markt hat nationale Suche, Startstädte und Hauptkategorien.",
      breadcrumb: "Märkte",
    },
    detail: {
      eyebrow: "Aktiver Markt",
      titlePrefix: "RegiKaha in",
      descriptionPrefix: "Suchen Sie verifizierte Fachleute in",
      descriptionSuffix: "nach Stadt, Kategorie, Portfolio, Richtpreisen und echten Bewertungen.",
      searchCountry: "In diesem Land suchen",
      publishProject: "Projekt veröffentlichen",
      viewMap: "Karte ansehen",
      citiesTitle: "Startstädte",
      citiesText: "Diese Städte dienen als Ausgangspunkte. Die Abdeckung kann durch echte Nachfrage erweitert werden.",
      categoriesTitle: "Hauptkategorien",
      categoriesText: "Filtern Sie nach Kategorie und Land, um Fachleute zu finden oder Akquise zu aktivieren, wenn das Angebot noch nicht ausreicht.",
      clientsTitle: "Für Kunden",
      clientsText: "Veröffentlichen Sie Ihr Projekt kostenlos und erhalten Sie unverbindliche Erstschätzungen, wenn Fachleute verfügbar sind.",
      prosTitle: "Für Fachleute",
      prosText: "Erstellen Sie ein Profil mit eigener SEO, Services, Einsatzgebieten, Logo, Portfolio und Werkzeugen für Erstschätzungen.",
      noCities: "Wir fügen bald Startstädte für diesen Markt hinzu.",
    },
  },
  nl: {
    home: {
      eyebrow: "Actieve markten",
      title: "Eerste dekking per concreet land",
      description: "RegiKaha werkt voorlopig alleen in deze markten. Zoeken kan per land, stad en categorie worden gefilterd om de dekking echt en nationaal te houden.",
      statsCountries: "actieve landen",
      statsCities: "startsteden",
      viewAll: "Markten bekijken",
      openMarket: "Markt openen",
    },
    index: {
      eyebrow: "Actieve markten",
      title: "RegiKaha per land",
      description: "Eerste dekking in Spanje, Frankrijk, Italië, Portugal, Zwitserland, Duitsland, Nederland, België, Ierland en het Verenigd Koninkrijk. Elke markt heeft nationale zoekfunctie, startsteden en hoofdcategorieën.",
      breadcrumb: "Markten",
    },
    detail: {
      eyebrow: "Actieve markt",
      titlePrefix: "RegiKaha in",
      descriptionPrefix: "Zoek geverifieerde professionals in",
      descriptionSuffix: "op stad, categorie, portfolio, richtprijzen en echte beoordelingen.",
      searchCountry: "Zoeken in dit land",
      publishProject: "Project publiceren",
      viewMap: "Kaart bekijken",
      citiesTitle: "Startsteden",
      citiesText: "Deze steden zijn vertrekpunten. Dekking kan uitbreiden op basis van echte vraag.",
      categoriesTitle: "Hoofdcategorieën",
      categoriesText: "Filter op categorie en land om professionals te vinden of acquisitie te activeren als er nog onvoldoende aanbod is.",
      clientsTitle: "Voor klanten",
      clientsText: "Publiceer gratis uw project en ontvang vrijblijvende eerste schattingen wanneer professionals beschikbaar zijn.",
      prosTitle: "Voor professionals",
      prosText: "Maak een profiel met eigen SEO, diensten, werkgebieden, logo, portfolio en tools om eerste schattingen te sturen.",
      noCities: "Binnenkort voegen we startsteden toe voor deze markt.",
    },
  },
  en: {
    home: {
      eyebrow: "Active markets",
      title: "Initial coverage by specific countries",
      description: "RegiKaha currently works only in these markets. Search can be filtered by country, city and category to keep coverage real and national.",
      statsCountries: "active countries",
      statsCities: "initial cities",
      viewAll: "View markets",
      openMarket: "Open market",
    },
    index: {
      eyebrow: "Active markets",
      title: "RegiKaha by country",
      description: "Initial coverage in Spain, France, Italy, Portugal, Switzerland, Germany, the Netherlands, Belgium, Ireland and the United Kingdom. Each market has national search, initial cities and main categories.",
      breadcrumb: "Markets",
    },
    detail: {
      eyebrow: "Active market",
      titlePrefix: "RegiKaha in",
      descriptionPrefix: "Search verified professionals in",
      descriptionSuffix: "by city, category, portfolio, indicative prices and real reviews.",
      searchCountry: "Search this country",
      publishProject: "Publish project",
      viewMap: "View map",
      citiesTitle: "Initial cities",
      citiesText: "These cities are starting points. Coverage can expand through real demand.",
      categoriesTitle: "Main categories",
      categoriesText: "Filter by category and country to find professionals or activate acquisition if supply is still limited.",
      clientsTitle: "For clients",
      clientsText: "Publish your project for free and receive non-binding initial estimates when professionals are available.",
      prosTitle: "For professionals",
      prosText: "Create a profile with its own SEO, services, operating areas, logo, portfolio and tools to send initial estimates.",
      noCities: "We will soon add initial cities for this market.",
    },
  },
};
