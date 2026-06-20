import type { Locale } from "./config";

type CostControlsCopy = {
  photosLabel: string;
  photosHint: string;
  photosSelected: string;
  optimizing: string;
  invalidImage: string;
  contactError: string;
};

export const costControlsDictionaries: Record<Locale, CostControlsCopy> = {
  es: {
    photosLabel: "Fotos del proyecto",
    photosHint: "Hasta 4 fotos, 2 MB por original. Se optimizan antes de subir.",
    photosSelected: "fotos preparadas",
    optimizing: "Optimizando imágenes...",
    invalidImage: "No se pudo preparar una imagen. Usa JPG, PNG o WebP de hasta 2 MB.",
    contactError: "No se pudo enviar el mensaje.",
  },
  fr: {
    photosLabel: "Photos du projet",
    photosHint: "Jusqu'à 4 photos, 2 Mo par original. Elles sont optimisées avant l'envoi.",
    photosSelected: "photos préparées",
    optimizing: "Optimisation des images...",
    invalidImage: "Impossible de préparer une image. Utilisez JPG, PNG ou WebP jusqu'à 2 Mo.",
    contactError: "Impossible d'envoyer le message.",
  },
  it: {
    photosLabel: "Foto del progetto",
    photosHint: "Fino a 4 foto, 2 MB per originale. Vengono ottimizzate prima del caricamento.",
    photosSelected: "foto pronte",
    optimizing: "Ottimizzazione delle immagini...",
    invalidImage: "Impossibile preparare un'immagine. Usa JPG, PNG o WebP fino a 2 MB.",
    contactError: "Impossibile inviare il messaggio.",
  },
  pt: {
    photosLabel: "Fotografias do projeto",
    photosHint: "Até 4 fotografias, 2 MB por original. São otimizadas antes do envio.",
    photosSelected: "fotografias preparadas",
    optimizing: "A otimizar imagens...",
    invalidImage: "Não foi possível preparar uma imagem. Utilize JPG, PNG ou WebP até 2 MB.",
    contactError: "Não foi possível enviar a mensagem.",
  },
  de: {
    photosLabel: "Projektfotos",
    photosHint: "Bis zu 4 Fotos, 2 MB pro Original. Sie werden vor dem Upload optimiert.",
    photosSelected: "Fotos vorbereitet",
    optimizing: "Bilder werden optimiert...",
    invalidImage: "Ein Bild konnte nicht vorbereitet werden. Nutze JPG, PNG oder WebP bis 2 MB.",
    contactError: "Die Nachricht konnte nicht gesendet werden.",
  },
  nl: {
    photosLabel: "Projectfoto's",
    photosHint: "Maximaal 4 foto's, 2 MB per origineel. Ze worden vóór upload geoptimaliseerd.",
    photosSelected: "foto's voorbereid",
    optimizing: "Afbeeldingen optimaliseren...",
    invalidImage: "Een afbeelding kon niet worden voorbereid. Gebruik JPG, PNG of WebP tot 2 MB.",
    contactError: "Het bericht kon niet worden verzonden.",
  },
  en: {
    photosLabel: "Project photos",
    photosHint: "Up to 4 photos, 2 MB per original. They are optimized before upload.",
    photosSelected: "photos ready",
    optimizing: "Optimizing images...",
    invalidImage: "An image could not be prepared. Use JPG, PNG or WebP up to 2 MB.",
    contactError: "The message could not be sent.",
  },
};
