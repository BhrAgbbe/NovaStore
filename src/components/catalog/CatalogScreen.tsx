"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import styled from "styled-components";
import { Banner, Button, EmptyState, IconButton } from "@/shared/controls";
import Icon, { type IconName } from "@/shared/Icon";
import { useCart } from "@/storage/cart";
import { Category, Sort } from "@/types/enums/catalog";
import type { Product } from "@/types/product";
import {
  groupCategory,
  readCatalogQuery,
  selectCatalog,
  writeCatalogQuery,
  type CatalogQuery,
} from "@/utils/catalog";
import { formatNumber } from "@/utils/format";
import { defaultLocale, isLocale, localPath, ROUTES } from "@/utils/routes";
import CatalogHero from "./CatalogHero";
import ProductCard from "./ProductCard";

export type CatalogState =
  | { readonly status: "loading" | "error" }
  | {
      readonly status: "success";
      readonly products: readonly Product[];
      readonly categories: readonly string[];
    };

const CATEGORIES: { readonly key: Category; readonly icon: IconName }[] = [
  { key: Category.All, icon: "grid" },
  { key: Category.Electronics, icon: "laptop" },
  { key: Category.Apparel, icon: "shirt" },
  { key: Category.Jewelry, icon: "gem" },
];

const Content = styled.main`
  max-width: 1440px;
  margin: auto;
  padding: 16px var(--gutter);
  display: grid;
  gap: 20px;
  @media (min-width: 768px) {
    padding-block: 28px;
    gap: 26px;
  }
`;
const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  justify-items: start;
  gap: 8px;
  button {
    display: flex;
    gap: 6px;
    align-items: center;
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 22px;
    color: var(--muted);
    background: var(--surface);
    font-size: 13px;
  }
  button[aria-pressed="true"] {
    color: var(--brand-ink);
    background: var(--tint);
    border-color: var(--brand);
    font-weight: 700;
  }
  @media (min-width: 768px) {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    button {
      min-height: 40px;
    }
  }
`;
const Results = styled.section`
  display: grid;
  gap: 20px;
  .heading {
    display: grid;
    gap: 20px;
    justify-items: start;
  }
  .heading small {
    color: var(--brand-ink);
    font:
      700 12px Inter,
      sans-serif;
  }
  .heading h1,
  .heading h2 {
    font-size: 26px;
    margin-block: 4px;
  }
  .heading p {
    color: var(--muted);
    font-size: 13px;
  }
  .sort-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 12px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 10px;
  }
  .sort-options button {
    border-radius: 18px;
    min-height: 36px;
    padding-inline: 12px;
    font-size: 13px;
  }
  .sort-options button[aria-pressed="true"] {
    color: var(--brand-ink);
    background: var(--tint);
    border-color: var(--brand);
  }
  @media (min-width: 768px) {
    gap: 26px;
    .heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .heading h1,
    .heading h2 {
      font-size: 32px;
    }
  }
`;
const Grid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (min-width: 768px) {
    gap: 16px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;
const Skeleton = styled.div`
  min-height: 300px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  padding: 12px;
  div {
    background: var(--soft);
    height: 14px;
    width: 59%;
    border-radius: 5px;
    margin-block-end: 12px;
  }
  div:first-child {
    width: 100%;
    height: 110px;
  }
  div:last-child {
    width: 100%;
    height: 44px;
  }
  @media (min-width: 768px) {
    min-height: 350px;
    div:first-child {
      height: 160px;
    }
  }
  @media (min-width: 1024px) {
    min-height: 420px;
    div:first-child {
      height: 224px;
    }
  }
`;
const Pages = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  button {
    width: 44px;
    padding: 0;
  }
  [dir="ltr"] & .previous .nova-icon,
  [dir="rtl"] & .next .nova-icon {
    transform: scaleX(-1);
  }
`;
const Value = styled.div`
  background: var(--tint);
  color: var(--brand-ink);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  @media (min-width: 768px) {
    font-size: 15px;
  }
`;

