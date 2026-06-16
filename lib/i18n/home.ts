import type { Locale } from "./config";

/**
 * Extensión del diccionario para la HOME (fase 2). Se fusiona con el
 * diccionario base en el contexto. Tipado por `HomeDict` → completitud forzada
 * en los 24 idiomas (sin fallback).
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

const bg: HomeDict = {
  heroExtra: { avgRating: "Средна оценка", meritDesc: "Само заслуги и репутация" },
  trustExtra: { verifiedDesc: "Самоличност и дейност проверени.", realReviewsDesc: "Само от извършени услуги.", noPaidRankingDesc: "Никой не плаща за първо място.", freeForClientsDesc: "Търсете и искайте оферта безплатно." },
  finalCta: { title: "Следващият ви проект започва със сравняване на проверени специалисти", text: "Безплатно за клиенти. Без платено класиране. Само проверени специалисти, които се отличават с работата си." },
};
const hr: HomeDict = {
  heroExtra: { avgRating: "Prosječna ocjena", meritDesc: "Samo zasluge i ugled" },
  trustExtra: { verifiedDesc: "Identitet i djelatnost provjereni.", realReviewsDesc: "Samo iz obavljenih usluga.", noPaidRankingDesc: "Nitko ne plaća za prvo mjesto.", freeForClientsDesc: "Tražite i zatražite ponudu besplatno." },
  finalCta: { title: "Vaš sljedeći projekt počinje usporedbom provjerenih stručnjaka", text: "Besplatno za klijente. Bez plaćenog rangiranja. Samo provjereni stručnjaci koji se ističu radom." },
};
const cs: HomeDict = {
  heroExtra: { avgRating: "Průměrné hodnocení", meritDesc: "Pouze zásluhy a pověst" },
  trustExtra: { verifiedDesc: "Totožnost a činnost ověřeny.", realReviewsDesc: "Pouze z provedených služeb.", noPaidRankingDesc: "Nikdo neplatí za první místo.", freeForClientsDesc: "Hledejte a žádejte nabídku zdarma." },
  finalCta: { title: "Váš další projekt začíná porovnáním ověřených odborníků", text: "Zdarma pro klienty. Žádné placené pořadí. Pouze ověření odborníci, kteří vynikají svou prací." },
};
const da: HomeDict = {
  heroExtra: { avgRating: "Gennemsnitlig bedømmelse", meritDesc: "Kun fortjeneste og omdømme" },
  trustExtra: { verifiedDesc: "Identitet og aktivitet kontrolleret.", realReviewsDesc: "Kun fra udførte tjenester.", noPaidRankingDesc: "Ingen betaler for førstepladsen.", freeForClientsDesc: "Søg og bed om tilbud gratis." },
  finalCta: { title: "Dit næste projekt starter med at sammenligne verificerede fagfolk", text: "Gratis for kunder. Ingen betalt placering. Kun verificerede fagfolk, der skiller sig ud ved deres arbejde." },
};
const nl: HomeDict = {
  heroExtra: { avgRating: "Gemiddelde beoordeling", meritDesc: "Alleen verdienste en reputatie" },
  trustExtra: { verifiedDesc: "Identiteit en activiteit gecontroleerd.", realReviewsDesc: "Alleen van voltooide diensten.", noPaidRankingDesc: "Niemand betaalt voor de eerste plaats.", freeForClientsDesc: "Zoek en vraag gratis offertes aan." },
  finalCta: { title: "Uw volgende project begint met het vergelijken van geverifieerde vakmensen", text: "Gratis voor klanten. Geen betaalde rankings. Alleen geverifieerde vakmensen die uitblinken in hun werk." },
};
const et: HomeDict = {
  heroExtra: { avgRating: "Keskmine hinnang", meritDesc: "Ainult teened ja maine" },
  trustExtra: { verifiedDesc: "Isik ja tegevus kontrollitud.", realReviewsDesc: "Ainult tehtud teenustest.", noPaidRankingDesc: "Keegi ei maksa esikoha eest.", freeForClientsDesc: "Otsi ja küsi pakkumist tasuta." },
  finalCta: { title: "Sinu järgmine projekt algab kontrollitud spetsialistide võrdlemisega", text: "Klientidele tasuta. Tasulist edetabelit pole. Ainult kontrollitud spetsialistid, kes paistavad silma oma tööga." },
};
const fi: HomeDict = {
  heroExtra: { avgRating: "Keskiarvosana", meritDesc: "Vain ansiot ja maine" },
  trustExtra: { verifiedDesc: "Henkilöllisyys ja toiminta tarkistettu.", realReviewsDesc: "Vain tehdyistä palveluista.", noPaidRankingDesc: "Kukaan ei maksa ykköspaikasta.", freeForClientsDesc: "Hae ja pyydä tarjous ilmaiseksi." },
  finalCta: { title: "Seuraava projektisi alkaa vertailemalla vahvistettuja ammattilaisia", text: "Ilmainen asiakkaille. Ei maksettuja sijoituksia. Vain vahvistettuja ammattilaisia, jotka erottuvat työllään." },
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
const el: HomeDict = {
  heroExtra: { avgRating: "Μέση βαθμολογία", meritDesc: "Μόνο αξία και φήμη" },
  trustExtra: { verifiedDesc: "Ταυτότητα και δραστηριότητα ελεγμένες.", realReviewsDesc: "Μόνο από ολοκληρωμένες υπηρεσίες.", noPaidRankingDesc: "Κανείς δεν πληρώνει για την πρώτη θέση.", freeForClientsDesc: "Αναζητήστε και ζητήστε προσφορά δωρεάν." },
  finalCta: { title: "Το επόμενο έργο σας ξεκινά συγκρίνοντας επαληθευμένους επαγγελματίες", text: "Δωρεάν για πελάτες. Καμία πληρωμένη κατάταξη. Μόνο επαληθευμένοι επαγγελματίες που ξεχωρίζουν για τη δουλειά τους." },
};
const hu: HomeDict = {
  heroExtra: { avgRating: "Átlagos értékelés", meritDesc: "Csak érdem és hírnév" },
  trustExtra: { verifiedDesc: "Személyazonosság és tevékenység ellenőrizve.", realReviewsDesc: "Csak elvégzett szolgáltatásokból.", noPaidRankingDesc: "Senki nem fizet az első helyért.", freeForClientsDesc: "Keressen és kérjen ajánlatot ingyen." },
  finalCta: { title: "A következő projektje ellenőrzött szakemberek összehasonlításával kezdődik", text: "Ingyenes ügyfeleknek. Nincs fizetett rangsor. Csak ellenőrzött szakemberek, akik kitűnnek a munkájukkal." },
};
const ga: HomeDict = {
  heroExtra: { avgRating: "Rátáil mheánach", meritDesc: "Fiúntas agus cáil amháin" },
  trustExtra: { verifiedDesc: "Aitheantas agus gníomhaíocht seiceáilte.", realReviewsDesc: "Ó sheirbhísí críochnaithe amháin.", noPaidRankingDesc: "Ní íocann aon duine as an gcéad áit.", freeForClientsDesc: "Cuardaigh agus iarr meastachán saor in aisce." },
  finalCta: { title: "Tosaíonn do chéad tionscadal eile trí ghairmithe fíoraithe a chur i gcomparáid", text: "Saor in aisce do chliaint. Gan rangú íoctha. Gairmithe fíoraithe amháin a sheasann amach as a gcuid oibre." },
};
const it: HomeDict = {
  heroExtra: { avgRating: "Valutazione media", meritDesc: "Solo merito e reputazione" },
  trustExtra: { verifiedDesc: "Identità e attività verificate.", realReviewsDesc: "Solo da servizi completati.", noPaidRankingDesc: "Nessuno paga per il primo posto.", freeForClientsDesc: "Cerca e richiedi preventivi gratis." },
  finalCta: { title: "Il tuo prossimo progetto inizia confrontando professionisti verificati", text: "Gratis per i clienti. Nessun posizionamento a pagamento. Solo professionisti verificati che si distinguono per il loro lavoro." },
};
const lv: HomeDict = {
  heroExtra: { avgRating: "Vidējais vērtējums", meritDesc: "Tikai nopelni un reputācija" },
  trustExtra: { verifiedDesc: "Identitāte un darbība pārbaudīta.", realReviewsDesc: "Tikai no paveiktiem pakalpojumiem.", noPaidRankingDesc: "Neviens nemaksā par pirmo vietu.", freeForClientsDesc: "Meklējiet un pieprasiet piedāvājumu bez maksas." },
  finalCta: { title: "Jūsu nākamais projekts sākas, salīdzinot pārbaudītus speciālistus", text: "Bezmaksas klientiem. Bez apmaksāta reitinga. Tikai pārbaudīti speciālisti, kas izceļas ar savu darbu." },
};
const lt: HomeDict = {
  heroExtra: { avgRating: "Vidutinis įvertinimas", meritDesc: "Tik nuopelnai ir reputacija" },
  trustExtra: { verifiedDesc: "Tapatybė ir veikla patikrinta.", realReviewsDesc: "Tik iš atliktų paslaugų.", noPaidRankingDesc: "Niekas nemoka už pirmą vietą.", freeForClientsDesc: "Ieškokite ir prašykite pasiūlymo nemokamai." },
  finalCta: { title: "Kitas jūsų projektas prasideda lyginant patikrintus specialistus", text: "Nemokama klientams. Jokio mokamo reitingavimo. Tik patikrinti specialistai, kurie išsiskiria savo darbu." },
};
const mt: HomeDict = {
  heroExtra: { avgRating: "Klassifikazzjoni medja", meritDesc: "Mertu u reputazzjoni biss" },
  trustExtra: { verifiedDesc: "Identità u attività vverifikati.", realReviewsDesc: "Minn servizzi mwettqa biss.", noPaidRankingDesc: "Ħadd ma jħallas għall-ewwel post.", freeForClientsDesc: "Fittex u itlob kwotazzjoni bla ħlas." },
  finalCta: { title: "Il-proġett li jmiss tiegħek jibda billi tqabbel professjonisti verifikati", text: "Bla ħlas għall-klijenti. L-ebda klassifika mħallsa. Professjonisti verifikati biss li jispikkaw għax-xogħol tagħhom." },
};
const pl: HomeDict = {
  heroExtra: { avgRating: "Średnia ocena", meritDesc: "Tylko zasługi i reputacja" },
  trustExtra: { verifiedDesc: "Tożsamość i działalność zweryfikowane.", realReviewsDesc: "Tylko ze zrealizowanych usług.", noPaidRankingDesc: "Nikt nie płaci za pierwsze miejsce.", freeForClientsDesc: "Szukaj i proś o wycenę za darmo." },
  finalCta: { title: "Twój następny projekt zaczyna się od porównania zweryfikowanych specjalistów", text: "Bezpłatnie dla klientów. Bez płatnych rankingów. Tylko zweryfikowani specjaliści wyróżniający się swoją pracą." },
};
const pt: HomeDict = {
  heroExtra: { avgRating: "Avaliação média", meritDesc: "Apenas mérito e reputação" },
  trustExtra: { verifiedDesc: "Identidade e atividade verificadas.", realReviewsDesc: "Apenas de serviços realizados.", noPaidRankingDesc: "Ninguém paga para aparecer primeiro.", freeForClientsDesc: "Pesquise e peça orçamento grátis." },
  finalCta: { title: "O seu próximo projeto começa comparando profissionais verificados", text: "Grátis para clientes. Sem classificações pagas. Apenas profissionais verificados que se destacam pelo seu trabalho." },
};
const ro: HomeDict = {
  heroExtra: { avgRating: "Evaluare medie", meritDesc: "Doar merit și reputație" },
  trustExtra: { verifiedDesc: "Identitate și activitate verificate.", realReviewsDesc: "Doar din servicii realizate.", noPaidRankingDesc: "Nimeni nu plătește pentru primul loc.", freeForClientsDesc: "Caută și cere ofertă gratuit." },
  finalCta: { title: "Următorul tău proiect începe comparând profesioniști verificați", text: "Gratuit pentru clienți. Fără clasamente plătite. Doar profesioniști verificați care se remarcă prin munca lor." },
};
const sk: HomeDict = {
  heroExtra: { avgRating: "Priemerné hodnotenie", meritDesc: "Len zásluhy a povesť" },
  trustExtra: { verifiedDesc: "Totožnosť a činnosť overené.", realReviewsDesc: "Len z vykonaných služieb.", noPaidRankingDesc: "Nikto neplatí za prvé miesto.", freeForClientsDesc: "Hľadajte a žiadajte ponuku zadarmo." },
  finalCta: { title: "Váš ďalší projekt začína porovnaním overených odborníkov", text: "Zadarmo pre klientov. Žiadne platené poradie. Len overení odborníci, ktorí vynikajú svojou prácou." },
};
const sl: HomeDict = {
  heroExtra: { avgRating: "Povprečna ocena", meritDesc: "Samo zasluge in ugled" },
  trustExtra: { verifiedDesc: "Istovetnost in dejavnost preverjeni.", realReviewsDesc: "Samo iz opravljenih storitev.", noPaidRankingDesc: "Nihče ne plača za prvo mesto.", freeForClientsDesc: "Iščite in zahtevajte ponudbo brezplačno." },
  finalCta: { title: "Vaš naslednji projekt se začne s primerjavo preverjenih strokovnjakov", text: "Brezplačno za stranke. Brez plačanih razvrstitev. Samo preverjeni strokovnjaki, ki izstopajo s svojim delom." },
};
const es: HomeDict = {
  heroExtra: { avgRating: "Valoración media", meritDesc: "Solo mérito y reputación" },
  trustExtra: { verifiedDesc: "Identidad y actividad comprobadas.", realReviewsDesc: "Solo de servicios realizados.", noPaidRankingDesc: "Nadie paga por aparecer primero.", freeForClientsDesc: "Busca y pide presupuesto gratis." },
  finalCta: { title: "Tu próximo proyecto empieza comparando profesionales verificados", text: "Gratis para clientes. Sin rankings comprados. Solo profesionales verificados que destacan por su trabajo." },
};
const sv: HomeDict = {
  heroExtra: { avgRating: "Genomsnittligt betyg", meritDesc: "Endast förtjänst och rykte" },
  trustExtra: { verifiedDesc: "Identitet och verksamhet kontrollerade.", realReviewsDesc: "Endast från utförda tjänster.", noPaidRankingDesc: "Ingen betalar för förstaplatsen.", freeForClientsDesc: "Sök och begär offert gratis." },
  finalCta: { title: "Ditt nästa projekt börjar med att jämföra verifierade yrkespersoner", text: "Gratis för kunder. Inga betalda placeringar. Endast verifierade yrkespersoner som utmärker sig genom sitt arbete." },
};

export const homeDictionaries: Record<Locale, HomeDict> = {
  es, fr, it, pt, de, nl, en,
};
