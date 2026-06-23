function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
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

function styles() {
  return `<style>
    :root{color-scheme:light;--ink:#0e1a2b;--muted:#66756f;--forest:#1f6fe0;--mint:#d9edff;--canvas:#f7f7f3}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:var(--canvas);color:var(--ink)}
    a{color:inherit}.wrap{max-width:1160px;margin:auto;padding:0 20px}.hero{background:linear-gradient(135deg,#11357e,#1f6fe0);color:white;padding:52px 0 88px}.top{display:flex;justify-content:space-between;gap:16px;align-items:center}.brand{font-weight:800;font-size:20px}.pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:#fff2;padding:7px 11px;font-size:13px}
    .head{margin-top:-54px;display:grid;grid-template-columns:1fr 340px;gap:24px;align-items:start}.card{background:white;border:1px solid #dfe7e2;border-radius:18px;box-shadow:0 18px 40px #0e1a2b14}.main{padding:28px}.profile{display:flex;gap:18px;align-items:flex-start}.avatar{display:grid;place-items:center;width:86px;height:86px;border-radius:22px;background:#1f6fe0;color:white;font-size:30px;font-weight:800;overflow:hidden;flex:none}.avatar img{width:100%;height:100%;object-fit:cover}.h1{font-size:34px;line-height:1.05;margin:0}.muted{color:var(--muted)}.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.chip{border-radius:999px;background:var(--mint);color:#11357e;padding:7px 10px;font-size:13px;font-weight:650}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:22px}.stat{border-radius:14px;background:#f3f5f1;padding:14px}.stat strong{display:block;font-size:20px}
    section{margin-top:32px}.section-title{font-size:22px;margin:0 0 12px}.list{display:grid;gap:12px}.service{padding:18px;border-radius:16px;background:#f7f7f3}.service h3{margin:0}.portfolio{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.portfolio img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px;background:#edf1ed}.side{padding:20px}.btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;background:var(--forest);color:white;text-decoration:none;font-weight:750;padding:12px 16px;cursor:pointer;width:100%}.input,.textarea{width:100%;border:0;border-radius:13px;background:#f3f5f1;padding:12px;margin-top:6px;font:inherit}.textarea{min-height:96px;resize:vertical}.field{display:block;margin-top:12px;font-size:12px;font-weight:750;text-transform:uppercase;color:var(--muted)}.map{width:100%;height:245px;border:0;border-radius:16px;background:#edf1ed}.ok,.err{display:none;margin-top:12px;font-size:14px}.ok{color:#11357e}.err{color:#b42318}
    @media(max-width:880px){.head{grid-template-columns:1fr}.grid{grid-template-columns:repeat(2,1fr)}.portfolio{grid-template-columns:1fr}.h1{font-size:28px}.profile{flex-direction:column}.hero{padding-bottom:76px}}
  </style>`;
}

