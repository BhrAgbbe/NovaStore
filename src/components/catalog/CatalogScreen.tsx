"use client";

import { useState } from "react";
import Pagination from "@/shared/Pagination";
import { Skeleton } from "@/shared/Skeleton";
import ContactSection from "@/components/layout/ContactSection";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCatalogQuery } from "@/requests/catalogQuery";
import { isCancelledError } from "@tanstack/react-query";
import { useDismissToast, useToast } from "@/shared/Toast";
import styled from "styled-components";
import { Banner, EmptyState } from "@/shared/controls";
import Icon, { type IconName } from "@/shared/Icon";
import { useCart } from "@/storage/cart";
import { Category, Sort } from "@/types/enums/catalog";
import type { CatalogData } from "@/types/product";
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
import CatalogSort from "./CatalogSort";
import ProductCard from "./ProductCard";

export type CatalogState =
  | { readonly status: "loading" | "error" }
  | { readonly status: "success"; readonly category: Category; readonly sort: Sort; readonly data: CatalogData };

const CATEGORIES: { readonly key: Category; readonly icon: IconName }[] = [
  { key: Category.All, icon: "grid" },
  { key: Category.Electronics, icon: "laptop" },
  { key: Category.Apparel, icon: "shirt" },
  { key: Category.Jewelry, icon: "gem" },
];

const Content = styled.main`
  max-width: 1440px;
  margin-inline: auto;
  width: 100%;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: min(100%, 360px);
  justify-self: center;
  gap: 8px;
  button {
    display: flex;
    gap: 6px;
    align-items: center;
    min-height: 44px;
    justify-content: center;
    padding: 0 10px;
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
    justify-content: center;
    width: auto;
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
const CardSkeleton = styled.div`
  min-width: 0;
  padding: 12px;
  display: grid;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  span:first-child {
    aspect-ratio: 4/3;
  }
  span:last-child {
    height: 44px;
  }
`;
export default function CatalogScreen({ state }: { readonly state: CatalogState }) {
  const t = useTranslations("Store");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const query = readCatalogQuery(useSearchParams());
  const initialData =
    state.status === "success" && state.category === query.category && state.sort === query.sort ? state.data : undefined;
  const [hasLoaded, setHasLoaded] = useState(false);
  const catalog = useCatalogQuery(
    query.category,
    query.sort,
    state.status === "success" || hasLoaded,
    initialData
  );
  const toast = useToast();
  const dismiss = useDismissToast();
  const add = useCart((cart) => cart.add);
  const hydrated = useCart((cart) => cart.hydrated);
  const data = state.status === "loading" ? undefined : catalog.data;
  const products = data?.products ?? [];
  const categories = state.status === "success" ? state.data.categories : data?.categories;
  const available = categories?.length ? new Set(categories.map(groupCategory)) : null;
  const { items, page, pages } = selectCatalog(products, query, locale, (category) => t(category));
  const isLoading = state.status === "loading" || catalog.isFetching;
  const isError = !isLoading && (catalog.isError || (!data && state.status === "error"));
  const home =
    !query.q && query.category === Category.All && query.sort === Sort.Featured && query.page === 1;
  const heading = query.q
    ? t("searchResults")
    : query.category === Category.All
      ? t("featuredProducts")
      : t(query.category);
  const Title = home ? "h2" : "h1";

  function update(next: Partial<CatalogQuery>) {
    const suffix = writeCatalogQuery({ ...query, page: 1, ...next });
    window.history.pushState(null, "", localPath(locale, ROUTES.home) + suffix + "#catalog");
  }

  async function retry() {
    const notice = toast(t("loading"), "pending");
    try {
      await catalog.refetch({ throwOnError: true, cancelRefetch: false });
      setHasLoaded(true);
      toast(t("loaded"), "success", notice);
    } catch (error) {
      if (isCancelledError(error)) dismiss(notice);
      else toast(t("error"), "error", notice);
    }
  }

  return (
    <Content>
      {home && (
        <CatalogHero
          products={products}
          loading={isLoading}
          onExplore={(category) => {
            if (category !== Category.All) update({ category });
            document.getElementById("catalog")?.scrollIntoView();
          }}
        />
      )}
      <Filters id="categories" aria-label={t("categories")}>
        {state.status === "loading" &&
          Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} aria-hidden="true" style={{ height: 40, width: 90 }} />
          ))}
        {state.status !== "loading" &&
          CATEGORIES.filter(
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
      <Results id="catalog" aria-busy={isLoading}>
        <div className="heading">
          <div>
            <Title>{heading}</Title>
            <p role="status" className="visually-hidden">
              {isLoading ? t("loading") : t("count", { count: formatNumber(items.length, locale) })}
            </p>
          </div>
          <CatalogSort value={query.sort} onChange={(sort) => update({ sort })} />
        </div>
        {isError ? (
          <>
            <Banner variant="error" title={t("error")} detail={t("errorHelp")} />
            <EmptyState
              icon="refresh"
              title={t("retryHeading")}
              detail={t("retryHelp")}
              action={t("retry")}
              disabled={!hydrated}
              onAction={() => void retry()}
            />
          </>
        ) : isLoading ? (
          <Grid aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <CardSkeleton key={index}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </CardSkeleton>
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
                    toast(t("added", { name: item.title }), "success");
                  }}
                />
              ))}
            </Grid>
            {pages > 1 && (
              <Pagination
                page={page}
                pages={pages}
                label={t("pagination")}
                previous={t("previous")}
                next={t("next")}
                format={(value) => formatNumber(value, locale)}
                pageLabel={(value) => t("page", { page: formatNumber(value, locale) })}
                onChange={(value) => update({ page: value })}
              />
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
            disabled={!hydrated}
            onAction={() => void retry()}
          />
        )}
      </Results>
      <ContactSection />
    </Content>
  );
}
