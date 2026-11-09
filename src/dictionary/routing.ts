import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@/utils/routes";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
});
