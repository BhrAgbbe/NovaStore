"use client";

import { Formik, Form, Field } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import styled from "styled-components";
import { useTheme } from "@/context/theme";
import { Link, usePathname, useRouter } from "@/dictionary/navigation";
import Modal from "@/modals/Modal";
import { Brand, IconButton } from "@/shared/controls";
import Icon from "@/shared/Icon";
import { countUnits, useCart } from "@/storage/cart";
import { Category } from "@/types/enums/catalog";
import { readCatalogQuery, writeCatalogQuery, type CatalogQuery } from "@/utils/catalog";
import { formatNumber } from "@/utils/format";
import { defaultLocale, isLocale, localPath, ROUTES } from "@/utils/routes";
import { searchSchema } from "@/validations/search.schema";

const Header = styled.header`
  background: var(--surface);
  color: var(--ink);
  border-block-end: 1px solid var(--line);
  .inner {
    max-width: 1440px;
    margin: auto;
    padding-inline: var(--gutter);
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto 1fr;
    gap: 0 8px;
  }
  .brand {
    min-height: 64px;
    display: flex;
    align-items: center;
    grid-column: 2;
    grid-row: 1;
  }
  .navigation,
  .desktop-preferences {
    display: none;
  }
  .tools,
  .desktop-preferences {
    gap: 6px;
    justify-content: flex-end;
    align-items: center;
  }
  .tools {
    display: flex;
    grid-column: 3;
    grid-row: 1;
  }
  .menu-toggle {
    justify-self: start;
    grid-column: 1;
    grid-row: 1;
  }
  .language {
    min-height: 44px;
    padding-inline: 4px;
    display: flex;
    gap: 5px;
    align-items: center;
    font:
      700 12px Inter,
      sans-serif;
  }
  .cart {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: var(--ink);
  }
  .cart-count {
    position: absolute;
    inset-block-start: 1px;
    inset-inline-end: 0;
    padding-inline: 3px;
    min-width: 19px;
    min-height: 19px;
    border-radius: 999px;
    background: var(--brand);
    color: var(--on-brand);
    font-size: 11px;
    font-weight: 800;
    display: grid;
    place-items: center;
  }
  .search-box {
    grid-column: 1 / -1;
    display: none;
  }
  .search-box[data-expanded="true"] {
    display: block;
  }
  .category-select {
    min-height: 44px;
    max-width: 100%;
    background: var(--surface);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding-inline: 8px;
    font: inherit;
    cursor: pointer;
  }
  @media (min-width: 768px) {
    .inner {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }
    .brand {
      min-height: 76px;
    }
    .menu-toggle,
    .search-toggle {
      display: none;
    }
    .search-box,
    .desktop-preferences {
      display: block;
    }
    .desktop-preferences {
      display: flex;
    }
    .navigation {
      display: flex;
      align-items: center;
      gap: clamp(8px, 1.7vw, 24px);
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }
    .navigation a {
      min-height: 44px;
      display: flex;
      align-items: center;
      gap: 3px;
      position: relative;
    }
    .navigation .category-select {
      max-width: 150px;
    }
    .navigation a[aria-current="page"]::after {
      content: "";
      position: absolute;
      inset: auto 0 3px;
      height: 2px;
      border-radius: 2px;
      background: var(--brand);
    }
  }
`;
const Drawer = styled.nav`
  display: grid;
  gap: 8px;
  a {
    min-height: 44px;
    display: flex;
    align-items: center;
    padding-inline: 12px;
    border-radius: 10px;
    background: var(--soft);
  }
  .category-select {
    min-height: 44px;
    max-width: 100%;
    background: var(--surface);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding-inline: 8px;
    font: inherit;
    cursor: pointer;
  }
  .preferences {
    display: flex;
    gap: 12px;
    align-items: center;
  }
`;

const Search = styled(Form)`
  display: flex;
  gap: 9px;
  padding: 0 12px;
  min-height: 44px;
  border-radius: 10px;
  background: var(--soft);
  border: 2px solid var(--line);
  color: var(--muted);
  align-items: center;
  grid-column: 1/-1;
  margin: 6px 0;
  &:focus-within {
    border-color: var(--focus);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--focus) 20%, transparent);
  }
  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: none;
    background: none;
    color: var(--ink);
    font-size: 13px;
  }
  input::-webkit-search-cancel-button {
    appearance: none;
  }
  input::placeholder {
    color: var(--muted);
    opacity: 1;
  }
  button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--muted);
    width: 28px;
    flex: none;
    height: 36px;
    display: grid;
    place-items: center;
  }
  @media (min-width: 768px) {
    margin: 0;
    width: clamp(156px, 20vw, 245px);
  }
  @media (min-width: 1024px) {
    width: 252px;
  }
`;

