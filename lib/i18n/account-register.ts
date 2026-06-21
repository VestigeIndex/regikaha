import type { Locale } from "@/lib/i18n/config";

type PublicRole = "client" | "company" | "subcontractor";

type AccountRegisterCopy = {
  roles: Record<PublicRole, { title: string; text: string; submit: string; terms: string }>;
  unable: string;
  doneTitle: string;
  doneText: string;
  name: string;
  contactName: string;
  displayName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  needs: string;
  specialties: string;
  cityPlaceholder: string;
  creating: string;
};

export const accountRegisterDictionaries: Record<Locale, AccountRegisterCopy> = {
  es: {
    roles: {
      client: { title: "Crear cuenta cliente", text: "Publica proyectos, guarda favoritos, recibe pre-presupuestos y gestiona conversaciones.", submit: "Crear cuenta cliente", terms: "Acepto las condiciones para clientes, la política de privacidad y el uso de Regi Kaha como plataforma tecnológica de intermediación." },
      company: { title: "Crear cuenta empresa", text: "Publica necesidades de subcontrata, compara equipos y gestiona solicitudes B2B.", submit: "Crear cuenta empresa", terms: "Acepto las condiciones para empresas, la política de privacidad y el uso de Regi Kaha como plataforma tecnológica de intermediación." },
      subcontractor: { title: "Crear cuenta subcontrata", text: "Define especialidades, zonas de servicio y disponibilidad para recibir oportunidades B2B.", submit: "Crear cuenta subcontrata", terms: "Acepto las condiciones para subcontratas, la política de privacidad y el uso de Regi Kaha como plataforma tecnológica de intermediación." },
    }, unable: "No se pudo crear la cuenta", doneTitle: "Tu cuenta se ha creado", doneText: "Te llevamos a tu panel. Si el inicio automático no estuviera disponible, podrás entrar desde Conectar.", name: "Nombre", contactName: "Nombre de contacto", displayName: "Razón social o nombre público", email: "Email", password: "Contraseña", phone: "Teléfono", country: "País", needs: "Necesidades habituales", specialties: "Especialidades", cityPlaceholder: "Ciudad, pueblo o código postal", creating: "Creando cuenta...",
  },
  fr: {
    roles: {
      client: { title: "Créer un compte client", text: "Publiez des projets, enregistrez des favoris, recevez des estimations initiales et gérez vos échanges.", submit: "Créer un compte client", terms: "J’accepte les conditions applicables aux clients, la politique de confidentialité et l’utilisation de Regi Kaha comme plateforme technologique d’intermédiation." },
      company: { title: "Créer un compte entreprise", text: "Publiez vos besoins de sous-traitance, comparez les équipes et gérez les demandes B2B.", submit: "Créer un compte entreprise", terms: "J’accepte les conditions applicables aux entreprises, la politique de confidentialité et l’utilisation de Regi Kaha comme plateforme technologique d’intermédiation." },
      subcontractor: { title: "Créer un compte sous-traitant", text: "Définissez vos spécialités, zones d’intervention et disponibilités pour recevoir des opportunités B2B.", submit: "Créer un compte sous-traitant", terms: "J’accepte les conditions applicables aux sous-traitants, la politique de confidentialité et l’utilisation de Regi Kaha comme plateforme technologique d’intermédiation." },
    }, unable: "Impossible de créer le compte", doneTitle: "Votre compte a été créé", doneText: "Nous vous redirigeons vers votre espace. Si la connexion automatique échoue, utilisez Se connecter.", name: "Nom", contactName: "Nom du contact", displayName: "Raison sociale ou nom public", email: "E-mail", password: "Mot de passe", phone: "Téléphone", country: "Pays", needs: "Besoins habituels", specialties: "Spécialités", cityPlaceholder: "Ville, commune ou code postal", creating: "Création du compte…",
  },
  it: {
    roles: {
      client: { title: "Crea account cliente", text: "Pubblica progetti, salva preferiti, ricevi stime iniziali e gestisci le conversazioni.", submit: "Crea account cliente", terms: "Accetto le condizioni per i clienti, l’informativa sulla privacy e l’uso di Regi Kaha come piattaforma tecnologica di intermediazione." },
      company: { title: "Crea account azienda", text: "Pubblica esigenze di subappalto, confronta squadre e gestisci richieste B2B.", submit: "Crea account azienda", terms: "Accetto le condizioni per le aziende, l’informativa sulla privacy e l’uso di Regi Kaha come piattaforma tecnologica di intermediazione." },
      subcontractor: { title: "Crea account subappaltatore", text: "Definisci specialità, aree operative e disponibilità per ricevere opportunità B2B.", submit: "Crea account subappaltatore", terms: "Accetto le condizioni per i subappaltatori, l’informativa sulla privacy e l’uso di Regi Kaha come piattaforma tecnologica di intermediazione." },
    }, unable: "Impossibile creare l’account", doneTitle: "Il tuo account è stato creato", doneText: "Ti stiamo portando al pannello. Se l’accesso automatico non riesce, usa Accedi.", name: "Nome", contactName: "Nome del contatto", displayName: "Ragione sociale o nome pubblico", email: "E-mail", password: "Password", phone: "Telefono", country: "Paese", needs: "Esigenze abituali", specialties: "Specialità", cityPlaceholder: "Città, comune o codice postale", creating: "Creazione account…",
  },
  pt: {
    roles: {
      client: { title: "Criar conta de cliente", text: "Publique projetos, guarde favoritos, receba estimativas iniciais e gira conversas.", submit: "Criar conta de cliente", terms: "Aceito as condições aplicáveis a clientes, a política de privacidade e a utilização da Regi Kaha como plataforma tecnológica de intermediação." },
      company: { title: "Criar conta de empresa", text: "Publique necessidades de subcontratação, compare equipas e gira pedidos B2B.", submit: "Criar conta de empresa", terms: "Aceito as condições aplicáveis a empresas, a política de privacidade e a utilização da Regi Kaha como plataforma tecnológica de intermediação." },
      subcontractor: { title: "Criar conta de subcontratante", text: "Defina especialidades, zonas de serviço e disponibilidade para receber oportunidades B2B.", submit: "Criar conta de subcontratante", terms: "Aceito as condições aplicáveis a subcontratantes, a política de privacidade e a utilização da Regi Kaha como plataforma tecnológica de intermediação." },
    }, unable: "Não foi possível criar a conta", doneTitle: "A sua conta foi criada", doneText: "Estamos a encaminhá-lo para o painel. Se o acesso automático falhar, utilize Entrar.", name: "Nome", contactName: "Nome do contacto", displayName: "Razão social ou nome público", email: "E-mail", password: "Palavra-passe", phone: "Telefone", country: "País", needs: "Necessidades habituais", specialties: "Especialidades", cityPlaceholder: "Cidade, localidade ou código postal", creating: "A criar conta…",
  },
  de: {
    roles: {
      client: { title: "Kundenkonto erstellen", text: "Projekte veröffentlichen, Favoriten speichern, erste Kostenschätzungen erhalten und Gespräche verwalten.", submit: "Kundenkonto erstellen", terms: "Ich akzeptiere die Bedingungen für Kunden, die Datenschutzerklärung und die Nutzung von Regi Kaha als technologische Vermittlungsplattform." },
      company: { title: "Unternehmenskonto erstellen", text: "Nachunternehmerbedarf veröffentlichen, Teams vergleichen und B2B-Anfragen verwalten.", submit: "Unternehmenskonto erstellen", terms: "Ich akzeptiere die Bedingungen für Unternehmen, die Datenschutzerklärung und die Nutzung von Regi Kaha als technologische Vermittlungsplattform." },
      subcontractor: { title: "Nachunternehmerkonto erstellen", text: "Fachgebiete, Einsatzgebiete und Verfügbarkeit festlegen, um B2B-Chancen zu erhalten.", submit: "Nachunternehmerkonto erstellen", terms: "Ich akzeptiere die Bedingungen für Nachunternehmer, die Datenschutzerklärung und die Nutzung von Regi Kaha als technologische Vermittlungsplattform." },
    }, unable: "Das Konto konnte nicht erstellt werden", doneTitle: "Ihr Konto wurde erstellt", doneText: "Sie werden zum Dashboard weitergeleitet. Falls die automatische Anmeldung nicht klappt, verwenden Sie Anmelden.", name: "Name", contactName: "Kontaktname", displayName: "Firmenname oder öffentlicher Name", email: "E-Mail", password: "Passwort", phone: "Telefon", country: "Land", needs: "Regelmäßiger Bedarf", specialties: "Fachgebiete", cityPlaceholder: "Stadt, Ort oder Postleitzahl", creating: "Konto wird erstellt…",
  },
  nl: {
    roles: {
      client: { title: "Klantaccount aanmaken", text: "Publiceer projecten, bewaar favorieten, ontvang eerste ramingen en beheer gesprekken.", submit: "Klantaccount aanmaken", terms: "Ik aanvaard de voorwaarden voor klanten, het privacybeleid en het gebruik van Regi Kaha als technologisch bemiddelingsplatform." },
      company: { title: "Bedrijfsaccount aanmaken", text: "Publiceer behoeften aan onderaanneming, vergelijk teams en beheer B2B-aanvragen.", submit: "Bedrijfsaccount aanmaken", terms: "Ik aanvaard de voorwaarden voor bedrijven, het privacybeleid en het gebruik van Regi Kaha als technologisch bemiddelingsplatform." },
      subcontractor: { title: "Onderaannemersaccount aanmaken", text: "Leg specialismen, werkgebieden en beschikbaarheid vast om B2B-kansen te ontvangen.", submit: "Onderaannemersaccount aanmaken", terms: "Ik aanvaard de voorwaarden voor onderaannemers, het privacybeleid en het gebruik van Regi Kaha als technologisch bemiddelingsplatform." },
    }, unable: "Het account kon niet worden aangemaakt", doneTitle: "Uw account is aangemaakt", doneText: "U wordt naar uw dashboard gebracht. Gebruik Inloggen als automatisch aanmelden niet lukt.", name: "Naam", contactName: "Naam contactpersoon", displayName: "Bedrijfsnaam of publieke naam", email: "E-mail", password: "Wachtwoord", phone: "Telefoon", country: "Land", needs: "Gebruikelijke behoeften", specialties: "Specialismen", cityPlaceholder: "Stad, gemeente of postcode", creating: "Account aanmaken…",
  },
  en: {
    roles: {
      client: { title: "Create client account", text: "Publish projects, save favourites, receive initial estimates and manage conversations.", submit: "Create client account", terms: "I accept the terms for clients, the privacy policy and the use of Regi Kaha as a technology intermediation platform." },
      company: { title: "Create company account", text: "Publish subcontracting needs, compare teams and manage B2B requests.", submit: "Create company account", terms: "I accept the terms for companies, the privacy policy and the use of Regi Kaha as a technology intermediation platform." },
      subcontractor: { title: "Create subcontractor account", text: "Define specialties, service areas and availability to receive B2B opportunities.", submit: "Create subcontractor account", terms: "I accept the terms for subcontractors, the privacy policy and the use of Regi Kaha as a technology intermediation platform." },
    }, unable: "The account could not be created", doneTitle: "Your account has been created", doneText: "We are taking you to your dashboard. If automatic sign-in is unavailable, use Sign in.", name: "Name", contactName: "Contact name", displayName: "Legal or public business name", email: "Email", password: "Password", phone: "Phone", country: "Country", needs: "Usual needs", specialties: "Specialties", cityPlaceholder: "City, town or postcode", creating: "Creating account…",
  },
};
