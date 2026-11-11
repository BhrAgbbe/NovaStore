"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Skeleton } from "@/shared/Skeleton";
import styled from "styled-components";
import CartConfirmation from "@/modals/CartConfirmation";
import { useToast } from "@/shared/Toast";
import { Button, ButtonLink, EmptyState } from "@/shared/controls";
import Icon from "@/shared/Icon";
import { cartTotal, countUnits, useCart, type CartLine } from "@/storage/cart";
import { formatNumber, formatPrice } from "@/utils/format";
import { defaultLocale, isLocale } from "@/utils/routes";
import CartLineItem from "./CartLineItem";

const Content = styled.main`
  max-width: 1440px;
  margin-inline: auto;
  width: 100%;
  padding: 22px var(--gutter);
  display: grid;
  gap: 20px;
  h1 {
    font-size: 31px;
  }
  .columns {
    display: grid;
    gap: 24px;
    align-items: start;
  }
  .items {
    display: grid;
    gap: 10px;
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }
  .summary {
    display: grid;
    gap: 16px;
    padding: 18px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--surface);
  }
  .summary h2 {
    font-size: 21px;
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  .summary-row:first-of-type span {
    color: var(--muted);
  }
  .total {
    border-block-start: 1px solid var(--line);
    padding-block-start: 16px;
  }
  .total strong {
    font-size: 19px;
  }
  @media (min-width: 768px) {
    padding-block: 38px;
    h1 {
      font-size: 42px;
    }
  }
  @media (min-width: 1024px) {
    .columns {
      grid-template-columns: minmax(0, 1fr) 342px;
    }
  }
`;

export default function CartScreen() {
  const t = useTranslations("Store");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const lines = useCart((cart) => cart.lines);
  const hydrated = useCart((cart) => cart.hydrated);
  const remove = useCart((cart) => cart.remove);
  const clear = useCart((cart) => cart.clear);
  const [confirm, setConfirm] = useState<"clear" | CartLine | null>(null);
  const toast = useToast();
  const heading = useRef<HTMLHeadingElement>(null);
  const units = countUnits(lines);

  function confirmAction() {
    if (!confirm) return;
    if (confirm === "clear") {
      clear();
      toast(t("cartCleared"), "success");
    } else {
      remove(confirm.product.id);
      toast(t("removed", { name: confirm.product.title }), "success");
    }
    setConfirm(null);
    requestAnimationFrame(() => heading.current?.focus());
  }

  return (
    <Content>
      <h1 ref={heading} tabIndex={-1}>
        {t("cart")}
      </h1>
      {!hydrated ? (
        <Skeleton role="status" aria-label={t("loadingCart")} style={{ height: 170 }} />
      ) : lines.length ? (
        <>
          <div className="columns">
            <section className="items" aria-label={t("cart")}>
              <div className="toolbar">
                <Button
                  type="button"
                  $kind="danger"
                  aria-haspopup="dialog"
                  onClick={() => setConfirm("clear")}
                >
                  <Icon name="trash" size={17} />
                  {t("clearCart")}
                </Button>
              </div>
              {lines.map((line) => (
                <CartLineItem
                  key={line.product.id}
                  line={line}
                  locale={locale}
                  onRemove={setConfirm}
                />
              ))}
            </section>
            <aside className="summary">
              <h2>{t("summary")}</h2>
              <div className="summary-row">
                <span>{t("itemsLabel")}</span>
                <strong>{formatNumber(units, locale)}</strong>
              </div>
              <div className="summary-row total">
                <strong>{t("total")}</strong>
                <strong>{formatPrice(cartTotal(lines), locale)}</strong>
              </div>
              <ButtonLink href="/#catalog">
                <Icon name="arrow" size={17} directional />
                {t("continue")}
              </ButtonLink>
            </aside>
          </div>
          {confirm && (
            <CartConfirmation
              itemName={confirm === "clear" ? undefined : confirm.product.title}
              onCancel={() => setConfirm(null)}
              onConfirm={confirmAction}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon="bag"
          title={t("emptyCart")}
          detail={t("emptyCartHelp")}
          action={t("explore")}
          href="/#catalog"
        />
      )}
    </Content>
  );
}
