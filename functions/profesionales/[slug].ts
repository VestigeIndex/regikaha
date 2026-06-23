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
    :root{--ink:#111827;--muted:#5b6b82;--blue:#0f766e;--deep:#064e3b;--celeste:#14b8a6;--mint:#ecfdf5;--canvas:#f8faf7;--line:#e5e7eb}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;background:var(--canvas);color:var(--ink);-webkit-font-smoothing:antialiased}
    a{color:inherit;text-decoration:none}img{display:block}
    .wrap{max-width:1120px;margin:auto;padding:0 20px}
    .nav{position:sticky;top:0;z-index:30;backdrop-filter:blur(14px);background:rgba(255,255,255,.74);border-bottom:1px solid var(--line)}
    .nav .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
    .brand{font-weight:800;font-size:18px;letter-spacing:-.02em;background:linear-gradient(135deg,var(--deep),var(--celeste));-webkit-background-clip:text;background-clip:text;color:transparent}
    .nav-cta{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#003b2f,#0f766e 45%,#14b8a6 100%);color:#fff;padding:9px 16px;border-radius:999px;font-weight:700;font-size:14px}
    .cover{position:relative;height:230px;background:linear-gradient(135deg,#003b2f 0%,#0f766e 52%,#14b8a6 100%);overflow:hidden}
    .cover::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 80% -10%,rgba(255,255,255,.28),transparent 55%)}
    .cover-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.09) 1px,transparent 1px);background-size:42px 42px}
    .head-card{margin-top:-70px;position:relative;z-index:5;background:#fff;border:1px solid var(--line);border-radius:24px;box-shadow:0 28px 70px -34px rgba(6,78,59,.4);padding:26px}
    .head-top{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
    .avatar{width:108px;height:108px;border-radius:28px;display:grid;place-items:center;color:#fff;font-weight:800;font-size:38px;box-shadow:0 14px 34px -12px rgba(6,78,59,.55);border:4px solid #fff;overflow:hidden;flex:none;margin-top:-58px}
    .avatar img{width:100%;height:100%;object-fit:cover}
    .h1{font-size:30px;font-weight:800;letter-spacing:-.02em;margin:0;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .verified{display:inline-flex;align-items:center;gap:5px;background:rgba(20,184,166,.15);color:var(--deep);font-weight:700;font-size:13px;padding:4px 10px;border-radius:999px}
    .tag{color:var(--muted);margin:.4rem 0 0;font-size:15px}
    .meta{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:.55rem;color:var(--muted);font-size:14px}
    .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
    .chip{border-radius:999px;background:var(--mint);color:var(--deep);padding:7px 12px;font-size:13px;font-weight:650}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px}
    .stat{border-radius:16px;background:var(--canvas);border:1px solid var(--line);padding:15px;text-align:center}
    .stat strong{display:block;font-size:23px;font-weight:800;background:linear-gradient(135deg,var(--deep),var(--celeste));-webkit-background-clip:text;background-clip:text;color:transparent}
    .stat span{color:var(--muted);font-size:13px}
    .body{display:grid;grid-template-columns:1fr 360px;gap:24px;margin:24px 0 64px;align-items:start}
    .section{background:#fff;border:1px solid var(--line);border-radius:22px;padding:26px;margin-bottom:20px}
    .section h2{font-size:20px;font-weight:800;letter-spacing:-.01em;margin:0 0 14px}
    .section p{line-height:1.7;color:#374151;margin:0}
    .svc{display:grid;gap:12px}
    .svc a{display:block;padding:16px 18px;border:1px solid var(--line);border-radius:16px;transition:.18s;background:#fff}
    .svc a:hover{border-color:var(--celeste);box-shadow:0 14px 30px -18px rgba(15,118,110,.55);transform:translateY(-2px)}
    .svc h3{margin:0 0 4px;font-size:16px}.svc strong{color:var(--blue);font-size:17px}
    .slider{position:relative;border-radius:18px;overflow:hidden;background:#01281f}
    .slides{display:flex;transition:transform .6s cubic-bezier(.22,1,.36,1)}
    .slide{min-width:100%;aspect-ratio:16/10;position:relative}
    .slide img{width:100%;height:100%;object-fit:cover}
    .slide-cap{position:absolute;left:0;right:0;bottom:0;padding:20px;background:linear-gradient(transparent,rgba(1,40,31,.9));color:#fff}
    .slide-cap b{font-size:17px}.slide-cap span{display:block;font-size:13px;opacity:.85;margin-top:2px}
    .dots{position:absolute;bottom:14px;right:16px;display:flex;gap:6px;z-index:3}
    .dot{width:8px;height:8px;border-radius:999px;background:rgba(255,255,255,.45);border:0;cursor:pointer;padding:0;transition:.3s}
    .dot.on{background:#fff;width:22px}
    .map{width:100%;height:280px;border:0;border-radius:16px;background:#eef3ee}
    .side{position:sticky;top:78px}
    .cta-card{background:linear-gradient(160deg,#fff,#f3faf6);border:1px solid var(--line);border-radius:22px;padding:24px;box-shadow:0 28px 66px -34px rgba(6,78,59,.34)}
    .cta-card h2{font-size:19px;font-weight:800;margin:0 0 4px}
    .field{display:block;margin-top:12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
    .input,.textarea{width:100%;border:1px solid var(--line);border-radius:13px;background:#fff;padding:11px 12px;margin-top:6px;font:inherit;outline:none;transition:.15s}
    .input:focus,.textarea:focus{border-color:var(--celeste);box-shadow:0 0 0 3px rgba(20,184,166,.18)}
    .textarea{min-height:100px;resize:vertical}
    .btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:13px;background:linear-gradient(135deg,#003b2f,#0f766e 45%,#14b8a6 100%);color:#fff;font-weight:750;padding:13px 16px;cursor:pointer;width:100%;margin-top:14px;font-size:15px}
    .btn:hover{filter:brightness(1.06)}
    .ok,.err{display:none;margin-top:12px;font-size:14px}.ok{color:#064e3b}.err{color:#b42318}
    @media(max-width:900px){.body{grid-template-columns:1fr}.side{position:static}.stats{grid-template-columns:repeat(2,1fr)}.head-card{padding:20px}.h1{font-size:25px}}
  </style>`;
}

export async function onRequestGet(context: any) {
  const slug = String(context.params.slug || "");
  const p = await context.env.DB.prepare("SELECT * FROM professionals WHERE slug = ? AND active_status = 1").bind(slug).first();
  if (!p) return context.next ? context.next() : new Response("No encontrado", { status: 404 });

  const [catRows, serviceRows, portfolioRows] = await Promise.all([
    context.env.DB.prepare("SELECT category_id FROM professional_categories WHERE professional_id = ?").bind(p.id).all(),
    context.env.DB.prepare("SELECT * FROM services WHERE professional_id = ? AND is_active = 1 ORDER BY title COLLATE NOCASE").bind(p.id).all(),
    context.env.DB.prepare("SELECT * FROM portfolio_items WHERE professional_id = ? AND moderation_status = 'approved' ORDER BY sort_order ASC, created_at DESC LIMIT 12").bind(p.id).all(),
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

  const logo = p.logo_image ? `<img src="${esc(p.logo_image)}" alt="">` : esc(initials(publicName));
  const serviceHtml = services.map((s: any) => `
    <a href="/profesionales/${esc(p.slug)}/${esc(s.slug)}">
      <h3>${esc(s.title)}</h3>
      <p class="muted" style="color:var(--muted);margin:.25rem 0 .5rem">${esc(s.description)}</p>
      <strong>${money(s.price_from)}</strong>
    </a>`).join("");
  const slidesHtml = portfolio.map((item: any) => `
    <div class="slide">
      <img src="${esc(item.image_url)}" alt="${esc(item.title)}" loading="lazy">
      <div class="slide-cap"><b>${esc(item.title)}</b>${item.location ? `<span>${esc(item.location)}</span>` : ""}</div>
    </div>`).join("");
  const dotsHtml = portfolio.map((_: any, i: number) => `<button class="dot${i === 0 ? " on" : ""}" data-i="${i}" aria-label="Foto ${i + 1}"></button>`).join("");
  const mapQuery = encodeURIComponent(area || "Active markets");

  const trustChips = [
    ...categories.map((c: string) => `<span class="chip">${esc(c)}</span>`),
    p.insurance_declared ? `<span class="chip">Seguro de R. C.</span>` : "",
    p.invoice_declared ? `<span class="chip">Trabaja con factura</span>` : "",
    p.docs_declared ? `<span class="chip">Documentación al día</span>` : "",
    p.offers_urgent ? `<span class="chip">Atiende urgencias</span>` : "",
  ].filter(Boolean).join("");

  const html = `<!doctype html><html lang="es"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${origin}/profesionales/${esc(p.slug)}">
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
    <meta property="og:type" content="profile"><meta property="og:url" content="${origin}/profesionales/${esc(p.slug)}">
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
    ${styles()}
  </head><body>
    <nav class="nav"><div class="wrap"><a class="brand" href="/">RegiKaha</a><a class="nav-cta" href="#contacto">Pedir presupuesto</a></div></nav>
    <div class="cover"><div class="cover-grid"></div></div>
    <main class="wrap">
      <header class="head-card">
        <div class="head-top">
          <div class="avatar" style="background:${esc(p.logo_color || "#0f766e")}">${logo}</div>
          <div style="flex:1;min-width:240px">
            <h1 class="h1">${esc(publicName)} <span class="verified">✓ Verificado</span></h1>
            <p class="tag">${esc(p.short_tagline || "")}</p>
            <div class="meta"><span>📍 ${esc(area || "mercados activos")}</span><span>⏱️ Responde en ${esc(p.response_time_hours || 24)} h</span>${p.service_area_note ? `<span>🗺️ ${esc(p.service_area_note)}</span>` : ""}</div>
            <div class="chips">${trustChips}</div>
          </div>
        </div>
        <div class="stats">
          <div class="stat"><strong>${esc(p.completed_projects || 0)}</strong><span>Proyectos</span></div>
          <div class="stat"><strong>${esc(p.years_experience || 0)}</strong><span>Años</span></div>
          <div class="stat"><strong>${money(p.price_from)}</strong><span>Desde</span></div>
          <div class="stat"><strong>${esc(p.average_rating || "0")}/5</strong><span>Valoración</span></div>
        </div>
      </header>
      <div class="body">
        <div>
          ${portfolio.length ? `<section class="section"><h2>Trabajos realizados</h2><div class="slider" id="slider"><div class="slides" id="slides">${slidesHtml}</div><div class="dots" id="dots">${dotsHtml}</div></div></section>` : ""}
          <section class="section"><h2>Sobre ${esc(publicName)}</h2><p>${esc(p.description || "")}</p></section>
          ${services.length ? `<section class="section"><h2>Servicios</h2><div class="svc">${serviceHtml}</div></section>` : ""}
          <section class="section"><h2>Zona de operación</h2><iframe class="map" src="https://www.google.com/maps?q=${mapQuery}&output=embed" loading="lazy"></iframe></section>
        </div>
        <aside class="side" id="contacto">
          <div class="cta-card">
            <h2>Pide pre-presupuesto gratis</h2>
            <p style="color:var(--muted);font-size:13px;margin:0">Estimación inicial sin compromiso.</p>
            <form id="quote">
              <input type="hidden" name="professionalId" value="${esc(p.id)}">
              <input type="hidden" name="categoryId" value="${esc(categories[0] || "")}">
              <label class="field">Nombre<input class="input" name="name" required></label>
              <label class="field">Email<input class="input" type="email" name="email" required></label>
              <label class="field">Teléfono<input class="input" name="phone"></label>
              <label class="field">Ciudad<input class="input" name="city" required></label>
              <label class="field">País<input class="input" name="country" value="${esc(p.country || "")}" required></label>
              <label class="field">Proyecto<textarea class="textarea" name="description" required></textarea></label>
              <div class="cf-turnstile" data-sitekey="0x4AAAAAADoWgsg2pjcNtzCF" data-action="request_quote" style="margin-top:12px"></div>
              <p style="color:var(--muted);font-size:12px;margin:10px 0 0">Los pre-presupuestos son estimaciones iniciales no vinculantes. El precio final puede variar tras visita técnica, mediciones, materiales, permisos o revisión del estado real.</p>
              <button class="btn" type="submit">Enviar solicitud</button>
              <p class="ok" id="ok">Solicitud enviada correctamente.</p><p class="err" id="err"></p>
            </form>
          </div>
        </aside>
      </div>
    </main>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <script>
      (function(){
        var slides=document.getElementById("slides");if(slides){var dots=[].slice.call(document.querySelectorAll("#dots .dot"));var n=slides.children.length;var i=0;function go(k){i=(k+n)%n;slides.style.transform="translateX(-"+(i*100)+"%)";dots.forEach(function(d,j){d.classList.toggle("on",j===i);});}
        dots.forEach(function(d){d.addEventListener("click",function(){go(parseInt(d.dataset.i,10));reset();});});
        var t;function reset(){clearInterval(t);if(n>1)t=setInterval(function(){go(i+1);},4000);}reset();}
      })();
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
