"use client";

import { useLocale, useTranslations } from "next-intl";
import styled from "styled-components";
import { Link } from "@/dictionary/navigation";
import { Button } from "@/shared/controls";
import CategoryBadge from "@/shared/CategoryBadge";
import Icon from "@/shared/Icon";
import ProductPhoto from "@/shared/ProductPhoto";
import { useToast } from "@/shared/Toast";
import { useCart } from "@/storage/cart";
import { Category } from "@/types/enums/catalog";
import type { Product } from "@/types/product";
import { groupCategory } from "@/utils/catalog";
import { formatPrice } from "@/utils/format";
import { defaultLocale, isLocale, ROUTES } from "@/utils/routes";

const Layout = styled.main`
  width: min(100%, 1240px);
  margin-inline: auto;
  padding: clamp(20px, 4vw, 56px) var(--gutter);
  display: grid;
  gap: 24px;
  align-content: start;
  .back { color: var(--brand-ink); font-weight: 700; }
  .product { display: grid; gap: 24px; }
  .photo { min-height: 320px; aspect-ratio: 4 / 3; border: 1px solid var(--line); border-radius: 18px; }
  .info { display: grid; align-content: start; justify-items: start; gap: 20px; }
  h1 { font-size: clamp(25px, 3vw, 40px); line-height: 1.35; }
  .price { font-size: clamp(22px, 2vw, 30px); color: var(--brand-ink); }
  .description { line-height: 1.9; color: var(--muted); overflow-wrap: anywhere; }
  @media (min-width: 768px) { .product { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`;

export default function ProductPageContent({ product }: { readonly product: Product }) {
  const t = useTranslations("Store");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const add = useCart((cart) => cart.add);
  const hydrated = useCart((cart) => cart.hydrated);
  const toast = useToast();
  const category = groupCategory(product.category);
  return (
    <Layout>
      <Link className="back" href={ROUTES.home + "#catalog"}>{t("goHome")}</Link>
      <div className="product">
        <ProductPhoto className="photo" src={product.image} alt={product.title} />
        <div className="info">
          <CategoryBadge category={category} label={category === Category.All ? product.category : t(category)} />
          <h1 dir="auto">{product.title}</h1>
          <strong className="price">{formatPrice(product.price, locale)}</strong>
          <p className="description" dir="auto">{product.description}</p>
          <Button type="button" disabled={!hydrated} onClick={() => { add(product); toast(t("added", { name: product.title }), "success"); }}>
            <Icon name="bag" size={18} />{t("add")}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
