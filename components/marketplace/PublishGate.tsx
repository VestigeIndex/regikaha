"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, MailCheck, UserPlus } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { headerDictionaries } from "@/lib/i18n/header";
import type { Locale } from "@/lib/i18n/config";

type GateStatus = "loading" | "anon" | "unverified" | "ready";

const gateDictionaries: Record<Locale, {
  anonTitle: string;
  anonText: string;
  registerCta: string;
  unverifiedTitle: string;
  unverifiedText: string;
  resend: string;
  resending: string;
  resent: string;
  resendError: string;
}> = {
  es: {
    anonTitle: "Inicia sesión para publicar",
    anonText: "Para que tu anuncio quede asociado a una cuenta verificada, accede o regístrate gratis. Así evitamos anuncios falsos y mejoramos las respuestas.",
    registerCta: "Crear cuenta gratis",
    unverifiedTitle: "Verifica tu email para publicar",
    unverifiedText: "Te enviamos un enlace de verificación al registrarte. Confírmalo para poder publicar tu anuncio.",
    resend: "Reenviar email de verificación",
    resending: "Enviando…",
    resent: "Email reenviado. Revisa tu bandeja de entrada y el spam.",
    resendError: "No se pudo reenviar. Inténtalo de nuevo en unos minutos.",
  },
  fr: {
    anonTitle: "Connectez-vous pour publier",
    anonText: "Pour que votre annonce soit liée à un compte vérifié, connectez-vous ou créez un compte gratuit. Cela évite les fausses annonces et améliore les réponses.",
    registerCta: "Créer un compte gratuit",
    unverifiedTitle: "Vérifiez votre e-mail pour publier",
    unverifiedText: "Nous vous avons envoyé un lien de vérification à l'inscription. Confirmez-le pour pouvoir publier votre annonce.",
    resend: "Renvoyer l'e-mail de vérification",
    resending: "Envoi…",
    resent: "E-mail renvoyé. Vérifiez votre boîte de réception et les spams.",
    resendError: "Échec de l'envoi. Réessayez dans quelques minutes.",
  },
  it: {
    anonTitle: "Accedi per pubblicare",
    anonText: "Perché il tuo annuncio sia collegato a un account verificato, accedi o registrati gratis. Così evitiamo annunci falsi e miglioriamo le risposte.",
    registerCta: "Crea un account gratis",
    unverifiedTitle: "Verifica la tua email per pubblicare",
    unverifiedText: "Ti abbiamo inviato un link di verifica alla registrazione. Confermalo per pubblicare il tuo annuncio.",
    resend: "Reinvia l'email di verifica",
    resending: "Invio…",
    resent: "Email reinviata. Controlla la posta in arrivo e lo spam.",
    resendError: "Invio non riuscito. Riprova tra qualche minuto.",
  },
  pt: {
    anonTitle: "Inicie sessão para publicar",
    anonText: "Para que o seu anúncio fique associado a uma conta verificada, entre ou registe-se gratuitamente. Assim evitamos anúncios falsos e melhoramos as respostas.",
    registerCta: "Criar conta grátis",
    unverifiedTitle: "Verifique o seu email para publicar",
    unverifiedText: "Enviámos um link de verificação no registo. Confirme-o para poder publicar o seu anúncio.",
    resend: "Reenviar email de verificação",
    resending: "A enviar…",
    resent: "Email reenviado. Verifique a caixa de entrada e o spam.",
    resendError: "Não foi possível reenviar. Tente novamente daqui a uns minutos.",
  },
  de: {
    anonTitle: "Zum Veröffentlichen anmelden",
    anonText: "Damit Ihre Anzeige mit einem verifizierten Konto verknüpft ist, melden Sie sich an oder registrieren Sie sich kostenlos. So vermeiden wir Fake-Anzeigen und verbessern die Antworten.",
    registerCta: "Kostenloses Konto erstellen",
    unverifiedTitle: "E-Mail bestätigen, um zu veröffentlichen",
    unverifiedText: "Wir haben Ihnen bei der Registrierung einen Bestätigungslink gesendet. Bestätigen Sie ihn, um Ihre Anzeige zu veröffentlichen.",
    resend: "Bestätigungs-E-Mail erneut senden",
    resending: "Wird gesendet…",
    resent: "E-Mail erneut gesendet. Prüfen Sie Posteingang und Spam.",
    resendError: "Senden fehlgeschlagen. Versuchen Sie es in einigen Minuten erneut.",
  },
  nl: {
    anonTitle: "Log in om te plaatsen",
    anonText: "Zodat je advertentie aan een geverifieerd account gekoppeld is, log je in of registreer je gratis. Zo voorkomen we nepadvertenties en verbeteren we de reacties.",
    registerCta: "Gratis account aanmaken",
    unverifiedTitle: "Verifieer je e-mail om te plaatsen",
    unverifiedText: "We hebben je bij registratie een verificatielink gestuurd. Bevestig deze om je advertentie te plaatsen.",
    resend: "Verificatie-e-mail opnieuw versturen",
    resending: "Versturen…",
    resent: "E-mail opnieuw verstuurd. Controleer je inbox en spam.",
    resendError: "Opnieuw versturen mislukt. Probeer het over enkele minuten.",
  },
  en: {
    anonTitle: "Sign in to publish",
    anonText: "So your ad is tied to a verified account, sign in or create a free account. This prevents fake ads and improves responses.",
    registerCta: "Create a free account",
    unverifiedTitle: "Verify your email to publish",
    unverifiedText: "We sent you a verification link when you signed up. Confirm it to publish your ad.",
    resend: "Resend verification email",
    resending: "Sending…",
    resent: "Email resent. Check your inbox and spam folder.",
    resendError: "Could not resend. Please try again in a few minutes.",
  },
};

