import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import StoreHeader from "@/components/layout/StoreHeader";
import StoreFooter from "@/components/layout/StoreFooter";
import CartHydration from "@/context/CartHydration";
import StoreProviders from "@/context/StoreProviders";
import StyledRegistry from "@/context/StyledRegistry";
import { ThemeProvider } from "@/context/theme";
import { isLocale, locales, localPath, ROUTES, siteUrl } from "@/utils/routes";
import { THEME_COOKIE } from "@/utils/theme";
import "../globals.css";

interface Props {
  readonly params: Promise<{ locale: string }>;
  readonly children: ReactNode;
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Store" });
  const title = t("brandTitle");
  const description = t("brandDescription");
  const path = localPath(locale, ROUTES.home);
  return {
    metadataBase: siteUrl(),
    title,
    description,
    alternates: { canonical: path, languages: { fa: "/fa", en: "/en", "x-default": "/fa" } },
    openGraph: {
      title,
      description,
      url: path,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const theme = (await cookies()).get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      data-theme={theme}
      data-scroll-behavior="smooth"
    >
      <body>
        <StyledRegistry>
          <NextIntlClientProvider>
            <ThemeProvider initialMode={theme}>
              <StoreProviders>
                <CartHydration>
                  <Suspense>
                    <StoreHeader />
                  </Suspense>
                  {children}
                  <StoreFooter year={new Date().getUTCFullYear()} />
                </CartHydration>
              </StoreProviders>
            </ThemeProvider>
          </NextIntlClientProvider>
        </StyledRegistry>
      </body>
    </html>
  );
}