export async function onRequestGet(context: any) {
  const slug = String(context.params.slug || "");
  const p = await context.env.DB.prepare("SELECT * FROM professionals WHERE slug = ? AND active_status = 1").bind(slug).first();
  if (!p) return context.next ? context.next() : new Response("No encontrado", { status: 404 });

  const [catRows, serviceRows, portfolioRows] = await Promise.all([
    context.env.DB.prepare("SELECT category_id FROM professional_categories WHERE professional_id = ?").bind(p.id).all(),
    context.env.DB.prepare("SELECT * FROM services WHERE professional_id = ? AND is_active = 1 ORDER BY title COLLATE NOCASE").bind(p.id).all(),
    context.env.DB.prepare("SELECT * FROM portfolio_items WHERE professional_id = ? AND moderation_status = 'approved' ORDER BY sort_order ASC, created_at DESC LIMIT 5").bind(p.id).all(),
  ]);

  const categories = (catRows.results || []).map((row: any) => row.category_id);
  const services = serviceRows.results || [];
  const portfolio = portfolioRows.results || [];
  const origin = new URL(context.request.url).origin;
  const publicName = p.public_name || "Profesional Regi Kaha";
  const area = [p.city, p.region, p.country].filter(Boolean).join(", ");
  const title = p.seo_title || `${publicName} - profesional verificado en ${area || "mercados activos"} | Regi Kaha`;
  const description = p.seo_description || p.short_tagline || String(p.description || "").slice(0, 155);
  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: publicName,
    description,
    url: `${origin}/profesionales/${p.slug}`,
    areaServed: area || "Active markets",
    address: { "@type": "PostalAddress", addressLocality: p.city, addressRegion: p.region, addressCountry: p.country },
    knowsAbout: categories,
    knowsLanguage: jsonArray(p.languages),
  };

  const logo = p.logo_image
    ? `<img src="${esc(p.logo_image)}" alt="">`
    : esc(initials(publicName));
  const serviceHtml = services.map((s: any) => `
    <a class="service" href="/profesionales/${esc(p.slug)}/${esc(s.slug)}" style="display:block;text-decoration:none">
      <h3>${esc(s.title)}</h3>
      <p class="muted">${esc(s.description)}</p>
      <strong>${money(s.price_from)}</strong>
    </a>`).join("");
  const portfolioHtml = portfolio.map((item: any) => `
    <article>
      <img src="${esc(item.image_url)}" alt="${esc(item.title)}" loading="lazy">
      <h3>${esc(item.title)}</h3>
      <p class="muted">${esc(item.location || "")}</p>
    </article>`).join("");
  const mapQuery = encodeURIComponent(area || "Active markets");

  const html = `<!doctype html><html lang="es"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${origin}/profesionales/${esc(p.slug)}">
    <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
    <meta property="og:type" content="profile"><meta property="og:url" content="${origin}/profesionales/${esc(p.slug)}">
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
    ${styles()}
  </head><body>
    <header class="hero"><div class="wrap top"><a class="brand" href="/">Regi Kaha</a><span class="pill">Profesional verificado</span></div></header>
    <main class="wrap head">
      <article class="card main">
        <div class="profile">
          <div class="avatar" style="background:${esc(p.logo_color || "#1f6fe0")}">${logo}</div>
          <div>
            <h1 class="h1">${esc(publicName)}</h1>
            <p class="muted">${esc(p.short_tagline || "")}</p>
            <p>📍 ${esc(area || "mercados activos")} · responde en ${esc(p.response_time_hours || 24)} h</p>
            ${p.service_area_note ? `<p class="muted">🗺️ ${esc(p.service_area_note)}</p>` : ""}
            <div class="chips">${[
              ...categories.map((c: string) => `<span class="chip">${esc(c)}</span>`),
              p.insurance_declared ? `<span class="chip">Seguro de R. C.</span>` : "",
              p.invoice_declared ? `<span class="chip">Trabaja con factura</span>` : "",
              p.docs_declared ? `<span class="chip">Documentación al día</span>` : "",
              p.offers_urgent ? `<span class="chip">Atiende urgencias</span>` : "",
            ].filter(Boolean).join("")}</div>
          </div>
        </div>
        <div class="grid">
          <div class="stat"><strong>${esc(p.completed_projects || 0)}</strong><span class="muted">Proyectos</span></div>
          <div class="stat"><strong>${esc(p.years_experience || 0)}</strong><span class="muted">Años</span></div>
          <div class="stat"><strong>${money(p.price_from)}</strong><span class="muted">Desde</span></div>
          <div class="stat"><strong>${esc(p.average_rating || "0")}/5</strong><span class="muted">Valoración</span></div>
        </div>
        <section><h2 class="section-title">Sobre ${esc(publicName)}</h2><p>${esc(p.description || "")}</p></section>
        <section><h2 class="section-title">Zona de operación</h2><iframe class="map" src="https://www.google.com/maps?q=${mapQuery}&output=embed" loading="lazy"></iframe></section>
        ${services.length ? `<section><h2 class="section-title">Servicios</h2><div class="list">${serviceHtml}</div></section>` : ""}
        ${portfolio.length ? `<section><h2 class="section-title">Trabajos realizados</h2><div class="portfolio">${portfolioHtml}</div></section>` : ""}
      </article>
      <aside class="card side">
        <h2 class="section-title">Pide pre-presupuesto gratis</h2>
        <form id="quote">
          <input type="hidden" name="professionalId" value="${esc(p.id)}">
          <input type="hidden" name="categoryId" value="${esc(categories[0] || "")}">
          <label class="field">Nombre<input class="input" name="name" required></label>
          <label class="field">Email<input class="input" type="email" name="email" required></label>
          <label class="field">Teléfono<input class="input" name="phone"></label>
          <label class="field">Ciudad<input class="input" name="city" required></label>
          <label class="field">País<input class="input" name="country" value="${esc(p.country || "")}" required></label>
          <label class="field">Proyecto<textarea class="textarea" name="description" required></textarea></label>
          <div class="cf-turnstile" data-sitekey="0x4AAAAAADoWgsg2pjcNtzCF" data-action="request_quote"></div>
          <p class="muted" style="font-size:12px">Los pre-presupuestos son estimaciones iniciales no vinculantes. El precio final puede variar tras visita técnica, mediciones, materiales, permisos o revisión del estado real.</p>
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
