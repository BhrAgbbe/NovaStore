import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/requests/catalogApi";
import ProductPageContent from "@/components/catalog/ProductPageContent";
import { isLocale, productPath, siteUrl } from "@/utils/routes";

interface Props {
  readonly params: Promise<{ locale: string; productId: string }>;
}

async function resolveProduct(params: Props["params"]) {
  const { locale, productId } = await params;
  const id = Number(productId);
  if (!isLocale(locale) || !Number.isSafeInteger(id) || id < 1) notFound();
  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();
  return { locale, product };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, product } = await resolveProduct(params);
  const path = "/" + locale + productPath(product.id);
  return {
    metadataBase: siteUrl(),
    title: product.title + " | NOVA",
    description: product.description.slice(0, 160),
    alternates: {
      canonical: path,
      languages: { fa: "/fa" + productPath(product.id), en: "/en" + productPath(product.id) },
    },
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      siteName: "NOVA",
      url: path,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { product } = await resolveProduct(params);
  return <ProductPageContent product={product} />;
}
