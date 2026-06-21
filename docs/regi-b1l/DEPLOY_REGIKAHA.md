# Deploy to Regi Kaha

Regi Works is part of the existing static Next.js export. It must use the same conservative manual Cloudflare Pages deployment as the rest of Regi Kaha.

```bash
npm ci
npm run typecheck
npm run build
npx wrangler pages deploy out --project-name regikaha --branch main
```

Do not edit or trigger the GitHub Actions workflow. Verify `/regi-works`, its manifest and service worker on the generated `pages.dev` URL before checking the production domain.

Because localStorage belongs to the origin, data created on localhost or a preview subdomain will not appear on `regikaha.com`. Use the JSON export for manual backups, not as a hidden sync mechanism.
