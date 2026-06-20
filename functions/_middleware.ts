const CANONICAL_HOST = "regikaha.com";
const LOCALES = new Set(["es", "fr", "it", "pt", "de", "nl", "en"]);

export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  if (url.hostname.toLowerCase() === `www.${CANONICAL_HOST}`) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return new Response(null, {
      status: 308,
      headers: {
        Location: url.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const locale = url.pathname.split("/").filter(Boolean)[0];
  const response = await context.next();
  if (!LOCALES.has(locale) || !String(response.headers.get("content-type") || "").includes("text/html")) return response;

  return new HTMLRewriter()
    .on("html", { element(element: any) { element.setAttribute("lang", locale); } })
    .transform(response);
}
