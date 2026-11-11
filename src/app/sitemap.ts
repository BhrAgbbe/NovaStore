import type { MetadataRoute } from "next";
import { getProducts } from "@/requests/catalogApi";
import { defaultLocale, locales, localPath, productPath, ROUTES, siteUrl } from "@/utils/routes";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const homeLanguages = Object.fromEntries(
    locales.map((locale) => [locale, new URL(localPath(locale, ROUTES.home), base).href])
  );
  const entries: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: homeLanguages[locale],
    alternates: { languages: homeLanguages },
    changeFrequency: "weekly",
    priority: 1,
  }));
  const products = await getProducts().catch(() => []);
  for (const product of products) {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, new URL("/" + locale + productPath(product.id), base).href])
    );
    entries.push({
      url: languages[defaultLocale],
      alternates: { languages },
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  return entries;
}
