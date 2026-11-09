"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/shared/controls";
import Icon from "@/shared/Icon";
import ProductPhoto from "@/shared/ProductPhoto";
import { Category } from "@/types/enums/catalog";
import type { Product } from "@/types/product";
import { groupCategory } from "@/utils/catalog";
import { formatNumber, formatPrice, type Locale } from "@/utils/format";

const Card = styled.article`
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  .photo {
    min-height: 110px;
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
    padding: 3px 12px;
    border: 1px solid var(--line);
    color: var(--muted);
    font-size: 13px;
    line-height: 18px;
    border-radius: 18px;
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
  button {
    width: 100%;
  }
  button .nova-icon {
    display: none;
  }
  @media (min-width: 768px) {
    .photo {
      min-height: 160px;
    }
    h3 {
      font-size: 17px;
    }
    .price {
      font-size: 20px;
    }
    button .nova-icon {
      display: inline-block;
    }
  }
  @media (min-width: 1024px) {
    .photo {
      min-height: 224px;
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
      <ProductPhoto className="photo" src={product.image} />
      <div className="body">
        <span className="pill">{group === Category.All ? product.category : t(group)}</span>
        <h3 dir="auto">{product.title}</h3>
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
