"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { domTextDictionaries } from "@/lib/i18n/dom.generated";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE"]);

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function replaceKnownPhrases(value: string, dictionary: Record<string, string>) {
  const normalized = normalizeText(value);
  if (!normalized) return value;
  const exact = dictionary[normalized];
  if (exact) return value.replace(normalized, exact);

  let next = value;
  for (const [source, translated] of Object.entries(dictionary)) {
    if (source.length < 4 || source === translated) continue;
    next = next.split(source).join(translated);
  }
  return next;
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

export function DomTextLocalizer() {
  const { locale } = useI18n();

  useEffect(() => {
    if (locale === "es") return;
    const dictionary = domTextDictionaries[locale];
    localizeNode(document, dictionary);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            localizeNode(node.parentElement, dictionary);
          } else if (node instanceof Element) {
            localizeNode(node, dictionary);
          }
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  return null;
}
