"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button, IconButton } from "@/shared/controls";
import Icon from "@/shared/Icon";
import ProductPhoto from "@/shared/ProductPhoto";
import { lineMinorTotal, useCart, type CartLine } from "@/storage/cart";
import { formatNumber, formatPrice, type Locale } from "@/utils/format";

const Row = styled.article`
  padding: 14px;
  display: grid;
  gap: 10px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  .product {
    display: flex;
    gap: 12px;
    align-items: center;
    min-width: 0;
  }
  .photo {
    width: 76px;
    height: 76px;
    border-radius: 9px;
    flex: none;
  }
  h3 {
    font-size: 16px;
    overflow-wrap: anywhere;
  }
  p {
    color: var(--muted);
    font-size: 13px;
    margin-block-start: 4px;
  }
  .actions {
    padding-block-start: 10px;
    border-block-start: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 7px;
  }
  .actions strong {
    font-size: 14px;
  }
  .stepper {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    border-radius: 10px;
    background: var(--soft);
    direction: ltr;
  }
  .stepper button {
    width: 42px;
    padding: 0;
  }
  .stepper output {
    font-size: 15px;
    text-align: center;
    min-width: 25px;
    padding: 0 2px;
    font-weight: 700;
  }
  @media (min-width: 768px) {
    .photo {
      width: 94px;
      height: 94px;
    }
    .actions strong {
      font-size: 18px;
    }
  }
`;

export default function CartLineItem({
  line,
  locale,
  onRemove,
}: {
  readonly line: CartLine;
  readonly locale: Locale;
  readonly onRemove: (line: CartLine) => void;
}) {
  const t = useTranslations("Store");
  const increase = useCart((cart) => cart.increase);
  const decrease = useCart((cart) => cart.decrease);
  return (
    <Row>
      <div className="product">
        <ProductPhoto className="photo" src={line.product.image} />
        <div>
          <h3 dir="auto">{line.product.title}</h3>
          <p>
            {t("unitPrice")} {formatPrice(line.product.price, locale)}
          </p>
        </div>
      </div>
      <div className="actions">
        <div className="stepper">
          <Button
            $kind="secondary"
            type="button"
            aria-label={t("decrease")}
            disabled={line.quantity <= 1}
            onClick={() => decrease(line.product.id)}
          >
            <Icon name="minus" size={17} />
          </Button>
          <output aria-label={t("quantity")}>{formatNumber(line.quantity, locale)}</output>
          <Button
            $kind="secondary"
            type="button"
            aria-label={t("increase")}
            onClick={() => increase(line.product.id)}
          >
            <Icon name="plus" size={17} />
          </Button>
        </div>
        <strong>{formatPrice(lineMinorTotal(line) / 100, locale)}</strong>
        <IconButton
          type="button"
          aria-label={t("remove")}
          aria-haspopup="dialog"
          onClick={() => onRemove(line)}
        >
          <Icon name="trash" size={19} />
        </IconButton>
      </div>
    </Row>
  );
}
