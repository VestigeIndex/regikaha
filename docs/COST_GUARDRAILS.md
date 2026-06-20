# Cost Guardrails

## What consumes resources

- Workers: only Pages Functions requests such as API, dynamic public professional pages and R2 media delivery.
- D1 reads: login/session checks, search, matching, dashboards and marketplace data.
- D1 writes: registrations, projects, leads, contracts, profile updates and bounded quota counters.
- R2: optimized WebP images and thumbnails after R2 is enabled.
- Pages static delivery: exported pages, JS/CSS, flags and geodata; this does not execute application Functions.

## Controls in code

- `COST_MODE=survival` is the default even when an environment variable is missing.
- Global API cap: 30 requests/IP/minute per route and 60/user/minute where applied.
- Public search: 60/IP/hour and ten-minute Cache API responses.
- Lead search: 30/user/day.
- Free client projects: 3/account/month.
- Professional profile updates: 10/user/day.
- Email: 3/user/day and 10/IP/day.
- Contact unlock without balance: zero.
- Auto-unlock: disabled.
- JSON/body size: 96 KB normally; media requests have a bounded multipart ceiling.
- Suspicious scanner user agents and cross-origin writes are rejected.
- Turnstile protects registration, project publication, B2B publication, quote and contact routes.

Fast minute/hour limits use Worker-local counters because Pages does not support the Workers Rate Limiting binding. Daily/monthly commercial quotas use a small D1 counter table. This avoids one D1 write for every ordinary API request.

## Media budget

- Original selected image: maximum 2 MB.
- Browser output: WebP, maximum width 1600 px.
- Free/national final image: maximum 350 KB.
- Europa Pro final image: maximum 500 KB.
- Thumbnail: maximum width 400 px and 120 KB.
- Client project: maximum 4 photos.
- Free/national professional profile: 6 images total, including logo.
- Europa Pro profile: 30 images total, including logo.
- Originals are never persisted. Missing R2 returns 503; no base64 fallback is allowed.

## Storage thresholds

- R2 soft/hard operational thresholds: 8/10 GB.
- D1 soft/hard operational thresholds: 400/480 MB.
- Thresholds are operating guardrails, not automatic Cloudflare billing caps.
- Review Workers, D1 and R2 usage weekly while the project is pre-revenue, then daily during acquisition campaigns.

## Disabled in survival mode

Video, document uploads, heavy AI, background jobs, email digests, public exports, unlimited chat, large analytics ingestion and automatic lead unlocks are disabled.

Enable a heavy feature only when its unit economics are known, the paying plan covers peak usage, a hard product limit exists, and an alert is configured.

## Budget alerts

In Cloudflare Dashboard, open Billing > Notifications and create the lowest useful monthly spend notification for the account. Also enable product-usage notifications for Workers, D1 and R2. Cloudflare notifications are alerts, not guaranteed hard stops; application limits remain the primary control.

## When to move storage

Stay on D1 while relational data fits the documented limits and query latency is healthy. Consider Postgres only when measured concurrency, transactional needs, reporting load or storage growth exceed D1's operational fit. A VPS is not justified merely because Workers Paid is active.

## Other account websites

- `regitramites.com`: unchanged; review separately before adding dynamic bindings.
- `vestigeindex.com`: unchanged and expected to remain static; no RegiKaha binding is added.
- `utxosuite.com`: unchanged and expected to remain static.
- `idovio.com`: unchanged and expected to remain static until a narrowly scoped licensing/payment API is needed.

This repository contains only RegiKaha, so no configuration for the other projects is modified.
