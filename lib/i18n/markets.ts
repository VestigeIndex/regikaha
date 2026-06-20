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
    geoDataAttribution: string;
    noCities: string;
  };
}

export const marketsDictionaries: Record<Locale, MarketsDict> = {
  es: {
    home: {
      eyebrow: "Mercados activos",
      title: "Cobertura territorial en 10 países",
      description: "Busca cualquier ciudad, municipio, pueblo o localidad de los mercados activos. La disponibilidad profesional se muestra siempre con datos reales.",
      statsCountries: "países activos",
      statsCities: "localidades buscables",
      viewAll: "Ver mercados",
      openMarket: "Abrir mercado",
    },
    index: {
      eyebrow: "Mercados activos",
      title: "RegiKaha por países",
      description: "Búsqueda territorial completa en España, Francia, Italia, Portugal, Suiza, Alemania, Países Bajos, Bélgica, Irlanda y Reino Unido, con disponibilidad profesional transparente.",
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
      citiesTitle: "Todas las ciudades y localidades",
      citiesText: "Busca cualquier ciudad, municipio o pueblo de este país. Si todavía no hay profesionales activos, podrás publicar la necesidad para activar captación local.",
      categoriesTitle: "Categorías principales",
      categoriesText: "Filtra por categoría y país para encontrar profesionales o activar captación si todavía no hay oferta suficiente.",
      clientsTitle: "Para clientes",
      clientsText: "Publica gratis tu proyecto y recibe pre-presupuestos iniciales no vinculantes cuando haya profesionales disponibles.",
      prosTitle: "Para profesionales",
      prosText: "Crea un perfil con SEO propio, servicios, zonas de operación, logo, portfolio y herramientas para enviar pre-presupuestos.",
      geoDataAttribution: "Datos geográficos de GeoNames (CC BY 4.0)",
      noCities: "No hay localidades destacadas disponibles para este mercado.",
    },
  },
  fr: {
    home: {
      eyebrow: "Marchés actifs",
      title: "Couverture territoriale dans 10 pays",
      description: "Recherchez toute ville, commune ou localité des marchés actifs. La disponibilité des professionnels repose toujours sur des données réelles.",
      statsCountries: "pays actifs",
      statsCities: "localités consultables",
      viewAll: "Voir les marchés",
      openMarket: "Ouvrir le marché",
    },
    index: {
      eyebrow: "Marchés actifs",
      title: "RegiKaha par pays",
      description: "Recherche territoriale complète en Espagne, France, Italie, Portugal, Suisse, Allemagne, Pays-Bas, Belgique, Irlande et Royaume-Uni, avec une disponibilité professionnelle transparente.",
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
      citiesTitle: "Toutes les villes et localités",
      citiesText: "Recherchez toute ville ou commune de ce pays. S’il n’y a pas encore de professionnels actifs, publiez votre besoin pour déclencher une prospection locale.",
      categoriesTitle: "Catégories principales",
      categoriesText: "Filtrez par catégorie et pays pour trouver des professionnels ou activer la prospection si l’offre est encore insuffisante.",
      clientsTitle: "Pour les clients",
      clientsText: "Publiez gratuitement votre projet et recevez des estimations initiales non contraignantes lorsque des professionnels sont disponibles.",
      prosTitle: "Pour les professionnels",
      prosText: "Créez un profil avec SEO propre, services, zones d’intervention, logo, portfolio et outils pour envoyer des estimations initiales.",
      geoDataAttribution: "Données géographiques de GeoNames (CC BY 4.0)",
      noCities: "Aucune localité mise en avant n’est disponible pour ce marché.",
    },
  },
  it: {
    home: {
      eyebrow: "Mercati attivi",
      title: "Copertura territoriale in 10 paesi",
      description: "Cerca qualsiasi città, comune, paese o località dei mercati attivi. La disponibilità dei professionisti usa sempre dati reali.",
      statsCountries: "paesi attivi",
      statsCities: "località ricercabili",
      viewAll: "Vedi mercati",
      openMarket: "Apri mercato",
    },
    index: {
      eyebrow: "Mercati attivi",
      title: "RegiKaha per paese",
      description: "Ricerca territoriale completa in Spagna, Francia, Italia, Portogallo, Svizzera, Germania, Paesi Bassi, Belgio, Irlanda e Regno Unito, con disponibilità professionale trasparente.",
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
      citiesTitle: "Tutte le città e località",
      citiesText: "Cerca qualsiasi città, comune o paese. Se non ci sono ancora professionisti attivi, pubblica la richiesta per avviare la ricerca locale.",
      categoriesTitle: "Categorie principali",
      categoriesText: "Filtra per categoria e paese per trovare professionisti o attivare l’acquisizione se l’offerta è ancora insufficiente.",
      clientsTitle: "Per i clienti",
      clientsText: "Pubblica gratis il tuo progetto e ricevi stime iniziali non vincolanti quando ci sono professionisti disponibili.",
      prosTitle: "Per i professionisti",
      prosText: "Crea un profilo con SEO proprio, servizi, aree operative, logo, portfolio e strumenti per inviare stime iniziali.",
      geoDataAttribution: "Dati geografici di GeoNames (CC BY 4.0)",
      noCities: "Non sono disponibili località in evidenza per questo mercato.",
    },
  },
  pt: {
    home: {
      eyebrow: "Mercados ativos",
      title: "Cobertura territorial em 10 países",
      description: "Pesquise qualquer cidade, município, vila ou localidade dos mercados ativos. A disponibilidade profissional usa sempre dados reais.",
      statsCountries: "países ativos",
      statsCities: "localidades pesquisáveis",
      viewAll: "Ver mercados",
      openMarket: "Abrir mercado",
    },
    index: {
      eyebrow: "Mercados ativos",
      title: "RegiKaha por país",
      description: "Pesquisa territorial completa em Espanha, França, Itália, Portugal, Suíça, Alemanha, Países Baixos, Bélgica, Irlanda e Reino Unido, com disponibilidade profissional transparente.",
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
      citiesTitle: "Todas as cidades e localidades",
      citiesText: "Pesquise qualquer cidade, município ou vila. Se ainda não houver profissionais ativos, publique a necessidade para iniciar captação local.",
      categoriesTitle: "Categorias principais",
      categoriesText: "Filtre por categoria e país para encontrar profissionais ou ativar captação se ainda não houver oferta suficiente.",
      clientsTitle: "Para clientes",
      clientsText: "Publique gratuitamente o seu projeto e receba estimativas iniciais não vinculativas quando houver profissionais disponíveis.",
      prosTitle: "Para profissionais",
      prosText: "Crie um perfil com SEO próprio, serviços, zonas de operação, logótipo, portefólio e ferramentas para enviar estimativas iniciais.",
      geoDataAttribution: "Dados geográficos de GeoNames (CC BY 4.0)",
      noCities: "Não existem localidades em destaque disponíveis para este mercado.",
    },
  },
  de: {
    home: {
      eyebrow: "Aktive Märkte",
      title: "Flächendeckende Suche in 10 Ländern",
      description: "Suchen Sie jede Stadt, Gemeinde, Ortschaft oder jedes Dorf in den aktiven Märkten. Die Verfügbarkeit von Fachbetrieben basiert stets auf echten Daten.",
      statsCountries: "aktive Länder",
      statsCities: "durchsuchbare Orte",
      viewAll: "Märkte ansehen",
      openMarket: "Markt öffnen",
    },
    index: {
      eyebrow: "Aktive Märkte",
      title: "RegiKaha nach Ländern",
      description: "Vollständige Ortssuche in Spanien, Frankreich, Italien, Portugal, der Schweiz, Deutschland, den Niederlanden, Belgien, Irland und dem Vereinigten Königreich mit transparenter Verfügbarkeit.",
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
      citiesTitle: "Alle Städte und Ortschaften",
      citiesText: "Suchen Sie jede Stadt, Gemeinde oder Ortschaft. Gibt es noch keine aktiven Fachbetriebe, können Sie Ihren Bedarf veröffentlichen und lokale Akquise auslösen.",
      categoriesTitle: "Hauptkategorien",
      categoriesText: "Filtern Sie nach Kategorie und Land, um Fachleute zu finden oder Akquise zu aktivieren, wenn das Angebot noch nicht ausreicht.",
      clientsTitle: "Für Kunden",
      clientsText: "Veröffentlichen Sie Ihr Projekt kostenlos und erhalten Sie unverbindliche Erstschätzungen, wenn Fachleute verfügbar sind.",
      prosTitle: "Für Fachleute",
      prosText: "Erstellen Sie ein Profil mit eigener SEO, Services, Einsatzgebieten, Logo, Portfolio und Werkzeugen für Erstschätzungen.",
      geoDataAttribution: "Geografische Daten von GeoNames (CC BY 4.0)",
      noCities: "Für diesen Markt sind keine hervorgehobenen Orte verfügbar.",
    },
  },
  nl: {
    home: {
      eyebrow: "Actieve markten",
      title: "Landelijke dekking in 10 landen",
      description: "Zoek elke stad, gemeente, plaats of dorp in de actieve markten. De beschikbaarheid van vakmensen is altijd gebaseerd op echte gegevens.",
      statsCountries: "actieve landen",
      statsCities: "doorzoekbare plaatsen",
      viewAll: "Markten bekijken",
      openMarket: "Markt openen",
    },
    index: {
      eyebrow: "Actieve markten",
      title: "RegiKaha per land",
      description: "Volledige plaatszoekfunctie in Spanje, Frankrijk, Italië, Portugal, Zwitserland, Duitsland, Nederland, België, Ierland en het Verenigd Koninkrijk, met transparante beschikbaarheid.",
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
      citiesTitle: "Alle steden en plaatsen",
      citiesText: "Zoek elke stad, gemeente of plaats. Zijn er nog geen actieve vakmensen, publiceer dan je behoefte om lokale werving te starten.",
      categoriesTitle: "Hoofdcategorieën",
      categoriesText: "Filter op categorie en land om professionals te vinden of acquisitie te activeren als er nog onvoldoende aanbod is.",
      clientsTitle: "Voor klanten",
      clientsText: "Publiceer gratis uw project en ontvang vrijblijvende eerste schattingen wanneer professionals beschikbaar zijn.",
      prosTitle: "Voor professionals",
      prosText: "Maak een profiel met eigen SEO, diensten, werkgebieden, logo, portfolio en tools om eerste schattingen te sturen.",
      geoDataAttribution: "Geografische gegevens van GeoNames (CC BY 4.0)",
      noCities: "Er zijn geen uitgelichte plaatsen beschikbaar voor deze markt.",
    },
  },
  en: {
    home: {
      eyebrow: "Active markets",
      title: "Nationwide coverage across 10 countries",
      description: "Search every city, town, municipality, village or locality in the active markets. Professional availability always uses real data.",
      statsCountries: "active countries",
      statsCities: "searchable places",
      viewAll: "View markets",
      openMarket: "Open market",
    },
    index: {
      eyebrow: "Active markets",
      title: "RegiKaha by country",
      description: "Complete place search across Spain, France, Italy, Portugal, Switzerland, Germany, the Netherlands, Belgium, Ireland and the United Kingdom, with transparent professional availability.",
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
      citiesTitle: "All cities and localities",
      citiesText: "Search any city, town, municipality or village. If there are no active professionals yet, publish your need to start local acquisition.",
      categoriesTitle: "Main categories",
      categoriesText: "Filter by category and country to find professionals or activate acquisition if supply is still limited.",
      clientsTitle: "For clients",
      clientsText: "Publish your project for free and receive non-binding initial estimates when professionals are available.",
      prosTitle: "For professionals",
      prosText: "Create a profile with its own SEO, services, operating areas, logo, portfolio and tools to send initial estimates.",
      geoDataAttribution: "Geographic data from GeoNames (CC BY 4.0)",
      noCities: "No highlighted locations are available for this market.",
    },
  },
};
