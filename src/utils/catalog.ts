import { Category, Sort } from "@/types/enums/catalog";
import type { Product } from "@/types/product";
import type { Locale } from "./format";
import { localeTag, normalizeSearch } from "./format";

export const PAGE_SIZE = 6;

export function groupCategory(value: string) {
  if (value === "electronics") return Category.Electronics;
  if (value === "jewelery") return Category.Jewelry;
  if (value === "men's clothing" || value === "women's clothing") return Category.Apparel;
  return Category.All;
}

export interface CatalogQuery {
  readonly q: string;
  readonly category: Category;
  readonly sort: Sort;
  readonly page: number;
}

export function readCatalogQuery(params: Pick<URLSearchParams, "get">): CatalogQuery {
  const category = Object.values(Category).find((item) => item === params.get("category"));
  const sort = Object.values(Sort).find((item) => item === params.get("sort"));
  const page = Number(params.get("page"));
  return {
    q: params.get("q")?.trim() || "",
    category: category ?? Category.All,
    sort: sort ?? Sort.Featured,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
}

export function writeCatalogQuery(query: CatalogQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category !== Category.All) params.set("category", query.category);
  if (query.sort !== Sort.Featured) params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params.size ? "?" + params.toString() : "";
}

export function selectCatalog(products: readonly Product[], query: CatalogQuery, locale: Locale) {
  const term = normalizeSearch(query.q);
  const matches = products.filter(
    (product) =>
      normalizeSearch(product.title).includes(term) &&
      (query.category === Category.All || groupCategory(product.category) === query.category)
  );
  if (query.sort === Sort.PriceAscending) matches.sort((a, b) => a.price - b.price);
  if (query.sort === Sort.PriceDescending) matches.sort((a, b) => b.price - a.price);
  if (query.sort === Sort.TitleAscending) {
    const collator = new Intl.Collator(localeTag[locale], { sensitivity: "base" });
    matches.sort((a, b) => collator.compare(a.title, b.title));
  }
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(pages, query.page);
  const start = (page - 1) * PAGE_SIZE;
  return { items: matches.slice(start, start + PAGE_SIZE), page, pages, count: matches.length };
}
