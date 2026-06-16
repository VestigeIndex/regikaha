import type { Locale } from "./config";

/**
 * Diccionarios de RegiKaha. `en` define la FORMA del diccionario; todos los
 * demás idiomas se tipan como `Dictionary`, por lo que TypeScript obliga a que
 * cada idioma tenga TODAS las claves (sin fallback). Al añadir una clave nueva,
 * el build falla hasta traducirla en los 24 idiomas.
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
    eyebrow: "Verified professionals across Europe",
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
      "European marketplace of verified professionals for renovations, construction and technical services. Ranked on merit, never on payment.",
    rights: "All rights reserved.",
  },
};

export type Dictionary = typeof en;

const bg: Dictionary = {
  nav: { search: "Намерете специалисти", categories: "Категории", howItWorks: "Как работи", forPros: "За специалисти", pricing: "Цени" },
  actions: { search: "Търсене", imPro: "Аз съм специалист", requestQuote: "Поискайте оферта", viewProfile: "Вижте профила", viewAll: "Вижте всички", joinPro: "Присъединете се като специалист" },
  hero: { eyebrow: "Проверени специалисти в цяла Европа", title: "Сравнете проверени специалисти за ремонти и технически услуги", subtitle: "Намерете фирми за ремонти, техници, монтажници, архитекти и инженери по цена, качество, район на обслужване, портфолио и реални оценки." },
  searchBar: { what: "От какво се нуждаете?", where: "Къде?", category: "Категория", button: "Търсене" },
  trust: { verified: "Проверени специалисти", realReviews: "Реални оценки", noPaidRanking: "Без платено класиране", freeForClients: "Безплатно за клиенти" },
  lang: { label: "Език" },
  footer: { tagline: "Европейски пазар на проверени специалисти за ремонти, строителство и технически услуги. Класиране по заслуги, никога срещу заплащане.", rights: "Всички права запазени." },
};

const hr: Dictionary = {
  nav: { search: "Pronađite stručnjake", categories: "Kategorije", howItWorks: "Kako funkcionira", forPros: "Za stručnjake", pricing: "Cijene" },
  actions: { search: "Pretraži", imPro: "Ja sam stručnjak", requestQuote: "Zatražite ponudu", viewProfile: "Pogledaj profil", viewAll: "Pogledaj sve", joinPro: "Pridružite se kao stručnjak" },
  hero: { eyebrow: "Provjereni stručnjaci diljem Europe", title: "Usporedite provjerene stručnjake za renovacije i tehničke usluge", subtitle: "Pronađite tvrtke za renovacije, tehničare, montere, arhitekte i inženjere prema cijeni, kvaliteti, području usluge, portfelju i stvarnim recenzijama." },
  searchBar: { what: "Što trebate?", where: "Gdje?", category: "Kategorija", button: "Pretraži" },
  trust: { verified: "Provjereni stručnjaci", realReviews: "Stvarne recenzije", noPaidRanking: "Bez plaćenog rangiranja", freeForClients: "Besplatno za klijente" },
  lang: { label: "Jezik" },
  footer: { tagline: "Europsko tržište provjerenih stručnjaka za renovacije, gradnju i tehničke usluge. Rangiranje po zasluzi, nikada po plaćanju.", rights: "Sva prava pridržana." },
};

const cs: Dictionary = {
  nav: { search: "Najít odborníky", categories: "Kategorie", howItWorks: "Jak to funguje", forPros: "Pro odborníky", pricing: "Ceník" },
  actions: { search: "Hledat", imPro: "Jsem odborník", requestQuote: "Vyžádat nabídku", viewProfile: "Zobrazit profil", viewAll: "Zobrazit vše", joinPro: "Připojit se jako odborník" },
  hero: { eyebrow: "Ověření odborníci po celé Evropě", title: "Porovnejte ověřené odborníky na rekonstrukce a technické služby", subtitle: "Najděte rekonstrukční firmy, techniky, montéry, architekty a inženýry podle ceny, kvality, oblasti služeb, portfolia a skutečných recenzí." },
  searchBar: { what: "Co potřebujete?", where: "Kde?", category: "Kategorie", button: "Hledat" },
  trust: { verified: "Ověření odborníci", realReviews: "Skutečné recenze", noPaidRanking: "Žádné placené pořadí", freeForClients: "Zdarma pro klienty" },
  lang: { label: "Jazyk" },
  footer: { tagline: "Evropský trh ověřených odborníků na rekonstrukce, stavbu a technické služby. Hodnocení podle zásluh, nikdy za platbu.", rights: "Všechna práva vyhrazena." },
};

const da: Dictionary = {
  nav: { search: "Find fagfolk", categories: "Kategorier", howItWorks: "Sådan fungerer det", forPros: "For fagfolk", pricing: "Priser" },
  actions: { search: "Søg", imPro: "Jeg er fagperson", requestQuote: "Anmod om tilbud", viewProfile: "Se profil", viewAll: "Se alle", joinPro: "Bliv fagperson" },
  hero: { eyebrow: "Verificerede fagfolk i hele Europa", title: "Sammenlign verificerede fagfolk til renovering og tekniske tjenester", subtitle: "Find renoveringsvirksomheder, teknikere, installatører, arkitekter og ingeniører efter pris, kvalitet, serviceområde, portefølje og rigtige anmeldelser." },
  searchBar: { what: "Hvad har du brug for?", where: "Hvor?", category: "Kategori", button: "Søg" },
  trust: { verified: "Verificerede fagfolk", realReviews: "Rigtige anmeldelser", noPaidRanking: "Ingen betalt placering", freeForClients: "Gratis for kunder" },
  lang: { label: "Sprog" },
  footer: { tagline: "Europæisk markedsplads for verificerede fagfolk til renovering, byggeri og tekniske tjenester. Rangeret efter fortjeneste, aldrig efter betaling.", rights: "Alle rettigheder forbeholdes." },
};

const nl: Dictionary = {
  nav: { search: "Vakmensen vinden", categories: "Categorieën", howItWorks: "Hoe het werkt", forPros: "Voor vakmensen", pricing: "Prijzen" },
  actions: { search: "Zoeken", imPro: "Ik ben vakman", requestQuote: "Offerte aanvragen", viewProfile: "Profiel bekijken", viewAll: "Alles bekijken", joinPro: "Word vakman" },
  hero: { eyebrow: "Geverifieerde vakmensen in heel Europa", title: "Vergelijk geverifieerde vakmensen voor renovaties en technische diensten", subtitle: "Vind renovatiebedrijven, technici, installateurs, architecten en ingenieurs op prijs, kwaliteit, werkgebied, portfolio en echte beoordelingen." },
  searchBar: { what: "Wat heeft u nodig?", where: "Waar?", category: "Categorie", button: "Zoeken" },
  trust: { verified: "Geverifieerde vakmensen", realReviews: "Echte beoordelingen", noPaidRanking: "Geen betaalde rankings", freeForClients: "Gratis voor klanten" },
  lang: { label: "Taal" },
  footer: { tagline: "Europese marktplaats van geverifieerde vakmensen voor renovaties, bouw en technische diensten. Gerangschikt op verdienste, nooit op betaling.", rights: "Alle rechten voorbehouden." },
};

const et: Dictionary = {
  nav: { search: "Leia spetsialiste", categories: "Kategooriad", howItWorks: "Kuidas see toimib", forPros: "Spetsialistidele", pricing: "Hinnad" },
  actions: { search: "Otsi", imPro: "Olen spetsialist", requestQuote: "Küsi pakkumist", viewProfile: "Vaata profiili", viewAll: "Vaata kõiki", joinPro: "Liitu spetsialistina" },
  hero: { eyebrow: "Kontrollitud spetsialistid üle Euroopa", title: "Võrdle kontrollitud spetsialiste renoveerimiseks ja tehnilisteks teenusteks", subtitle: "Leia renoveerimisettevõtteid, tehnikuid, paigaldajaid, arhitekte ja insenere hinna, kvaliteedi, teeninduspiirkonna, portfoolio ja tegelike arvustuste järgi." },
  searchBar: { what: "Mida vajate?", where: "Kus?", category: "Kategooria", button: "Otsi" },
  trust: { verified: "Kontrollitud spetsialistid", realReviews: "Tegelikud arvustused", noPaidRanking: "Tasulist edetabelit pole", freeForClients: "Klientidele tasuta" },
  lang: { label: "Keel" },
  footer: { tagline: "Euroopa kontrollitud spetsialistide turg renoveerimiseks, ehituseks ja tehnilisteks teenusteks. Järjestus teenete, mitte makse alusel.", rights: "Kõik õigused kaitstud." },
};

const fi: Dictionary = {
  nav: { search: "Etsi ammattilaisia", categories: "Kategoriat", howItWorks: "Näin se toimii", forPros: "Ammattilaisille", pricing: "Hinnat" },
  actions: { search: "Hae", imPro: "Olen ammattilainen", requestQuote: "Pyydä tarjous", viewProfile: "Näytä profiili", viewAll: "Näytä kaikki", joinPro: "Liity ammattilaisena" },
  hero: { eyebrow: "Vahvistetut ammattilaiset kaikkialla Euroopassa", title: "Vertaile vahvistettuja ammattilaisia remontteihin ja teknisiin palveluihin", subtitle: "Löydä remonttiyrityksiä, teknikoita, asentajia, arkkitehtejä ja insinöörejä hinnan, laadun, palvelualueen, portfolion ja aitojen arvostelujen perusteella." },
  searchBar: { what: "Mitä tarvitset?", where: "Missä?", category: "Kategoria", button: "Hae" },
  trust: { verified: "Vahvistetut ammattilaiset", realReviews: "Aidot arvostelut", noPaidRanking: "Ei maksettuja sijoituksia", freeForClients: "Ilmainen asiakkaille" },
  lang: { label: "Kieli" },
  footer: { tagline: "Euroopan vahvistettujen ammattilaisten markkinapaikka remontteihin, rakentamiseen ja teknisiin palveluihin. Järjestys ansioiden, ei maksun mukaan.", rights: "Kaikki oikeudet pidätetään." },
};

const fr: Dictionary = {
  nav: { search: "Trouver des professionnels", categories: "Catégories", howItWorks: "Comment ça marche", forPros: "Pour les professionnels", pricing: "Tarifs" },
  actions: { search: "Rechercher", imPro: "Je suis un professionnel", requestQuote: "Demander un devis", viewProfile: "Voir le profil", viewAll: "Voir tout", joinPro: "Devenir professionnel" },
  hero: { eyebrow: "Professionnels vérifiés dans toute l'Europe", title: "Comparez des professionnels vérifiés pour vos rénovations et services techniques", subtitle: "Trouvez des entreprises de rénovation, des techniciens, des installateurs, des architectes et des ingénieurs selon le prix, la qualité, la zone d'intervention, le portfolio et de vrais avis." },
  searchBar: { what: "De quoi avez-vous besoin ?", where: "Où ?", category: "Catégorie", button: "Rechercher" },
  trust: { verified: "Professionnels vérifiés", realReviews: "Avis réels", noPaidRanking: "Aucun classement payant", freeForClients: "Gratuit pour les clients" },
  lang: { label: "Langue" },
  footer: { tagline: "Place de marché européenne de professionnels vérifiés pour la rénovation, la construction et les services techniques. Classement au mérite, jamais payant.", rights: "Tous droits réservés." },
};

const de: Dictionary = {
  nav: { search: "Fachleute finden", categories: "Kategorien", howItWorks: "So funktioniert's", forPros: "Für Fachleute", pricing: "Preise" },
  actions: { search: "Suchen", imPro: "Ich bin Fachmann", requestQuote: "Angebot anfordern", viewProfile: "Profil ansehen", viewAll: "Alle ansehen", joinPro: "Als Fachmann beitreten" },
  hero: { eyebrow: "Verifizierte Fachleute in ganz Europa", title: "Vergleichen Sie verifizierte Fachleute für Renovierungen und technische Dienstleistungen", subtitle: "Finden Sie Renovierungsfirmen, Techniker, Installateure, Architekten und Ingenieure nach Preis, Qualität, Einsatzgebiet, Portfolio und echten Bewertungen." },
  searchBar: { what: "Was brauchen Sie?", where: "Wo?", category: "Kategorie", button: "Suchen" },
  trust: { verified: "Verifizierte Fachleute", realReviews: "Echte Bewertungen", noPaidRanking: "Keine bezahlten Rankings", freeForClients: "Kostenlos für Kunden" },
  lang: { label: "Sprache" },
  footer: { tagline: "Europäischer Marktplatz für verifizierte Fachleute für Renovierung, Bau und technische Dienstleistungen. Ranking nach Leistung, niemals nach Bezahlung.", rights: "Alle Rechte vorbehalten." },
};

const el: Dictionary = {
  nav: { search: "Βρείτε επαγγελματίες", categories: "Κατηγορίες", howItWorks: "Πώς λειτουργεί", forPros: "Για επαγγελματίες", pricing: "Τιμές" },
  actions: { search: "Αναζήτηση", imPro: "Είμαι επαγγελματίας", requestQuote: "Ζητήστε προσφορά", viewProfile: "Προβολή προφίλ", viewAll: "Προβολή όλων", joinPro: "Γίνετε επαγγελματίας" },
  hero: { eyebrow: "Επαληθευμένοι επαγγελματίες σε όλη την Ευρώπη", title: "Συγκρίνετε επαληθευμένους επαγγελματίες για ανακαινίσεις και τεχνικές υπηρεσίες", subtitle: "Βρείτε εταιρείες ανακαίνισης, τεχνικούς, εγκαταστάτες, αρχιτέκτονες και μηχανικούς με βάση την τιμή, την ποιότητα, την περιοχή εξυπηρέτησης, το χαρτοφυλάκιο και πραγματικές κριτικές." },
  searchBar: { what: "Τι χρειάζεστε;", where: "Πού;", category: "Κατηγορία", button: "Αναζήτηση" },
  trust: { verified: "Επαληθευμένοι επαγγελματίες", realReviews: "Πραγματικές κριτικές", noPaidRanking: "Καμία πληρωμένη κατάταξη", freeForClients: "Δωρεάν για πελάτες" },
  lang: { label: "Γλώσσα" },
  footer: { tagline: "Ευρωπαϊκή αγορά επαληθευμένων επαγγελματιών για ανακαινίσεις, κατασκευές και τεχνικές υπηρεσίες. Κατάταξη βάσει αξίας, ποτέ βάσει πληρωμής.", rights: "Με επιφύλαξη παντός δικαιώματος." },
};

const hu: Dictionary = {
  nav: { search: "Szakemberek keresése", categories: "Kategóriák", howItWorks: "Hogyan működik", forPros: "Szakembereknek", pricing: "Árak" },
  actions: { search: "Keresés", imPro: "Szakember vagyok", requestQuote: "Ajánlatkérés", viewProfile: "Profil megtekintése", viewAll: "Összes megtekintése", joinPro: "Csatlakozz szakemberként" },
  hero: { eyebrow: "Ellenőrzött szakemberek Európa-szerte", title: "Hasonlítson össze ellenőrzött szakembereket felújításhoz és műszaki szolgáltatásokhoz", subtitle: "Találjon felújító cégeket, technikusokat, szerelőket, építészeket és mérnököket ár, minőség, szolgáltatási terület, portfólió és valódi értékelések alapján." },
  searchBar: { what: "Mire van szüksége?", where: "Hol?", category: "Kategória", button: "Keresés" },
  trust: { verified: "Ellenőrzött szakemberek", realReviews: "Valódi értékelések", noPaidRanking: "Nincs fizetett rangsor", freeForClients: "Ingyenes ügyfeleknek" },
  lang: { label: "Nyelv" },
  footer: { tagline: "Ellenőrzött szakemberek európai piactere felújításhoz, építkezéshez és műszaki szolgáltatásokhoz. Rangsorolás érdem alapján, soha nem fizetésért.", rights: "Minden jog fenntartva." },
};

const ga: Dictionary = {
  nav: { search: "Aimsigh gairmithe", categories: "Catagóirí", howItWorks: "Conas a oibríonn sé", forPros: "Do ghairmithe", pricing: "Praghsáil" },
  actions: { search: "Cuardaigh", imPro: "Is gairmí mé", requestQuote: "Iarr meastachán", viewProfile: "Féach próifíl", viewAll: "Féach uile", joinPro: "Bí mar ghairmí" },
  hero: { eyebrow: "Gairmithe fíoraithe ar fud na hEorpa", title: "Déan comparáid idir gairmithe fíoraithe le haghaidh athchóirithe agus seirbhísí teicniúla", subtitle: "Aimsigh comhlachtaí athchóirithe, teicneoirí, suiteálaithe, ailtirí agus innealtóirí de réir praghais, cáilíochta, limistéar seirbhíse, punann agus fíor-léirmheasanna." },
  searchBar: { what: "Cad atá uait?", where: "Cá háit?", category: "Catagóir", button: "Cuardaigh" },
  trust: { verified: "Gairmithe fíoraithe", realReviews: "Fíor-léirmheasanna", noPaidRanking: "Gan rangú íoctha", freeForClients: "Saor in aisce do chliaint" },
  lang: { label: "Teanga" },
  footer: { tagline: "Margadh Eorpach gairmithe fíoraithe le haghaidh athchóirithe, tógála agus seirbhísí teicniúla. Rangú de réir fiúntais, riamh de réir íocaíochta.", rights: "Gach ceart ar cosaint." },
};

const it: Dictionary = {
  nav: { search: "Trova professionisti", categories: "Categorie", howItWorks: "Come funziona", forPros: "Per i professionisti", pricing: "Prezzi" },
  actions: { search: "Cerca", imPro: "Sono un professionista", requestQuote: "Richiedi un preventivo", viewProfile: "Vedi profilo", viewAll: "Vedi tutti", joinPro: "Unisciti come professionista" },
  hero: { eyebrow: "Professionisti verificati in tutta Europa", title: "Confronta professionisti verificati per ristrutturazioni e servizi tecnici", subtitle: "Trova imprese di ristrutturazione, tecnici, installatori, architetti e ingegneri per prezzo, qualità, zona di servizio, portfolio e recensioni reali." },
  searchBar: { what: "Di cosa hai bisogno?", where: "Dove?", category: "Categoria", button: "Cerca" },
  trust: { verified: "Professionisti verificati", realReviews: "Recensioni reali", noPaidRanking: "Nessun posizionamento a pagamento", freeForClients: "Gratis per i clienti" },
  lang: { label: "Lingua" },
  footer: { tagline: "Marketplace europeo di professionisti verificati per ristrutturazioni, edilizia e servizi tecnici. Classifica per merito, mai a pagamento.", rights: "Tutti i diritti riservati." },
};

const lv: Dictionary = {
  nav: { search: "Atrast speciālistus", categories: "Kategorijas", howItWorks: "Kā tas darbojas", forPros: "Speciālistiem", pricing: "Cenas" },
  actions: { search: "Meklēt", imPro: "Esmu speciālists", requestQuote: "Pieprasīt piedāvājumu", viewProfile: "Skatīt profilu", viewAll: "Skatīt visus", joinPro: "Pievienoties kā speciālistam" },
  hero: { eyebrow: "Pārbaudīti speciālisti visā Eiropā", title: "Salīdziniet pārbaudītus speciālistus renovācijai un tehniskajiem pakalpojumiem", subtitle: "Atrodiet renovācijas uzņēmumus, tehniķus, montētājus, arhitektus un inženierus pēc cenas, kvalitātes, apkalpošanas zonas, portfolio un reālām atsauksmēm." },
  searchBar: { what: "Kas jums nepieciešams?", where: "Kur?", category: "Kategorija", button: "Meklēt" },
  trust: { verified: "Pārbaudīti speciālisti", realReviews: "Reālas atsauksmes", noPaidRanking: "Bez apmaksāta reitinga", freeForClients: "Bezmaksas klientiem" },
  lang: { label: "Valoda" },
  footer: { tagline: "Eiropas pārbaudītu speciālistu tirgus renovācijai, būvniecībai un tehniskajiem pakalpojumiem. Vērtējums pēc nopelniem, nekad par samaksu.", rights: "Visas tiesības aizsargātas." },
};

const lt: Dictionary = {
  nav: { search: "Rasti specialistų", categories: "Kategorijos", howItWorks: "Kaip tai veikia", forPros: "Specialistams", pricing: "Kainos" },
  actions: { search: "Ieškoti", imPro: "Esu specialistas", requestQuote: "Prašyti pasiūlymo", viewProfile: "Žiūrėti profilį", viewAll: "Žiūrėti visus", joinPro: "Prisijungti kaip specialistas" },
  hero: { eyebrow: "Patikrinti specialistai visoje Europoje", title: "Palyginkite patikrintus specialistus renovacijai ir techninėms paslaugoms", subtitle: "Raskite renovacijos įmones, technikus, montuotojus, architektus ir inžinierius pagal kainą, kokybę, aptarnavimo zoną, portfelį ir tikrus atsiliepimus." },
  searchBar: { what: "Ko jums reikia?", where: "Kur?", category: "Kategorija", button: "Ieškoti" },
  trust: { verified: "Patikrinti specialistai", realReviews: "Tikri atsiliepimai", noPaidRanking: "Jokio mokamo reitingavimo", freeForClients: "Nemokama klientams" },
  lang: { label: "Kalba" },
  footer: { tagline: "Europos patikrintų specialistų rinka renovacijai, statyboms ir techninėms paslaugoms. Reitingas pagal nuopelnus, niekada už mokestį.", rights: "Visos teisės saugomos." },
};

const mt: Dictionary = {
  nav: { search: "Sib professjonisti", categories: "Kategoriji", howItWorks: "Kif jaħdem", forPros: "Għall-professjonisti", pricing: "Prezzijiet" },
  actions: { search: "Fittex", imPro: "Jien professjonist", requestQuote: "Itlob kwotazzjoni", viewProfile: "Ara l-profil", viewAll: "Ara kollox", joinPro: "Issieħeb bħala professjonist" },
  hero: { eyebrow: "Professjonisti verifikati madwar l-Ewropa", title: "Qabbel professjonisti verifikati għal rinnovazzjonijiet u servizzi tekniċi", subtitle: "Sib kumpaniji tar-rinnovazzjoni, tekniċi, installaturi, periti u inġiniera skont il-prezz, il-kwalità, iż-żona tas-servizz, il-portfolio u reviżjonijiet reali." },
  searchBar: { what: "X'għandek bżonn?", where: "Fejn?", category: "Kategorija", button: "Fittex" },
  trust: { verified: "Professjonisti verifikati", realReviews: "Reviżjonijiet reali", noPaidRanking: "L-ebda klassifika mħallsa", freeForClients: "Bla ħlas għall-klijenti" },
  lang: { label: "Lingwa" },
  footer: { tagline: "Suq Ewropew ta' professjonisti verifikati għal rinnovazzjonijiet, kostruzzjoni u servizzi tekniċi. Klassifika fuq il-mertu, qatt fuq ħlas.", rights: "Id-drittijiet kollha riżervati." },
};

const pl: Dictionary = {
  nav: { search: "Znajdź specjalistów", categories: "Kategorie", howItWorks: "Jak to działa", forPros: "Dla specjalistów", pricing: "Cennik" },
  actions: { search: "Szukaj", imPro: "Jestem specjalistą", requestQuote: "Poproś o wycenę", viewProfile: "Zobacz profil", viewAll: "Zobacz wszystkie", joinPro: "Dołącz jako specjalista" },
  hero: { eyebrow: "Zweryfikowani specjaliści w całej Europie", title: "Porównaj zweryfikowanych specjalistów do remontów i usług technicznych", subtitle: "Znajdź firmy remontowe, techników, instalatorów, architektów i inżynierów według ceny, jakości, obszaru usług, portfolio i prawdziwych opinii." },
  searchBar: { what: "Czego potrzebujesz?", where: "Gdzie?", category: "Kategoria", button: "Szukaj" },
  trust: { verified: "Zweryfikowani specjaliści", realReviews: "Prawdziwe opinie", noPaidRanking: "Bez płatnych rankingów", freeForClients: "Bezpłatnie dla klientów" },
  lang: { label: "Język" },
  footer: { tagline: "Europejski rynek zweryfikowanych specjalistów do remontów, budowy i usług technicznych. Ranking według zasług, nigdy za opłatą.", rights: "Wszelkie prawa zastrzeżone." },
};

const pt: Dictionary = {
  nav: { search: "Encontrar profissionais", categories: "Categorias", howItWorks: "Como funciona", forPros: "Para profissionais", pricing: "Preços" },
  actions: { search: "Pesquisar", imPro: "Sou profissional", requestQuote: "Pedir orçamento", viewProfile: "Ver perfil", viewAll: "Ver todos", joinPro: "Juntar-me como profissional" },
  hero: { eyebrow: "Profissionais verificados em toda a Europa", title: "Compare profissionais verificados para remodelações e serviços técnicos", subtitle: "Encontre empresas de remodelação, técnicos, instaladores, arquitetos e engenheiros por preço, qualidade, área de serviço, portefólio e avaliações reais." },
  searchBar: { what: "Do que precisa?", where: "Onde?", category: "Categoria", button: "Pesquisar" },
  trust: { verified: "Profissionais verificados", realReviews: "Avaliações reais", noPaidRanking: "Sem classificações pagas", freeForClients: "Grátis para clientes" },
  lang: { label: "Idioma" },
  footer: { tagline: "Mercado europeu de profissionais verificados para remodelações, construção e serviços técnicos. Classificação por mérito, nunca por pagamento.", rights: "Todos os direitos reservados." },
};

const ro: Dictionary = {
  nav: { search: "Găsește profesioniști", categories: "Categorii", howItWorks: "Cum funcționează", forPros: "Pentru profesioniști", pricing: "Prețuri" },
  actions: { search: "Caută", imPro: "Sunt profesionist", requestQuote: "Cere o ofertă", viewProfile: "Vezi profilul", viewAll: "Vezi toate", joinPro: "Alătură-te ca profesionist" },
  hero: { eyebrow: "Profesioniști verificați în toată Europa", title: "Compară profesioniști verificați pentru renovări și servicii tehnice", subtitle: "Găsește firme de renovări, tehnicieni, instalatori, arhitecți și ingineri după preț, calitate, zonă de servicii, portofoliu și recenzii reale." },
  searchBar: { what: "De ce ai nevoie?", where: "Unde?", category: "Categorie", button: "Caută" },
  trust: { verified: "Profesioniști verificați", realReviews: "Recenzii reale", noPaidRanking: "Fără clasamente plătite", freeForClients: "Gratuit pentru clienți" },
  lang: { label: "Limbă" },
  footer: { tagline: "Piață europeană de profesioniști verificați pentru renovări, construcții și servicii tehnice. Clasare după merit, niciodată contra cost.", rights: "Toate drepturile rezervate." },
};

const sk: Dictionary = {
  nav: { search: "Nájsť odborníkov", categories: "Kategórie", howItWorks: "Ako to funguje", forPros: "Pre odborníkov", pricing: "Cenník" },
  actions: { search: "Hľadať", imPro: "Som odborník", requestQuote: "Vyžiadať ponuku", viewProfile: "Zobraziť profil", viewAll: "Zobraziť všetkých", joinPro: "Pridať sa ako odborník" },
  hero: { eyebrow: "Overení odborníci v celej Európe", title: "Porovnajte overených odborníkov na rekonštrukcie a technické služby", subtitle: "Nájdite rekonštrukčné firmy, technikov, montérov, architektov a inžinierov podľa ceny, kvality, oblasti služieb, portfólia a skutočných recenzií." },
  searchBar: { what: "Čo potrebujete?", where: "Kde?", category: "Kategória", button: "Hľadať" },
  trust: { verified: "Overení odborníci", realReviews: "Skutočné recenzie", noPaidRanking: "Žiadne platené poradie", freeForClients: "Zadarmo pre klientov" },
  lang: { label: "Jazyk" },
  footer: { tagline: "Európsky trh overených odborníkov na rekonštrukcie, stavbu a technické služby. Hodnotenie podľa zásluh, nikdy za platbu.", rights: "Všetky práva vyhradené." },
};

const sl: Dictionary = {
  nav: { search: "Poiščite strokovnjake", categories: "Kategorije", howItWorks: "Kako deluje", forPros: "Za strokovnjake", pricing: "Cene" },
  actions: { search: "Iskanje", imPro: "Sem strokovnjak", requestQuote: "Zahtevaj ponudbo", viewProfile: "Ogled profila", viewAll: "Ogled vseh", joinPro: "Pridružite se kot strokovnjak" },
  hero: { eyebrow: "Preverjeni strokovnjaki po vsej Evropi", title: "Primerjajte preverjene strokovnjake za prenove in tehnične storitve", subtitle: "Poiščite podjetja za prenove, tehnike, monterje, arhitekte in inženirje glede na ceno, kakovost, območje storitev, portfelj in resnične ocene." },
  searchBar: { what: "Kaj potrebujete?", where: "Kje?", category: "Kategorija", button: "Iskanje" },
  trust: { verified: "Preverjeni strokovnjaki", realReviews: "Resnične ocene", noPaidRanking: "Brez plačanih razvrstitev", freeForClients: "Brezplačno za stranke" },
  lang: { label: "Jezik" },
  footer: { tagline: "Evropska tržnica preverjenih strokovnjakov za prenove, gradnjo in tehnične storitve. Razvrstitev po zaslugah, nikoli po plačilu.", rights: "Vse pravice pridržane." },
};

const es: Dictionary = {
  nav: { search: "Buscar profesionales", categories: "Categorías", howItWorks: "Cómo funciona", forPros: "Para profesionales", pricing: "Precios" },
  actions: { search: "Buscar", imPro: "Soy profesional", requestQuote: "Pedir pre-presupuesto", viewProfile: "Ver perfil", viewAll: "Ver todos", joinPro: "Unirme como profesional" },
  hero: { eyebrow: "Profesionales y subcontratas verificadas en Europa", title: "Encuentra profesionales y subcontratas verificadas para reformas, obras e instalaciones", subtitle: "Publica tu proyecto gratis, recibe pre-presupuestos iniciales, compara profesionales en el mapa y confirma el presupuesto definitivo antes de contratar." },
  searchBar: { what: "¿Qué necesitas?", where: "¿Dónde?", category: "Categoría", button: "Buscar" },
  trust: { verified: "Profesionales verificados", realReviews: "Valoraciones reales", noPaidRanking: "Sin rankings comprados", freeForClients: "Gratis para clientes" },
  lang: { label: "Idioma" },
  footer: { tagline: "Marketplace europeo de profesionales verificados para reformas, construcción y servicios técnicos. Posicionamiento por mérito, nunca por pago.", rights: "Todos los derechos reservados." },
};

const sv: Dictionary = {
  nav: { search: "Hitta yrkespersoner", categories: "Kategorier", howItWorks: "Så fungerar det", forPros: "För yrkespersoner", pricing: "Priser" },
  actions: { search: "Sök", imPro: "Jag är yrkesperson", requestQuote: "Begär offert", viewProfile: "Visa profil", viewAll: "Visa alla", joinPro: "Gå med som yrkesperson" },
  hero: { eyebrow: "Verifierade yrkespersoner i hela Europa", title: "Jämför verifierade yrkespersoner för renoveringar och tekniska tjänster", subtitle: "Hitta renoveringsföretag, tekniker, installatörer, arkitekter och ingenjörer efter pris, kvalitet, serviceområde, portfölj och riktiga omdömen." },
  searchBar: { what: "Vad behöver du?", where: "Var?", category: "Kategori", button: "Sök" },
  trust: { verified: "Verifierade yrkespersoner", realReviews: "Riktiga omdömen", noPaidRanking: "Inga betalda placeringar", freeForClients: "Gratis för kunder" },
  lang: { label: "Språk" },
  footer: { tagline: "Europeisk marknadsplats för verifierade yrkespersoner för renovering, byggnation och tekniska tjänster. Rankning efter förtjänst, aldrig efter betalning.", rights: "Alla rättigheter förbehållna." },
};

export const dictionaries: Record<Locale, Dictionary> = {
  es, fr, it, pt, de, nl, en,
};
