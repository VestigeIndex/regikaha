type CostEnv = Record<string, unknown> & {
  DB?: any;
  API_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
  TURNSTILE_SECRET_KEY?: string;
};

type PlanName = "free" | "autonomo_nacional" | "europa_pro";

const localBuckets = new Map<string, { count: number; resetAt: number }>();

export const survivalDefaults = {
  COST_MODE: "survival",
  MAX_FREE_PROJECT_PHOTOS: 4,
  MAX_FREE_PROFILE_PHOTOS: 6,
  MAX_PRO_PROFILE_PHOTOS: 30,
  MAX_UPLOAD_SIZE_MB: 2,
  MAX_FINAL_IMAGE_SIZE_KB: 350,
  MAX_PRO_FINAL_IMAGE_SIZE_KB: 500,
  MAX_IMAGE_WIDTH: 1600,
  MAX_THUMBNAIL_WIDTH: 400,
  MAX_FREE_PROJECTS_PER_CLIENT_MONTH: 3,
  MAX_FREE_PROFESSIONAL_PROFILE_UPDATES_DAY: 10,
  MAX_PUBLIC_SEARCHES_PER_IP_HOUR: 60,
  MAX_API_REQUESTS_PER_IP_MINUTE: 30,
  MAX_API_REQUESTS_PER_USER_MINUTE: 60,
  MAX_LEAD_SEARCHES_PER_USER_DAY: 30,
  MAX_EMAILS_PER_USER_DAY: 3,
  MAX_EMAILS_PER_IP_DAY: 10,
} as const;

function integer(env: CostEnv, key: keyof typeof survivalDefaults): number {
  const parsed = Number(env[key]);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : Number(survivalDefaults[key]);
}

export function costMode(env: CostEnv): string {
  return String(env.COST_MODE || survivalDefaults.COST_MODE).toLowerCase();
}

export function enforceCostMode(env: CostEnv, feature: "video" | "document" | "ai" | "background_job" | "public_export") {
  if (costMode(env) !== "survival") return null;
  const flags: Record<typeof feature, string> = {
    video: "ENABLE_VIDEO_UPLOADS",
    document: "ENABLE_DOCUMENT_UPLOADS",
    ai: "ENABLE_AI_FEATURES",
    background_job: "ENABLE_BACKGROUND_JOBS",
    public_export: "ENABLE_PUBLIC_EXPORTS",
  };
  return String(env[flags[feature]] || "false") === "true"
    ? null
    : safeJsonResponse({ error: "feature_disabled_in_survival_mode" }, 403);
}

export function enforcePlanLimits(env: CostEnv, plan: PlanName) {
  const pro = plan === "europa_pro";
  return {
    projectPhotos: integer(env, "MAX_FREE_PROJECT_PHOTOS"),
    profilePhotos: pro ? integer(env, "MAX_PRO_PROFILE_PHOTOS") : integer(env, "MAX_FREE_PROFILE_PHOTOS"),
    sourceBytes: integer(env, "MAX_UPLOAD_SIZE_MB") * 1024 * 1024,
    finalBytes: integer(env, pro ? "MAX_PRO_FINAL_IMAGE_SIZE_KB" : "MAX_FINAL_IMAGE_SIZE_KB") * 1024,
    maxWidth: integer(env, "MAX_IMAGE_WIDTH"),
    thumbnailWidth: integer(env, "MAX_THUMBNAIL_WIDTH"),
  };
}

export function enforceUploadLimits(env: CostEnv, input: { file: File; plan: PlanName; thumbnail?: boolean }): Response | null {
  const limits = enforcePlanLimits(env, input.plan);
  const maximum = input.thumbnail ? Math.min(140 * 1024, limits.finalBytes) : limits.finalBytes;
  if (input.file.size > maximum) {
    return safeJsonResponse({ error: "image_not_optimized", maxBytes: maximum }, 413);
  }
  if (!new Set(["image/jpeg", "image/webp"]).has(input.file.type)) {
    return safeJsonResponse({ error: "unsupported_image_format" }, 415);
  }
  return null;
}

function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP")
    || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()
    || "unknown";
}

function localLimit(key: string, limit: number, periodSeconds: number): boolean {
  const now = Date.now();
  const existing = localBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    localBuckets.set(key, { count: 1, resetAt: now + periodSeconds * 1000 });
    if (localBuckets.size > 10_000) {
      for (const [bucketKey, bucket] of localBuckets) {
        if (bucket.resetAt <= now) localBuckets.delete(bucketKey);
      }
    }
    return true;
  }
  existing.count += 1;
  return existing.count <= limit;
}

async function rateLimit(env: CostEnv, key: string, limit: number, periodSeconds: number): Promise<Response | null> {
  const limiter = env.API_RATE_LIMITER;
  const allowed = limiter
    ? (await limiter.limit({ key })).success
    : localLimit(key, limit, periodSeconds);
  return allowed ? null : safeJsonResponse(
    { error: "rate_limit_exceeded", retryAfter: periodSeconds },
    429,
    { "Retry-After": String(periodSeconds) },
  );
}

