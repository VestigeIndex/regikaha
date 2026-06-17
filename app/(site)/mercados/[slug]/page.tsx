import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketDetailPage } from "@/components/marketplace/MarketsPage";
import { citySearchLocations } from "@/lib/data/locations";
import { activeMarkets, getActiveMarketBySlug } from "@/lib/market";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return activeMarkets.map((market) => ({ slug: market.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const market = getActiveMarketBySlug(slug);
  if (!market) return { title: "Mercado no encontrado" };
  const cities = citySearchLocations
    .filter((city) => city.countryCode === market.code && (market.citySlugs as readonly string[]).includes(city.slug))
    .map((city) => city.city)
    .filter(Boolean)
    .join(", ");

  return buildMetadata({
    title: `Profesionales verificados en ${market.name}`,
    description: `Busca profesionales verificados en ${market.name}${cities ? `: ${cities}` : ""}. Compara por categoría, ciudad, portfolio, precios orientativos y valoraciones reales.`,
    path: `/mercados/${market.slug}`,
  });
}

export default async function MercadoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getActiveMarketBySlug(slug)) notFound();
  return <MarketDetailPage slug={slug} />;
}
