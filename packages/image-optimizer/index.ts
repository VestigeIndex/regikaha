export type ImagePlan = "free" | "autonomo_nacional" | "europa_pro";

export type ImageOptions = {
  maxWidth?: number;
  maxBytes?: number;
  quality?: number;
};

export type OptimizedImage = {
  file: File;
  width: number;
  height: number;
  originalBytes: number;
  finalBytes: number;
};

const sourceLimit = 2 * 1024 * 1024;

export function enforceImageLimits(userPlan: ImagePlan) {
  return {
    sourceBytes: sourceLimit,
    finalBytes: (userPlan === "europa_pro" ? 500 : 350) * 1024,
    maxWidth: 1600,
    thumbnailWidth: 400,
    profilePhotos: userPlan === "europa_pro" ? 30 : 6,
    projectPhotos: 4,
  };
}

export function validateImageFile(file: File, userPlan: ImagePlan = "free") {
  const limits = enforceImageLimits(userPlan);
  if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
    throw new Error("unsupported_image_format");
  }
  if (file.size > limits.sourceBytes) throw new Error("source_image_too_large");
  return limits;
}

async function loadImage(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("image_compression_failed")), "image/webp", quality);
  });
}

export async function compressImage(file: File, options: ImageOptions = {}): Promise<OptimizedImage> {
  const image = await loadImage(file);
  const maxWidth = options.maxWidth || 1600;
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("image_compression_failed");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const maxBytes = options.maxBytes || 350 * 1024;
  let quality = options.quality || 0.82;
  let blob = await canvasBlob(canvas, quality);
  while (blob.size > maxBytes && quality > 0.42) {
    quality -= 0.08;
    blob = await canvasBlob(canvas, quality);
  }
  if (blob.size > maxBytes) throw new Error("image_cannot_reach_target_size");
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  const optimized = new File([blob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() });
  return { file: optimized, width, height, originalBytes: file.size, finalBytes: optimized.size };
}

export async function createThumbnail(file: File): Promise<OptimizedImage> {
  return compressImage(file, { maxWidth: 400, maxBytes: 120 * 1024, quality: 0.76 });
}

export async function optimizeImageForUpload(file: File, userPlan: ImagePlan = "free") {
  const limits = validateImageFile(file, userPlan);
  const image = await compressImage(file, { maxWidth: limits.maxWidth, maxBytes: limits.finalBytes });
  const thumbnail = await createThumbnail(image.file);
  return { image, thumbnail };
}

export function getFinalImageSize(file: File | Blob) {
  return file.size;
}

export async function uploadOptimizedImageToR2(bucket: any, file: File, path: string, metadata: Record<string, string> = {}) {
  await bucket.put(path, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: metadata,
  });
  return path;
}

export function deleteOriginalIfTemporary() {
  // Browser object URLs are revoked immediately by loadImage; no original is persisted.
}