export function rateLimitByIP(env: CostEnv, request: Request, route: string, limit?: number, periodSeconds = 60) {
  return rateLimit(
    env,
    `ip:${clientIp(request)}:${route}`,
    limit ?? integer(env, "MAX_API_REQUESTS_PER_IP_MINUTE"),
    periodSeconds,
  );
}

export function rateLimitByUser(env: CostEnv, userId: string, route: string, limit?: number, periodSeconds = 60) {
  return rateLimit(
    env,
    `user:${userId}:${route}`,
    limit ?? integer(env, "MAX_API_REQUESTS_PER_USER_MINUTE"),
    periodSeconds,
  );
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function consumePersistentQuota(
  env: CostEnv,
  key: string,
  limit: number,
  window: "day" | "month",
): Promise<{ allowed: boolean; count: number; limit: number }> {
  if (!env.DB) return { allowed: true, count: 0, limit };
  const hashedKey = await sha256(key);
  const windowStart = window === "month"
    ? new Date().toISOString().slice(0, 7)
    : new Date().toISOString().slice(0, 10);
  const expiresModifier = window === "month" ? "+35 days" : "+2 days";
  const row = await env.DB.prepare(
    `INSERT INTO cost_usage_counters (usage_key,window_start,count,expires_at,updated_at)
     VALUES (?,?,1,datetime('now',?),datetime('now'))
     ON CONFLICT(usage_key,window_start) DO UPDATE SET
       count = cost_usage_counters.count + 1,
       updated_at = datetime('now')
     RETURNING count`,
  ).bind(hashedKey, windowStart, expiresModifier).first();
  const count = Number(row?.count || 1);
  return { allowed: count <= limit, count, limit };
}

export function validateRequestSize(request: Request, maxBytes: number): Response | null {
  const value = Number(request.headers.get("Content-Length") || 0);
  return value > maxBytes
    ? safeJsonResponse({ error: "request_too_large", maxBytes }, 413)
    : null;
}

export function blockSuspiciousBots(request: Request): Response | null {
  const userAgent = String(request.headers.get("User-Agent") || "").toLowerCase();
  if (!userAgent) return safeJsonResponse({ error: "missing_user_agent" }, 403);
  const blocked = ["sqlmap", "nikto", "masscan", "zgrab", "nuclei", "dirbuster"];
  return blocked.some((token) => userAgent.includes(token))
    ? safeJsonResponse({ error: "automated_request_blocked" }, 403)
    : null;
}

export async function requireTurnstile(
  env: CostEnv,
  request: Request,
  token: unknown,
  expectedAction?: string,
): Promise<Response | null> {
  const enabled = String(env.REGIKAHA_ENABLE_TURNSTILE ?? "true") !== "false";
  if (!enabled) return null;
  const secret = String(env.TURNSTILE_SECRET_KEY || "");
  if (!secret) return safeJsonResponse({ error: "turnstile_not_configured" }, 503);
  const responseToken = String(token || "");
  if (!responseToken || responseToken.length > 2048) {
    return safeJsonResponse({ error: "turnstile_required" }, 400);
  }

  try {
    const form = new FormData();
    form.set("secret", secret);
    form.set("response", responseToken);
    form.set("remoteip", clientIp(request));
    form.set("idempotency_key", crypto.randomUUID());
    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const result = await verification.json() as { success?: boolean; action?: string };
    if (!result.success || (expectedAction && result.action && result.action !== expectedAction)) {
      return safeJsonResponse({ error: "turnstile_failed" }, 400);
    }
    return null;
  } catch {
    return safeJsonResponse({ error: "turnstile_unavailable" }, 503);
  }
}

export async function cachePublicResponse(request: Request, ttlSeconds: number, producer: () => Promise<Response>) {
  if (request.method !== "GET" || request.headers.has("Authorization") || request.headers.has("Cookie")) return producer();
  const cache = (caches as unknown as { default?: Cache }).default;
  if (!cache) return producer();
  const cacheKey = new Request(request.url, { method: "GET", headers: { Accept: "application/json" } });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const response = await producer();
  if (response.ok) {
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", `public, max-age=0, s-maxage=${ttlSeconds}`);
    const cacheable = new Response(response.clone().body, { status: response.status, headers });
    await cache.put(cacheKey, cacheable.clone());
    return cacheable;
  }
  return response;
}

export function safeJsonResponse(data: unknown, status = 200, initHeaders: HeadersInit = {}) {
  const headers = new Headers(initHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(data), { status, headers });
}

export function maskSensitiveLogs(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(maskSensitiveLogs);
  if (!value || typeof value !== "object") return value;
  const sensitive = /email|phone|token|secret|password|authorization|cookie/i;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    sensitive.test(key) ? "[REDACTED]" : maskSensitiveLogs(item),
  ]));
}

export function configuredLimit(env: CostEnv, key: keyof typeof survivalDefaults) {
  return integer(env, key);
}
