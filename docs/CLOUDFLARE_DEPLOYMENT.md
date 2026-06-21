# Regi Kaha on Cloudflare

## Architecture

- Frontend: static Next.js export in Cloudflare Pages (`out/`).
- API: Pages Functions under `functions/`; static pages do not invoke a Worker.
- Database: D1 binding `DB`, database `regikaha-db`.
- Media: R2 binding `MEDIA`, EU-jurisdiction bucket `regikaha-media`.
- Bot protection: Turnstile widget `regikaha-production`, validated server-side.
- Configuration source: `wrangler.jsonc`.

Pages Functions run on the Workers runtime, so a separate proxy Worker is intentionally not used. This keeps static requests out of Worker execution while preserving the existing routing model.

## One-time setup

R2 is enabled and `regikaha-media` has been created in the EU jurisdiction. Store secrets with `wrangler pages secret put`, never in Git:

```powershell
npx wrangler pages secret put TURNSTILE_SECRET_KEY --project-name regikaha
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name regikaha
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name regikaha
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name regikaha
npx wrangler pages secret put RESEND_API_KEY --project-name regikaha
```

The Turnstile secret is already configured in the Pages project. The site key is public by design and is present in `lib/integrations.ts`.

Transactional email uses Resend from `Regi Kaha <no-reply@regikaha.com>` with replies routed to `help@regikaha.com`. Keep the API key only as a Pages secret and verify the `regikaha.com` sending domain in Resend before relying on production email delivery.

## Validate and deploy

```powershell
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
npm run cf:d1:migrate:regikaha
npm run cf:deploy:regikaha:pages
```

`npm run cf:deploy:regikaha` performs build, remote D1 migrations and a manual Pages deployment. It does not edit or trigger a GitHub workflow.

## Bindings and routes

- `DB`: all structured marketplace, account, billing and cost-quota data.
- `MEDIA`: optimized profile/project images and thumbnails only.
- `/api/*`: Pages Functions with global request-size, bot, CORS and rate guards.
- `/api/media/*`: immutable delivery of R2 objects.
- All exported HTML, JS, CSS, flags and geodata shards: Pages static assets.

## Backups

Create a local D1 export outside the repository:

```powershell
npx wrangler d1 export regikaha-db --remote --output "$env:TEMP\regikaha-d1-$(Get-Date -Format yyyyMMdd-HHmmss).sql"
```

List R2 objects from an S3-compatible client configured with scoped R2 credentials. Compare object keys with `portfolio_items.r2_key`, `portfolio_items.thumbnail_r2_key`, `professionals.logo_image` and `project_requests.files`. Delete orphans only after a retained backup and a dry-run report.

## Rollback

1. Open Workers & Pages > Regi Kaha > Deployments.
2. Select the last known-good production deployment and choose rollback.
3. D1 migrations are additive. Restore data only from a verified export; do not reverse schema by dropping tables or columns.

## Dashboard-only steps

- Set a monthly account budget notification and product notifications for Workers, D1 and R2.
- Keep Web Analytics lightweight; do not enable high-volume custom logging in survival mode.
