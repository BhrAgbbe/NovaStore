import type { Locale } from "./format";

export const locales = ["fa", "en"] as const;
export const defaultLocale: Locale = "fa";
export const ROUTES = { home: "/", cart: "/cart", products: "/products" } as const;

export function productPath(id: number) {
  return ROUTES.products + "/" + id;
}

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localPath(locale: Locale, route: (typeof ROUTES)[keyof typeof ROUTES]) {
  return "/" + locale + (route === ROUTES.home ? "" : route);
}

export function siteUrl() {
  return new URL(process.env.SITE_URL || "http://localhost:3000");
}
