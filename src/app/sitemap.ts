import type { MetadataRoute } from "next";
import { locales, localPath, ROUTES, siteUrl } from "@/utils/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, new URL(localPath(locale, ROUTES.home), base).href])
  );
  return locales.map((locale) => ({ url: languages[locale], alternates: { languages } }));
}
