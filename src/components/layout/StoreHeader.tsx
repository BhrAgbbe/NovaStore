"use client";

import { Formik, Field } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import { useTheme } from "@/context/theme";
import { Link, usePathname, useRouter } from "@/dictionary/navigation";
import Modal from "@/modals/Modal";
import { Brand, IconButton } from "@/shared/controls";
import Dropdown from "@/shared/Dropdown";
import Icon from "@/shared/Icon";
import { countUnits, useCart } from "@/storage/cart";
import { Category } from "@/types/enums/catalog";
import { readCatalogQuery, writeCatalogQuery, type CatalogQuery } from "@/utils/catalog";
import { formatNumber } from "@/utils/format";
import { defaultLocale, isLocale, localPath, ROUTES } from "@/utils/routes";
import { searchSchema } from "@/validations/search.schema";

import { Header, Drawer, Search } from "./StoreHeaderStyles";

export default function StoreHeader() {
  const t = useTranslations("Store");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const path = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const { mode, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [treeOpen, setTreeOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBox = useRef<HTMLDivElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const searchId = useId();
  const searchError = useId();
  const treeId = useId();
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

  const categoryOptions = Object.values(Category).map((category) => ({
    value: category,
    label: t(category),
  }));
  const categoryMenu = (
    <Dropdown
      className="nav-category"
      variant="borderless"
      label={t("categories")}
      displayLabel={t("categories")}
      value={query.category}
      options={categoryOptions}
      onChange={(category) => {
        if (category !== query.category) updateCatalog({ category });
      }}
    />
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
          {categoryMenu}
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
            <div className="tree">
              <button
                type="button"
                className="tree-parent"
                aria-expanded={treeOpen}
                aria-controls={treeId}
                onClick={() => setTreeOpen(!treeOpen)}
              >
                {t("products")}
                <Icon name="down" size={16} />
              </button>
              <div className="tree-children" id={treeId} data-open={treeOpen}>
                <div className="tree-inner">
                  {Object.values(Category).map((category) => (
                    <button
                      key={category}
                      type="button"
                      className="tree-link"
                      aria-current={query.category === category ? "true" : undefined}
                      onClick={() => {
                        if (category !== query.category) updateCatalog({ category });
                        setMenu(false);
                      }}
                    >
                      {t(category)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="preferences">{preferences}</div>
          </Drawer>
        </Modal>
      )}
    </Header>
  );
}
