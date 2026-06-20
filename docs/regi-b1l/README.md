# Regi B1L

Regi B1L is the professional operations workspace integrated at `/regi-b1l`. It is built inside the existing Next.js application and does not replace the RegiKaha marketplace.

## Included

- Responsive desktop and mobile application shell.
- Leads, clients, jobs, photos, quotes, internal acceptance signatures and PDF export.
- Document register, Material Radar, supplier map, team, plans and company settings.
- Local-first, versioned browser persistence and JSON backup.
- Installable PWA shell and a Capacitor Android wrapper configuration.
- Closed UI dictionaries for `es`, `en`, `fr`, `de`, `it`, `pt`, `nl`, `ca`, `ar` and `zh`.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000/regi-b1l`.

## Data boundary

This release stores operational records in the browser under `regikaha:b1l:v1`. The UI says “saved” only for local persistence. It does not claim cloud synchronisation. Replace the store adapter with authenticated API calls before enabling cross-device collaboration or production financial records.
