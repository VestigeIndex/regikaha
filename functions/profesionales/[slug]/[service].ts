function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(value: unknown): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function jsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function list(items: string[]) {
  return items.length ? `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : `<p class="muted">Se concreta en la visita o primera valoración.</p>`;
}

function styles() {
  return `<style>
    :root{--ink:#10231d;--muted:#66756f;--forest:#198c68;--mint:#e7f6ef;--canvas:#f7f7f3}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:var(--canvas);color:var(--ink)}
    a{color:inherit}.wrap{max-width:1100px;margin:auto;padding:0 20px}.hero{background:linear-gradient(135deg,#0f5c4a,#198c68);color:white;padding:42px 0}.brand{font-weight:800;font-size:20px}.grid{display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start;margin-top:28px}.card{background:white;border:1px solid #dfe7e2;border-radius:18px;box-shadow:0 18px 40px #10231d14;padding:24px}.h1{font-size:36px;line-height:1.05;margin:12px 0}.muted{color:var(--muted)}.chip{display:inline-flex;border-radius:999px;background:var(--mint);color:#116146;padding:7px 10px;font-size:13px;font-weight:650}.price{font-size:30px;font-weight:850}.cols{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.box{border-radius:16px;background:#f7f7f3;padding:16px}li{margin:8px 0}.btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;background:var(--forest);color:white;text-decoration:none;font-weight:750;padding:12px 16px;cursor:pointer;width:100%}.input,.textarea{width:100%;border:0;border-radius:13px;background:#f3f5f1;padding:12px;margin-top:6px;font:inherit}.textarea{min-height:96px;resize:vertical}.field{display:block;margin-top:12px;font-size:12px;font-weight:750;text-transform:uppercase;color:var(--muted)}.ok,.err{display:none;margin-top:12px;font-size:14px}.ok{color:#116146}.err{color:#b42318}
    @media(max-width:860px){.grid{grid-template-columns:1fr}.cols{grid-template-columns:1fr}.h1{font-size:29px}}
  </style>`;
}

export async function onRequestGet(context: any) {
  const slug = String(context.params.slug || "");
  const serviceSlug = String(context.params.service || "");
  const row = await context.env.DB.prepare(
    `SELECT s.*, p.public_name, p.slug AS professional_slug, p.city, p.region, p.country, p.logo_image, p.short_tagline
     FROM services s
     JOIN professionals p ON p.id = s.professional_id
     WHERE p.slug = ? AND s.slug = ? AND p.active_status = 1 AND s.is_active = 1`,
  ).bind(slug, serviceSlug).first();
  if (!row) return context.next ? context.next() : new Response("No encontrado", { status: 404 });

  const origin = new URL(context.request.url).origin;
  const area = row.service_area || [row.city, row.region, row.country].filter(Boolean).join(", ");
  const title = `${row.title} en ${area || "mercados activos"} | ${row.public_name} | RegiKaha`;
  const description = String(row.description || "").slice(0, 160);
  const includes = jsonArray(row.includes);
  const excludes = jsonArray(row.excludes);
  const process = jsonArray(row.process);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: row.title,
    description,
    areaServed: area || "Active markets",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: row.public_name,
      url: `${origin}/profesionales/${row.professional_slug}`,
    },
    offers: { "@type": "Offer", price: Number(row.price_from || 0), priceCurrency: "EUR" },
  };

  const html = `<!doctype html><html lang="es"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${origin}/profesionales/${esc(row.professional_slug)}/${esc(row.slug)}">
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
    ${styles()}
  </head><body>
    <header class="hero"><div class="wrap"><a class="brand" href="/">RegiKaha</a><h1 class="h1">${esc(row.title)}</h1><p>${esc(row.public_name)} · ${esc(area || "mercados activos")}</p></div></header>
    <main class="wrap grid">
      <article class="card">
        <span class="chip">Servicio profesional</span>
        <p class="price">${money(row.price_from)}</p>
        <p class="muted">${esc(row.estimated_time || "Tiempo a concretar")}</p>
        <p>${esc(row.description || "")}</p>
        <div class="cols">
          <section class="box"><h2>Incluye</h2>${list(includes)}</section>
          <section class="box"><h2>No incluye</h2>${list(excludes)}</section>
          <section class="box"><h2>Proceso</h2>${list(process)}</section>
        </div>
      </article>
      <aside class="card">
        <h2>Pide pre-presupuesto gratis</h2>
        <form id="quote">
          <input type="hidden" name="professionalId" value="${esc(row.professional_id)}">
          <input type="hidden" name="serviceId" value="${esc(row.id)}">
          <input type="hidden" name="categoryId" value="${esc(row.category_id || "")}">
          <label class="field">Nombre<input class="input" name="name" required></label>
          <label class="field">Email<input class="input" type="email" name="email" required></label>
          <label class="field">Teléfono<input class="input" name="phone"></label>
          <label class="field">Ciudad<input class="input" name="city" required></label>
          <label class="field">País<input class="input" name="country" value="${esc(row.country || "")}" required></label>
          <label class="field">Proyecto<textarea class="textarea" name="description" required>${esc(row.title)}: </textarea></label>
          <div class="cf-turnstile" data-sitekey="0x4AAAAAADoWgsg2pjcNtzCF" data-action="request_quote"></div>
          <p class="muted" style="font-size:12px">Estimación inicial no vinculante. El precio definitivo puede variar tras visita técnica, mediciones, materiales, permisos o revisión real del trabajo.</p>
          <button class="btn" type="submit">Enviar solicitud</button>
          <p class="ok" id="ok">Solicitud enviada correctamente.</p><p class="err" id="err"></p>
        </form>
      </aside>
    </main>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <script>
      document.getElementById("quote").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        data.turnstileToken = data["cf-turnstile-response"] || "";
        delete data["cf-turnstile-response"];
        const res = await fetch("/api/quote", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(data) });
        if (res.ok) { form.reset(); window.turnstile?.reset(); document.getElementById("ok").style.display="block"; document.getElementById("err").style.display="none"; }
        else { window.turnstile?.reset(); const body = await res.json().catch(() => ({})); const err = document.getElementById("err"); err.textContent = body.error || "No se pudo enviar"; err.style.display="block"; }
      });
    </script>
  </body></html>`;

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
