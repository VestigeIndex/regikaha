import { Hero } from "@/components/home/Hero";
import { TrustBand } from "@/components/home/TrustBand";
import { PhotoMarquee } from "@/components/home/PhotoMarquee";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PortfolioStrip } from "@/components/home/PortfolioStrip";
import { Testimonials } from "@/components/home/Testimonials";
import { FairRanking } from "@/components/home/FairRanking";
import { FoundersOffer } from "@/components/home/FoundersOffer";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Reveal } from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBand />
      <Reveal><FeaturedCategories /></Reveal>
      <PhotoMarquee />
      <Reveal><FeaturedProfessionals /></Reveal>
      <Reveal><HowItWorks /></Reveal>
      <Reveal><PortfolioStrip /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><FairRanking /></Reveal>
      <Reveal><FoundersOffer /></Reveal>
      <Reveal><FinalCTA /></Reveal>
    </>
  );
}
