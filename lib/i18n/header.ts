import type { Locale } from "./config";

export const headerDictionaries: Record<Locale, { signIn: string; account: string; myPanel: string; logout: string; help: string }> = {
  es: { signIn: "Conectar", account: "Cuenta", myPanel: "Ir a mi panel", logout: "Cerrar sesión", help: "Ayuda" },
  fr: { signIn: "Se connecter", account: "Compte", myPanel: "Accéder à mon espace", logout: "Se déconnecter", help: "Aide" },
  it: { signIn: "Accedi", account: "Account", myPanel: "Vai al mio pannello", logout: "Esci", help: "Aiuto" },
  pt: { signIn: "Entrar", account: "Conta", myPanel: "Ir para o meu painel", logout: "Terminar sessão", help: "Ajuda" },
  de: { signIn: "Anmelden", account: "Konto", myPanel: "Zu meinem Dashboard", logout: "Abmelden", help: "Hilfe" },
  nl: { signIn: "Inloggen", account: "Account", myPanel: "Naar mijn dashboard", logout: "Uitloggen", help: "Hulp" },
  en: { signIn: "Sign in", account: "Account", myPanel: "Go to my dashboard", logout: "Sign out", help: "Help" },
};