export function PublishGate({ next, children }: { next: string; children: React.ReactNode }) {
  const { locale } = useI18n();
  const copy = gateDictionaries[locale];
  const signIn = headerDictionaries[locale].signIn;
  const [status, setStatus] = useState<GateStatus>("loading");
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data?.authenticated) setStatus("anon");
        else if (!data.user?.emailVerified) setStatus("unverified");
        else setStatus("ready");
      })
      .catch(() => { if (!cancelled) setStatus("anon"); });
    return () => { cancelled = true; };
  }, []);

  async function resend() {
    setResendState("sending");
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST", credentials: "same-origin" });
      setResendState(res.ok ? "sent" : "error");
    } catch {
      setResendState("error");
    }
  }

  if (status === "loading") {
    return <div className="card h-64 animate-pulse bg-canvas-alt/60" aria-hidden="true" />;
  }

  if (status === "ready") return <>{children}</>;

  if (status === "unverified") {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-forest-500/12 text-forest-600">
          <MailCheck size={26} />
        </span>
        <h2 className="mt-4 text-xl font-bold text-ink">{copy.unverifiedTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{copy.unverifiedText}</p>
        <button onClick={resend} disabled={resendState === "sending" || resendState === "sent"} className="btn btn-primary mt-5 disabled:opacity-60">
          {resendState === "sending" ? copy.resending : copy.resend}
        </button>
        {resendState === "sent" && <p className="mt-3 text-sm text-forest-700">{copy.resent}</p>}
        {resendState === "error" && <p className="mt-3 text-sm text-red-600">{copy.resendError}</p>}
      </div>
    );
  }

  const loginHref = `/conectar?next=${encodeURIComponent(next)}`;
  const registerHref = `/registro?next=${encodeURIComponent(next)}`;
  return (
    <div className="card p-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-forest-500/12 text-forest-600">
        <LogIn size={26} />
      </span>
      <h2 className="mt-4 text-xl font-bold text-ink">{copy.anonTitle}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{copy.anonText}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Link href={loginHref} className="btn btn-primary"><LogIn size={16} /> {signIn}</Link>
        <Link href={registerHref} className="btn btn-secondary"><UserPlus size={16} /> {copy.registerCta}</Link>
      </div>
    </div>
  );
}