export default function StoreHeader() {
  const t = useTranslations("Store");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const path = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const { mode, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBox = useRef<HTMLDivElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const searchId = useId();
  const searchError = useId();
  const units = useCart((state) => (state.hydrated ? countUnits(state.lines) : 0));
  const query = readCatalogQuery(params);
  const nextLocale = locale === "fa" ? "en" : "fa";
  const nextQuery = params.toString();

  function updateCatalog(next: Partial<CatalogQuery>) {
    const suffix = writeCatalogQuery({ ...query, ...next, page: 1 });
    if (path === ROUTES.home) {
      window.history.pushState(null, "", localPath(locale, ROUTES.home) + suffix + "#catalog");
      document.getElementById("catalog")?.scrollIntoView();
    } else {
      router.push(ROUTES.home + suffix + "#catalog");
    }
    setMenu(false);
  }

  const categorySelect = (
    <select
      className="category-select"
      aria-label={t("categories")}
      value={query.category}
      onChange={(event) => {
        const category = Object.values(Category).find(
          (value) => value === event.currentTarget.value
        );
        if (category) updateCatalog({ category });
      }}
    >
      {Object.values(Category).map((category) => (
        <option key={category} value={category}>
          {t(category)}
        </option>
      ))}
    </select>
  );
  const preferences = (
    <>
      <Link
        className="language"
        locale={nextLocale}
        href={path + (nextQuery ? "?" + nextQuery : "")}
        aria-label={t("language")}
      >
        <Icon name="globe" size={17} />
        {nextLocale.toUpperCase()}
      </Link>
      <IconButton
        type="button"
        aria-label={t("changeTheme")}
        aria-pressed={mode === "dark"}
        onClick={toggle}
      >
        <Icon name={mode === "dark" ? "sun" : "moon"} size={19} />
      </IconButton>
    </>
  );

  function toggleSearch() {
    if (searchOpen) {
      setSearchOpen(false);
      return;
    }
    setSearchOpen(true);
    requestAnimationFrame(() => searchBox.current?.querySelector("input")?.focus());
  }

  return (
    <Header>
      <div className="inner">
        <IconButton
          type="button"
          className="menu-toggle"
          aria-haspopup="dialog"
          aria-expanded={menu}
          aria-label={t("openMenu")}
          onClick={() => setMenu(true)}
        >
          <Icon name="menu" size={19} />
        </IconButton>
        <Link href={ROUTES.home} className="brand" aria-label={t("store")}>
          <Brand />
        </Link>
        <nav className="navigation" aria-label={t("store")}>
          <Link href={ROUTES.home} aria-current={path === ROUTES.home ? "page" : undefined}>
            {t("home")}
          </Link>
          <Link href="/#catalog">{t("products")}</Link>
          {categorySelect}
        </nav>
        <div
          ref={searchBox}
          className="search-box"
          id={searchId}
          data-expanded={searchOpen}
          onKeyDown={(event) => {
            if (event.key === "Escape" && searchOpen) {
              setSearchOpen(false);
              searchTrigger.current?.focus();
            }
          }}
        >
          <Formik
            initialValues={{ q: query.q }}
            enableReinitialize
            validationSchema={searchSchema}
            onSubmit={({ q }, { setSubmitting }) => {
              updateCatalog({ q: q.trim() });
              setSubmitting(false);
            }}
          >
            {({ values, errors, touched, resetForm }) => (
              
                <Search role="search">
                  <button type="submit" aria-label={t("search")}>
                    <Icon name="search" size={17} />
                  </button>
                  <Field
                    type="search"
                    name="q"
                    aria-label={t("search")}
                    placeholder={t("search")}
                    aria-invalid={!!(errors.q && touched.q)}
                    aria-describedby={errors.q && touched.q ? searchError : undefined}
                  />
                  {values.q && (
                    <button
                      type="button"
                      aria-label={t("clearSearch")}
                      onClick={() => {
                        resetForm({ values: { q: "" } });
                        updateCatalog({ q: "" });
                        searchBox.current?.querySelector("input")?.focus();
                      }}
                    >
                      <Icon name="x" size={15} />
                    </button>
                  )}
                </Search>
              
            )}
          </Formik>
        </div>
        <div className="tools">
          <IconButton
            ref={searchTrigger}
            type="button"
            className="search-toggle"
            aria-expanded={searchOpen}
            aria-controls={searchId}
            aria-label={t(searchOpen ? "closeSearch" : "openSearch")}
            onClick={toggleSearch}
          >
            <Icon name={searchOpen ? "minus" : "search"} size={19} />
          </IconButton>
          <Link
            href={ROUTES.cart}
            className="cart"
            aria-label={t("cart") + " · " + formatNumber(units, locale)}
          >
            <Icon name="bag" size={22} />
            <span className="cart-count" aria-hidden="true">
              {formatNumber(units, locale)}
            </span>
          </Link>
          <div className="desktop-preferences">{preferences}</div>
        </div>
      </div>
      {menu && (
        <Modal title={t("store")} closeLabel={t("closeMenu")} onClose={() => setMenu(false)} drawer>
          <Drawer aria-label={t("store")}>
            <Link href={ROUTES.home} onClick={() => setMenu(false)}>
              {t("home")}
            </Link>
            <Link href="/#catalog" onClick={() => setMenu(false)}>
              {t("products")}
            </Link>
            {categorySelect}
            <div className="preferences">{preferences}</div>
          </Drawer>
        </Modal>
      )}
    </Header>
  );
}
