import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "@/utils/routes";

export default getRequestConfig(async ({ requestLocale }) => {
  const candidate = await requestLocale;
  const locale = candidate && isLocale(candidate) ? candidate : defaultLocale;
  const messages =
    locale === "fa"
      ? (await import("./dictionary/fa.json")).default
      : (await import("./dictionary/en.json")).default;
  return { locale, messages };
});
