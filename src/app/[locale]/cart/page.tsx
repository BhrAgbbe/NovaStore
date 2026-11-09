import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CartScreen from "@/components/cart/CartScreen";
import { isLocale, localPath, ROUTES } from "@/utils/routes";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Store" });
  return {
    title: t("cart") + " | NOVA",
    description: t("cartDescription"),
    robots: { index: false, follow: true },
    alternates: {
      canonical: localPath(locale, ROUTES.cart),
      languages: { fa: "/fa/cart", en: "/en/cart" },
    },
    openGraph: null,
  };
}

export default function CartPage() {
  return <CartScreen />;
}
