export const legalVersions = {
  contract: "subscription-contract-2026-06-18",
  terms: "terms-professionals-2026-06-18",
  privacy: "privacy-2026-06-18",
  verificationPolicy: "verification-2026-06-18",
  reviewsPolicy: "reviews-2026-06-18",
  rankingPolicy: "fair-ranking-2026-06-18",
  cancellationPolicy: "subscription-cancellation-2026-06-18",
} as const;

export type LegalVersionKey = keyof typeof legalVersions;
