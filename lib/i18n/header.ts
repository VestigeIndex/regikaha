import type { Locale } from "./config";

export const headerDictionaries: Record<Locale, { signIn: string; account: string; myPanel: string; logout: string }> = {
  es: { signIn: "Conectar", account: "Cuenta", myPanel: "Ir a mi panel", logout: "Cerrar sesión" },
  fr: { signIn: "Se connecter", account: "Compte", myPanel: "Accéder à mon espace", logout: "Se déconnecter" },
  it: { signIn: "Accedi", account: "Account", myPanel: "Vai al mio pannello", logout: "Esci" },
  pt: { signIn: "Entrar", account: "Conta", myPanel: "Ir para o meu painel", logout: "Terminar sessão" },
  de: { signIn: "Anmelden", account: "Konto", myPanel: "Zu meinem Dashboard", logout: "Abmelden" },
  nl: { signIn: "Inloggen", account: "Account", myPanel: "Naar mijn dashboard", logout: "Uitloggen" },
  en: { signIn: "Sign in", account: "Account", myPanel: "Go to my dashboard", logout: "Sign out" },
};
