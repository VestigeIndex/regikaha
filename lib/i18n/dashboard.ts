import type { Locale } from "./config";

export interface DashboardCopy {
  account: string;
  backToSite: string;
  closeMenu: string;
  loading: string;
  logout: string;
  navigation: string;
  openMenu: string;
  roles: Record<"client" | "professional" | "company" | "subcontractor", string>;
  nav: Record<"overview" | "subscription" | "requests" | "opportunities" | "balance" | "preferences" | "profile" | "services" | "reviews" | "tools", string>;
}

export const dashboardDictionaries: Record<Locale, DashboardCopy> = {
  es: { account: "Cuenta", backToSite: "Volver a la web", closeMenu: "Cerrar menú", loading: "Comprobando tu sesión...", logout: "Cerrar sesión", navigation: "Navegación del panel", openMenu: "Abrir menú", roles: { client: "Cliente", professional: "Profesional", company: "Empresa", subcontractor: "Subcontrata" }, nav: { overview: "Resumen", subscription: "Suscripción", requests: "Solicitudes", opportunities: "Oportunidades", balance: "Saldo", preferences: "Preferencias", profile: "Mi perfil", services: "Mis servicios", reviews: "Valoraciones", tools: "Herramientas" } },
  fr: { account: "Compte", backToSite: "Retour au site", closeMenu: "Fermer le menu", loading: "Vérification de votre session...", logout: "Se déconnecter", navigation: "Navigation du tableau de bord", openMenu: "Ouvrir le menu", roles: { client: "Client", professional: "Professionnel", company: "Entreprise", subcontractor: "Sous-traitant" }, nav: { overview: "Vue d'ensemble", subscription: "Abonnement", requests: "Demandes", opportunities: "Opportunités", balance: "Solde", preferences: "Préférences", profile: "Mon profil", services: "Mes services", reviews: "Avis", tools: "Outils" } },
  it: { account: "Account", backToSite: "Torna al sito", closeMenu: "Chiudi menu", loading: "Verifica della sessione...", logout: "Esci", navigation: "Navigazione del pannello", openMenu: "Apri menu", roles: { client: "Cliente", professional: "Professionista", company: "Azienda", subcontractor: "Subappaltatore" }, nav: { overview: "Riepilogo", subscription: "Abbonamento", requests: "Richieste", opportunities: "Opportunità", balance: "Saldo", preferences: "Preferenze", profile: "Il mio profilo", services: "I miei servizi", reviews: "Recensioni", tools: "Strumenti" } },
  pt: { account: "Conta", backToSite: "Voltar ao site", closeMenu: "Fechar menu", loading: "A verificar a sua sessão...", logout: "Terminar sessão", navigation: "Navegação do painel", openMenu: "Abrir menu", roles: { client: "Cliente", professional: "Profissional", company: "Empresa", subcontractor: "Subcontratado" }, nav: { overview: "Resumo", subscription: "Subscrição", requests: "Pedidos", opportunities: "Oportunidades", balance: "Saldo", preferences: "Preferências", profile: "O meu perfil", services: "Os meus serviços", reviews: "Avaliações", tools: "Ferramentas" } },
  de: { account: "Konto", backToSite: "Zur Website", closeMenu: "Menü schließen", loading: "Sitzung wird geprüft...", logout: "Abmelden", navigation: "Dashboard-Navigation", openMenu: "Menü öffnen", roles: { client: "Kunde", professional: "Fachbetrieb", company: "Unternehmen", subcontractor: "Subunternehmer" }, nav: { overview: "Übersicht", subscription: "Abonnement", requests: "Anfragen", opportunities: "Aufträge", balance: "Guthaben", preferences: "Einstellungen", profile: "Mein Profil", services: "Meine Leistungen", reviews: "Bewertungen", tools: "Werkzeuge" } },
  nl: { account: "Account", backToSite: "Terug naar de site", closeMenu: "Menu sluiten", loading: "Je sessie wordt gecontroleerd...", logout: "Uitloggen", navigation: "Dashboardnavigatie", openMenu: "Menu openen", roles: { client: "Klant", professional: "Vakman", company: "Bedrijf", subcontractor: "Onderaannemer" }, nav: { overview: "Overzicht", subscription: "Abonnement", requests: "Aanvragen", opportunities: "Opdrachten", balance: "Saldo", preferences: "Voorkeuren", profile: "Mijn profiel", services: "Mijn diensten", reviews: "Beoordelingen", tools: "Hulpmiddelen" } },
  en: { account: "Account", backToSite: "Back to the website", closeMenu: "Close menu", loading: "Checking your session...", logout: "Sign out", navigation: "Dashboard navigation", openMenu: "Open menu", roles: { client: "Client", professional: "Professional", company: "Company", subcontractor: "Subcontractor" }, nav: { overview: "Overview", subscription: "Subscription", requests: "Requests", opportunities: "Opportunities", balance: "Balance", preferences: "Preferences", profile: "My profile", services: "My services", reviews: "Reviews", tools: "Tools" } },
};
