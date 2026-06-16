"use client";

import type { Category, PortfolioItem, Professional, Review, ServiceItem } from "@/lib/types";
import { useI18n } from "./context";
import { contentDictionaries } from "./content";

function requireEntry<T>(entry: T | undefined, key: string): T {
  if (!entry) throw new Error(`Missing localized content: ${key}`);
  return entry;
}

export function useContent() {
  const { locale } = useI18n();
  return contentDictionaries[locale];
}

export function useLocalizedCategory(category: Category): Category {
  const content = useContent();
  const localized = requireEntry(content.categories[category.id], `categories.${category.id}`);
  return { ...category, ...localized };
}

export function useLocalizedService(service: ServiceItem): ServiceItem {
  const content = useContent();
  const localized = requireEntry(content.services[service.id], `services.${service.id}`);
  return { ...service, ...localized };
}

export function useLocalizedPortfolioItem(item: PortfolioItem): PortfolioItem {
  const content = useContent();
  const localized = requireEntry(content.portfolio[item.id], `portfolio.${item.id}`);
  return { ...item, ...localized };
}

export function useLocalizedReview(review: Review): Review {
  const content = useContent();
  const localized = requireEntry(content.reviews[review.id], `reviews.${review.id}`);
  return { ...review, ...localized };
}

export function useLocalizedProfessional(pro: Professional): Professional {
  const content = useContent();
  const localized = content.professionals[pro.id];
  if (!localized) return pro;
  return { ...pro, ...localized };
}
