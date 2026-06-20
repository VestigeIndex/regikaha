# RegiKaha Survival Mode

Survival mode keeps infrastructure spend behind customer value. It is active by default through both code defaults and `wrangler.jsonc`.

## Free and national-plan limits

| Resource | Limit |
| --- | ---: |
| New client projects | 3/month |
| Photos per project | 4 |
| Professional profile images including logo | 6 |
| Profile updates | 10/day |
| Public searches | 60/IP/hour |
| API requests | 30/IP/minute |
| Lead searches | 30/user/day |
| Verification emails | 3/user/day |
| Emails from one IP | 10/day |

## Europa Pro limits

Europa Pro may store up to 30 profile images, each capped at 500 KB after optimization. API and anti-abuse limits remain active. Paying for a plan does not create unlimited infrastructure access.

## Shared upload rules

Only JPG, PNG and WebP can be selected. The browser converts accepted images to optimized WebP, generates a thumbnail and uploads only those derivatives. Video and document uploads are disabled. R2 is the only permitted binary store.

## Lead rules

Leads are never auto-unlocked in survival mode. A professional must have an active subscription, sufficient balance and an available contact slot. The default number of contact unlocks without balance is zero.

## Feature flags

The following stay `false`: `ENABLE_HEAVY_FEATURES`, `ENABLE_AI_FEATURES`, `ENABLE_VIDEO_UPLOADS`, `ENABLE_DOCUMENT_UPLOADS`, `ENABLE_BACKGROUND_JOBS`, `ENABLE_EMAIL_DIGESTS`, `ENABLE_PUBLIC_EXPORTS`, and `AUTO_UNLOCK_LEADS`.

Changes to these flags require a cost review, product limits, a rollback plan and a budget notification.
