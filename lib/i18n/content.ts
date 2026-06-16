import type { Locale } from "./config";
import { generatedContentDictionaries } from "./content.generated";

export interface ContentDict {
  categories: Record<
    string,
    {
      name: string;
      professionalNoun: string;
      professionalNounPlural: string;
      shortDescription: string;
      description: string;
      popularServices: string[];
    }
  >;
  services: Record<
    string,
    {
      title: string;
      description: string;
      estimatedTime: string;
      includes: string[];
      excludes: string[];
      process: string[];
      faqs: { q: string; a: string }[];
      serviceArea: string;
    }
  >;
  portfolio: Record<
    string,
    {
      title: string;
      category: string;
      description: string;
      location: string;
    }
  >;
  reviews: Record<
    string,
    {
      clientName: string;
      serviceLabel: string;
      comment: string;
      reply: string | null;
    }
  >;
  professionals: Record<
    string,
    {
      typeLabel: string;
      city: string;
      province: string;
      autonomousCommunity: string;
      country?: string;
      serviceArea: string;
      specialties: string[];
      languages: string[];
      certifications: string[];
      description: string;
      shortTagline: string;
    }
  >;
  languageOptions: { value: string; label: string }[];
}

export const contentDictionaries: Record<Locale, ContentDict> = generatedContentDictionaries;
