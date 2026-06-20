"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { domTextDictionaries } from "@/lib/i18n/dom.generated";
import { releaseTextDictionaries } from "@/lib/i18n/release";
import { subscriptionTextDictionaries } from "@/lib/i18n/subscription";
import { marketsDictionaries } from "@/lib/i18n/markets";
import { type Locale } from "@/lib/i18n/config";
import { getActiveMarketBySlug } from "@/lib/market";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE"]);

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function replaceKnownPhrases(value: string, dictionary: Record<string, string>) {
  const normalized = normalizeText(value);
  if (!normalized) return value;
  const exact = dictionary[normalized];
  if (exact) return value.replace(normalized, exact);
  return value;
}

function localizeNode(root: ParentNode, dictionary: Record<string, string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentElement;
    if (!parent || SKIP_TAGS.has(parent.tagName)) continue;
    textNodes.push(node);
  }

  for (const node of textNodes) {
    const next = replaceKnownPhrases(node.nodeValue || "", dictionary);
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  if (root instanceof Element || root instanceof Document) {
    const elements = root instanceof Document ? root.querySelectorAll<HTMLElement>("*") : root.querySelectorAll<HTMLElement>("*");
    elements.forEach((element) => {
      if (SKIP_TAGS.has(element.tagName)) return;
      for (const attr of ["placeholder", "aria-label", "title", "alt"]) {
        const value = element.getAttribute(attr);
        if (!value) continue;
        const next = replaceKnownPhrases(value, dictionary);
        if (next !== value) element.setAttribute(attr, next);
      }
    });
  }
}

function countryName(code: string, locale: Locale, fallback: string) {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) || fallback;
  } catch {
    return fallback;
  }
}

function verifiedProfessionalsTitle(locale: Locale, country: string) {
  switch (locale) {
    case "fr":
      return `Professionnels vérifiés en ${country}`;
    case "it":
      return `Professionisti verificati in ${country}`;
    case "pt":
      return `Profissionais verificados em ${country}`;
    case "de":
      return `Verifizierte Fachleute in ${country}`;
    case "nl":
      return `Geverifieerde professionals in ${country}`;
    case "en":
      return `Verified professionals in ${country}`;
    default:
      return `Profesionales verificados en ${country}`;
  }
}

function verifiedProfileTitle(locale: Locale, name: string) {
  switch (locale) {
    case "fr":
      return `${name} — professionnel vérifié`;
    case "it":
      return `${name} — professionista verificato`;
    case "pt":
      return `${name} — profissional verificado`;
    case "de":
      return `${name} — verifizierter Fachbetrieb`;
    case "nl":
      return `${name} — geverifieerde professional`;
    case "en":
      return `${name} — verified professional`;
    default:
      return `${name} — profesional verificado`;
  }
}

function localizedDocumentTitle(locale: Locale, dictionary: Record<string, string>) {
  const path = window.location.pathname;
  const marketSlug = path.match(/^\/mercados\/([^/?#]+)/)?.[1];
  const market = marketSlug ? getActiveMarketBySlug(decodeURIComponent(marketSlug)) : null;

  if (path === "/") {
    return `RegiKaha — ${dictionaries[locale].hero.title}`;
  }

  if (path === "/mercados") {
    return `${marketsDictionaries[locale].index.title} | RegiKaha`;
  }

  if (market) {
    const name = countryName(market.code, locale, market.name);
    return `${verifiedProfessionalsTitle(locale, name)} | RegiKaha`;
  }

  if (path.startsWith("/profesionales/")) {
    const name = document.querySelector("h1")?.textContent?.trim();
    if (name) return `${verifiedProfileTitle(locale, name)} | RegiKaha`;
  }

  const heading = document.querySelector("main h1, body > div h1")?.textContent?.trim();
  if (heading) return `${heading} | RegiKaha`;

  return replaceKnownPhrases(document.title, dictionary);
}

function setDocumentTitle(value: string) {
  let title = document.head.querySelector("title");
  if (!title) {
    title = document.createElement("title");
    document.head.appendChild(title);
  }
  if (title.textContent !== value) title.textContent = value;
}

function localizeDocumentMetadata(locale: Locale, dictionary: Record<string, string>) {
  setDocumentTitle(localizedDocumentTitle(locale, dictionary));

  document
    .querySelectorAll<HTMLMetaElement>(
      'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]',
    )
    .forEach((meta) => {
      const value = meta.getAttribute("content");
      if (!value) return;
      const next = replaceKnownPhrases(value, dictionary);
      if (next !== value) meta.setAttribute("content", next);
    });
}

export function DomTextLocalizer() {
  const { locale } = useI18n();

  useEffect(() => {
    const dictionary = { ...domTextDictionaries[locale], ...releaseTextDictionaries[locale], ...subscriptionTextDictionaries[locale] };
    localizeDocumentMetadata(locale, dictionary);
    if (locale === "es") return;
    localizeNode(document, dictionary);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.parentElement) {
          localizeNode(mutation.target.parentElement, dictionary);
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            localizeNode(node.parentElement, dictionary);
          } else if (node instanceof Element) {
            localizeNode(node, dictionary);
          }
        });
      }
      localizeDocumentMetadata(locale, dictionary);
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    observer.observe(document.head, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  return null;
}
