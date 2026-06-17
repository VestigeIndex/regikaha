import type { Metadata } from "next";
import "./globals.css";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { I18nProvider } from "@/lib/i18n/context";
import { DomTextLocalizer } from "@/components/site/DomTextLocalizer";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "reformas",
    "profesionales de reformas",
    "empresas de reformas",
    "reforma de baño",
    "reforma de cocina",
    "electricistas",
    "fontaneros",
    "instaladores",
    "arquitectos",
    "energía solar",
    "pre-presupuesto de reforma",
    "subcontratas construcción",
    "mapa profesionales reformas",
    "profesionales verificados",
    "marketplace reformas Europa seleccionada",
    "profesionales verificados mercados europeos",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "construction services marketplace",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: site.url },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "es_ES",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#198C68" />
        {/* Progressive enhancement: marca que hay JS para activar animaciones reveal. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd data={organizationSchema()} />
      </head>
      <body className="min-h-screen bg-white text-ink antialiased">
        <I18nProvider>
          <DomTextLocalizer />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
