"use client";

import CategoryBadge from "@/shared/CategoryBadge";
import { Link } from "@/dictionary/navigation";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/shared/controls";
import Icon from "@/shared/Icon";
import ProductPhoto from "@/shared/ProductPhoto";
import { Category } from "@/types/enums/catalog";
import type { Product } from "@/types/product";
import { groupCategory } from "@/utils/catalog";
import { formatNumber, formatPrice, type Locale } from "@/utils/format";
import { productPath } from "@/utils/routes";

const Card = styled.article`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    img {
      transition: transform 0.24s ease;
    }
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px #101e3b22;
    }
    &:hover img {
      transform: scale(1.025);
    }
  }
  .image-wrap {
    position: relative;
  }
  .product-link { display: block; color: inherit; }
  .product-link:focus-visible { outline: 2px solid var(--focus); outline-offset: -2px; }
  .photo {
    aspect-ratio: 4 / 3;
  }
  .body {
    padding: 14px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    flex: 1;
  }
  .pill {
    align-self: flex-start;
    [dir="rtl"] & {
      align-self: flex-end;
    }
  }
  h3 {
    font-size: 14px;
    overflow-wrap: anywhere;
  }
  .rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 700;
    color: var(--brand-ink);
  }
  .price {
    font-size: 15px;
    margin-block-start: auto;
  }
  .body button {
    width: 100%;
  }
  .body button .nova-icon {
    display: none;
  }
  @media (min-width: 768px) {
    h3 {
      font-size: 17px;
    }
    .price {
      font-size: 20px;
    }
    .body button .nova-icon {
      display: inline-block;
    }
  }
`;

export default function ProductCard({
  product,
  locale,
  disabled,
  onAdd,
}: {
  readonly product: Product;
  readonly locale: Locale;
  readonly disabled: boolean;
  readonly onAdd: (item: Product) => void;
}) {
  const t = useTranslations("Store");
  const group = groupCategory(product.category);
  return (
      <Card>
        <Link className="product-link image-wrap" href={productPath(product.id)} aria-label={t("productDetails", { name: product.title })}>
          <ProductPhoto className="photo" src={product.image} />
        </Link>
        <div className="body">
          <CategoryBadge
            className="pill"
            category={group}
            label={group === Category.All ? product.category : t(group)}
          />
          <h3 dir="auto"><Link href={productPath(product.id)}>{product.title}</Link></h3>
          {product.rating && (
            <div className="rating" aria-label={t("rating", product.rating)}>
              <Icon name="star" size={18} />
              {formatNumber(product.rating.rate, locale)} (
              {formatNumber(product.rating.count, locale)})
            </div>
          )}
          <strong className="price">{formatPrice(product.price, locale)}</strong>
          <Button type="button" disabled={disabled} onClick={() => onAdd(product)}>
            <Icon name="bag" size={17} />
            {t("add")}
          </Button>
        </div>
      </Card>
  );
}
