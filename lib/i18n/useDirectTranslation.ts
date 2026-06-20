"use client";

import { useCallback, useMemo } from "react";
import { domTextDictionaries } from "./dom.generated";
import { releaseTextDictionaries } from "./release";
import { subscriptionTextDictionaries } from "./subscription";
import { commercialTextDictionaries } from "./commercial";
import { useI18n } from "./context";

export function useDirectTranslation() {
  const { locale } = useI18n();
  const dictionary = useMemo<Record<string, string>>(
    () => ({
      ...domTextDictionaries[locale],
      ...releaseTextDictionaries[locale],
      ...subscriptionTextDictionaries[locale],
      ...commercialTextDictionaries[locale],
    }),
    [locale],
  );

  const translate = useCallback(
    (source: string) => {
      const translated = dictionary[source];
      if (!translated) throw new Error(`Missing direct translation for "${source}" in ${locale}`);
      return translated;
    },
    [dictionary, locale],
  );

  return { locale, translate };
}