export default function CatalogScreen({ state }: { readonly state: CatalogState }) {
  const t = useTranslations("Store");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const query = readCatalogQuery(useSearchParams());
  const router = useRouter();
  const [sortOpen, setSortOpen] = useState(false);
  const sortTrigger = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState("");
  const [retrying, startRetry] = useTransition();
  const add = useCart((cart) => cart.add);
  const hydrated = useCart((cart) => cart.hydrated);
  const products = state.status === "success" ? state.products : [];
  const available =
    state.status === "success" ? new Set(state.categories.map(groupCategory)) : null;
  const { items, page, pages } = selectCatalog(products, query, locale);
  const isLoading = state.status === "loading" || retrying;
  const isError = state.status === "error" && !retrying;
  const home =
    !query.q &&
    query.category === Category.All &&
    query.sort === Sort.Featured &&
    query.page === 1 &&
    !added &&
    !sortOpen;
  const labels = {
    [Sort.Featured]: t("featured"),
    [Sort.PriceAscending]: t("priceAsc"),
    [Sort.PriceDescending]: t("priceDesc"),
    [Sort.TitleAscending]: t("titleAsc"),
  };
  const heading = query.q
    ? t("searchResults")
    : query.category === Category.All
      ? t("featuredProducts")
      : t(query.category);
  const Title = home ? "h2" : "h1";

  function update(next: Partial<CatalogQuery>) {
    const suffix = writeCatalogQuery({ ...query, page: 1, ...next });
    window.history.pushState(null, "", localPath(locale, ROUTES.home) + suffix + "#catalog");
    setSortOpen(false);
    setAdded("");
  }

  return (
    <Content>
      {home && <CatalogHero />}
      {added && <Banner title={t("added", { name: added })} detail={t("addedDetail")} />}
      <Filters id="categories" aria-label={t("categories")}>
        {CATEGORIES.filter(
          ({ key }) => !available || key === Category.All || available.has(key)
        ).map(({ key, icon }) => (
          <button
            key={key}
            type="button"
            aria-pressed={query.category === key}
            onClick={() => update({ category: key })}
          >
            <Icon name={icon} size={15} />
            {t(key)}
          </button>
        ))}
      </Filters>
      <Results
        id="catalog"
        aria-busy={isLoading}
        onKeyDown={(event) => {
          if (event.key === "Escape" && sortOpen) {
            setSortOpen(false);
            sortTrigger.current?.focus();
          }
        }}
      >
        <div className="heading">
          <div>
            <small dir="ltr">01 / THE NOVA COLLECTION</small>
            <Title>{heading}</Title>
            <p role="status">
              {isLoading ? t("loading") : t("count", { count: formatNumber(items.length, locale) })}
            </p>
          </div>
          <Button
            ref={sortTrigger}
            $kind="secondary"
            type="button"
            aria-expanded={sortOpen}
            aria-controls="catalog-sort"
            onClick={() => setSortOpen(!sortOpen)}
          >
            <Icon name="down" size={17} />
            {t("sort")}: {labels[query.sort]}
          </Button>
        </div>
        {sortOpen && (
          <div className="sort-options" id="catalog-sort" role="group" aria-label={t("sort")}>
            {Object.values(Sort).map((sort) => (
              <Button
                key={sort}
                type="button"
                $kind="secondary"
                aria-pressed={query.sort === sort}
                onClick={() => {
                  update({ sort });
                  sortTrigger.current?.focus();
                }}
              >
                {labels[sort]}
              </Button>
            ))}
          </div>
        )}
        {isError ? (
          <>
            <Banner variant="error" title={t("error")} detail={t("errorHelp")} />
            <EmptyState
              icon="refresh"
              title={t("retryHeading")}
              detail={t("retryHelp")}
              action={t("retry")}
              onAction={() => startRetry(() => router.refresh())}
            />
          </>
        ) : isLoading ? (
          <Grid aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index}>
                <div />
                <div />
                <div />
                <div />
              </Skeleton>
            ))}
          </Grid>
        ) : items.length ? (
          <>
            <Grid>
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  disabled={!hydrated}
                  onAdd={(item) => {
                    add(item);
                    setAdded(item.title);
                  }}
                />
              ))}
            </Grid>
            {pages > 1 && (
              <Pages aria-label={t("pagination")}>
                <IconButton
                  className="previous"
                  type="button"
                  disabled={page === 1}
                  aria-label={t("previous")}
                  onClick={() => update({ page: page - 1 })}
                >
                  <Icon name="chevron" size={17} />
                </IconButton>
                {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
                  <Button
                    key={number}
                    type="button"
                    $kind={page === number ? "primary" : "secondary"}
                    aria-current={page === number ? "page" : undefined}
                    aria-label={t("page", { page: formatNumber(number, locale) })}
                    onClick={() => update({ page: number })}
                  >
                    {formatNumber(number, locale)}
                  </Button>
                ))}
                <IconButton
                  className="next"
                  type="button"
                  disabled={page === pages}
                  aria-label={t("next")}
                  onClick={() => update({ page: page + 1 })}
                >
                  <Icon name="chevron" size={17} />
                </IconButton>
              </Pages>
            )}
          </>
        ) : products.length ? (
          <EmptyState
            icon="search"
            title={t("noResults")}
            detail={t("noResultsHelp")}
            action={t("clearSearch")}
            onAction={() => update({ q: "", category: Category.All })}
          />
        ) : (
          <EmptyState
            icon="box"
            title={t("noProducts")}
            detail={t("noProductsHelp")}
            action={t("retry")}
            onAction={() => startRetry(() => router.refresh())}
          />
        )}
      </Results>
      {home && (
        <Value>
          <Icon name="bag" size={21} />
          {t("cartValue")}
        </Value>
      )}
    </Content>
  );
}
