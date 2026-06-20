import type { Locale } from "@/lib/i18n/config";
import { accountRegisterDictionaries } from "@/lib/i18n/account-register";

export type RegistrationRouteRole = "cliente" | "profesional" | "empresa" | "subcontrata";

const professional: Record<Locale, { title: string; text: string; founder: string }> = {
  es: { title: "Crear perfil profesional", text: "Crea tu perfil, publica servicios, define zonas de trabajo y activa tu plan cuando estés listo.", founder: "Fundadores: 5 meses gratis para los primeros verificados" },
  fr: { title: "Créer un profil professionnel", text: "Créez votre profil, publiez vos services, définissez vos zones d’intervention et activez votre offre lorsque vous êtes prêt.", founder: "Fondateurs : 5 mois gratuits pour les premiers profils vérifiés" },
  it: { title: "Crea un profilo professionale", text: "Crea il profilo, pubblica i servizi, definisci le aree operative e attiva il piano quando sei pronto.", founder: "Fondatori: 5 mesi gratuiti per i primi profili verificati" },
  pt: { title: "Criar perfil profissional", text: "Crie o perfil, publique serviços, defina as zonas de trabalho e ative o plano quando estiver pronto.", founder: "Fundadores: 5 meses grátis para os primeiros perfis verificados" },
  de: { title: "Professionelles Profil erstellen", text: "Erstellen Sie Ihr Profil, veröffentlichen Sie Leistungen, legen Sie Einsatzgebiete fest und aktivieren Sie Ihren Plan, sobald Sie bereit sind.", founder: "Gründer: 5 Monate kostenlos für die ersten verifizierten Profile" },
  nl: { title: "Professioneel profiel aanmaken", text: "Maak uw profiel, publiceer diensten, leg werkgebieden vast en activeer uw plan wanneer u klaar bent.", founder: "Oprichters: 5 maanden gratis voor de eerste geverifieerde profielen" },
  en: { title: "Create a professional profile", text: "Create your profile, publish services, define work areas and activate your plan when you are ready.", founder: "Founders: 5 months free for the first verified profiles" },
};

export const registrationLabels: Record<Locale, { registration: string; home: string }> = {
  es: { registration: "Registro", home: "Inicio" },
  fr: { registration: "Inscription", home: "Accueil" },
  it: { registration: "Registrazione", home: "Home" },
  pt: { registration: "Registo", home: "Início" },
  de: { registration: "Registrierung", home: "Startseite" },
  nl: { registration: "Registratie", home: "Home" },
  en: { registration: "Registration", home: "Home" },
};

const accountRoleByRoute = {
  cliente: "client",
  empresa: "company",
  subcontrata: "subcontractor",
} as const;

export function registrationRoleCopy(locale: Locale, role: RegistrationRouteRole) {
  if (role === "profesional") return professional[locale];
  const accountRole = accountRoleByRoute[role];
  return { ...accountRegisterDictionaries[locale].roles[accountRole], founder: "" };
}
