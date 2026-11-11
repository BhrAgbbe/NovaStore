# NOVA Store

A public bilingual storefront and browser-persisted cart. It uses Next.js 16 App Router, React, strict TypeScript, next-intl, TanStack Query, Axios, Styled Components, Zustand, Context, Formik, and Yup.

[Store Figma](https://www.figma.com/design/aBoAP7KFIxso9LMoxl1QQl/NOVA-%E2%80%94-Store-UI-Design?node-id=1-53) · [Frame and state map](docs/figma-handoff.md)

## Run locally

Use Node 24.18.0 and pnpm 10.14.0.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Persian is the default locale. The English homepage is at `/en`. Set `SITE_URL` to the public origin when deploying so metadata and sitemap URLs use that origin. Set it before building. Optional `NEXT_PUBLIC_NOVA_*_URL` entries in `.env.example` enable links for the corresponding footer icons.

## Architecture

| Location                                   | Responsibility                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `app/[locale]`, `app`                      | Thin locale routes, server rendering, localized metadata, global styles, robots and sitemap |
| `dictionary`, `i18n.ts`, `proxy.ts`        | Locale configuration, bilingual copy, route prefixing, and navigation                       |
| `components`, `shared`, `modals`, `assets` | Figma screen composition, reusable UI, cart confirmation, and local design assets           |
| `api`, `requests`, `types/enums`, `utils`  | Dedicated Axios instance, typed endpoints, catalog query rules, and formatting              |
| `storage`, `context`, `validations`        | Zustand cart persistence, hydration, server style registry, theme, and search validation    |

The locale and route folders follow the PDF. `src/proxy.ts` sits next to `src/app` as required when using the App Router under `src`. The additional `app/api/catalog` route handles browser retries via a same-origin Axios instance. `FAKE_STORE_API_URL` configures the upstream server-side origin. It calls the same Axios services as the server-rendered catalog and returns `Cache-Control: no-store`. Initial catalog data seeds `useQuery` without a browser request on hydration. Initial errors stay visible until the user explicitly retries.

Search matches titles and category labels, combines with the selected category, and applies sorting before six-item pagination. FakeStoreAPI supports an individual category endpoint and a result limit, but it does not support page indexes, localized or grouped category search, or sorting by title and price. The server seeds the initial catalog. Selecting a category reads the documented category endpoint. Apparel combines the two clothing endpoints. Text search, price/title sorting, and paging apply to the API results. Filters, sorting and page state live in the URL. Both clothing categories map to the Apparel chip. The header and mobile navigation use pages 3 and 4 of the PDF for layout. The carousel uses the NOVA hero photo and actual product photos from available categories. It advances every five seconds, pauses on hover or keyboard focus, respects reduced motion, and supports pause, indicators, and swipe gestures. The PDF-inspired contact banner opens an email subscription request when NEXT_PUBLIC_NOVA_CONTACT_EMAIL is configured. It remains disabled until a contact address is supplied. The API does not offer a mailing-list endpoint. Social icons without configured URLs are decorative. The locale layout supplies the current UTC year for the copyright line.

Theme initializes from a preference cookie. The Zustand cart persists item snapshots and quantities in local storage and calculates totals at two decimal places. Removal and clearing require confirmation. Live data and images come from FakeStoreAPI. The toman label is a display convention for the original numeric API amounts. Admin’s session changes stay in its own app.

## Verify

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

Playwright starts a loopback-only HTTP fixture and a separate Next development server on port 3102. The test server writes build artifacts under `.next-playwright`. On Windows it uses Microsoft Edge by default. Elsewhere run `pnpm exec playwright install chromium` before the tests.

## Screenshots

- [Persian desktop storefront](docs/screenshots/store-desktop.png)
- [Persian mobile storefront](docs/screenshots/store-mobile.png)

- [Dark Persian mobile cart](docs/screenshots/store-cart-mobile-dark.png)

## Implementation time

Approximately 23 minutes of combined implementation and verification time across both NOVA repositories.
