import type { MetadataRoute } from "next";
import { siteUrl } from "@/utils/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/fa/cart", "/en/cart"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl()).href,
  };
}
