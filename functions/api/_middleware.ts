import {
  blockSuspiciousBots,
  rateLimitByIP,
  safeJsonResponse,
  validateRequestSize,
} from "../../packages/cost-guards";

const writeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const allowedHosts = new Set(["regikaha.com", "www.regikaha.com", "regikaha.pages.dev"]);

function corsHeaders(request: Request) {
  const headers = new Headers();
  const origin = request.headers.get("Origin");
  if (origin) headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  headers.set("Vary", "Origin");
  return headers;
}

function originAllowed(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    const url = new URL(origin);
    return allowedHosts.has(url.hostname)
      || url.hostname.endsWith(".regikaha.pages.dev")
      || url.hostname === "localhost"
      || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export async function onRequest(context: any) {
  const { request, env } = context;
  if (!originAllowed(request)) return safeJsonResponse({ error: "origin_not_allowed" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });

  if (writeMethods.has(request.method)) {
    const bot = blockSuspiciousBots(request);
    if (bot) return bot;
  }

  const url = new URL(request.url);
  const isUpload = url.pathname === "/api/portfolio" || url.pathname === "/api/projects";
  const sizeError = validateRequestSize(request, isUpload ? 10 * 1024 * 1024 : 96 * 1024);
  if (sizeError) return sizeError;

  const limited = await rateLimitByIP(env, request, `${request.method}:${url.pathname}`);
  if (limited) return limited;

  const response = await context.next();
  const headers = new Headers(response.headers);
  for (const [key, value] of corsHeaders(request)) headers.set(key, value);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
