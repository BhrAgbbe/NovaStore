# NOVA Store

A public bilingual storefront and browser-persisted cart. It uses Next.js 16 App Router, React, strict TypeScript, next-intl, Axios, Styled Components, Zustand, Context, Formik, and Yup.

[Store Figma](https://www.figma.com/design/aBoAP7KFIxso9LMoxl1QQl/NOVA-%E2%80%94-Store-UI-Design?node-id=1-53) · [Frame and state map](docs/figma-handoff.md)

## Run locally

Use Node 24.18.0 and pnpm 10.14.0.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). Persian is the default locale. The English homepage is at `/en`. Set `SITE_URL` to the public origin when deploying so metadata and sitemap URLs use that origin. Set it before building.

## Architecture

| Location                                   | Responsibility                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `app/[locale]`, `app`                      | Thin locale routes, server rendering, localized metadata, global styles, robots and sitemap |
| `dictionary`, `i18n.ts`, `proxy.ts`        | Locale configuration, bilingual copy, route prefixing, and navigation                       |
| `components`, `shared`, `modals`, `assets` | Figma screen composition, reusable UI, cart confirmation, and local design assets           |
| `api`, `requests`, `types/enums`, `utils`  | Dedicated Axios instance, typed endpoints, catalog query rules, and formatting              |
| `storage`, `context`, `validations`        | Zustand cart persistence, hydration, server style registry, theme, and search validation    |

`src/proxy.ts` sits next to `src/app`, as Next.js requires when the App Router is inside `src`. This is the placement adjustment to the root-level diagram in the exam brief. Server-rendered catalog data comes from FakeStoreAPI. The client derives search results, category filters, sorting, and six-item pages from the URL. The two API clothing categories share the Figma Apparel chip. Theme initializes from a preference cookie. The cart persists non-sensitive item snapshots in local storage, and its amounts are calculated at two decimal places.

Live product data and images come from FakeStoreAPI. Test fixtures use the Figma content and images. The API does not expose a currency field, so the Figma toman label is a display convention for unchanged demo amounts. The cart is local to this browser and Admin’s session changes stay in its own app. Footer help and social labels without supplied destinations are presentational.

## Verify

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

Playwright starts a loopback-only HTTP fixture so server and client interactions are deterministic. On Windows it uses Microsoft Edge by default. Elsewhere run `pnpm exec playwright install chromium` before the tests.

## Screenshots

- [Persian desktop storefront](docs/screenshots/store-desktop.png)
- [Persian mobile storefront](docs/screenshots/store-mobile.png)

- [Dark Persian mobile cart](docs/screenshots/store-cart-mobile-dark.png)

## Implementation time

Approximately 23 minutes of combined implementation and verification time across both NOVA repositories.
