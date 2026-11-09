"use client";

import { Formik, Form, Field } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import { useTheme } from "@/context/theme";
import { Link, usePathname, useRouter } from "@/dictionary/navigation";
import { Brand, IconButton } from "@/shared/controls";
import Icon from "@/shared/Icon";
import { countUnits, useCart } from "@/storage/cart";
import { readCatalogQuery, writeCatalogQuery } from "@/utils/catalog";
import { formatNumber } from "@/utils/format";
import { defaultLocale, isLocale, localPath, ROUTES } from "@/utils/routes";
import { searchSchema } from "@/validations/search.schema";

const Header = styled.header`
  background: var(--surface);
  border-block-end: 1px solid var(--line);
  .inner {
    max-width: 1440px;
    margin: auto;
    padding: 0 var(--gutter);
    display: grid;
    align-items: center;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 8px;
  }
  .brand {
    min-height: 68px;
    display: flex;
    align-items: center;
  }
  .navigation {
    display: none;
  }
  .tools {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
    align-items: center;
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
    padding: 0 9px;
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: var(--tint);
    color: var(--brand-ink);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
  }
  .mobile-menu {
    grid-column: 1/-1;
    display: grid;
    gap: 8px;
    padding-block: 8px 16px;
  }
  .mobile-menu a {
    border: 1px solid var(--line);
    min-height: 44px;
    display: grid;
    place-items: center;
    border-radius: 10px;
  }
  @media (min-width: 768px) {
    .inner {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
    .brand {
      min-height: 76px;
    }
    .menu-toggle,
    .mobile-menu {
      display: none;
    }
    .tools {
      gap: 8px;
    }
  }
  @media (min-width: 1024px) {
    .navigation {
      display: flex;
      align-items: center;
      gap: 22px;
      font-size: 14px;
      font-weight: 700;
    }
    .navigation a {
      min-height: 44px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .navigation a:first-child {
      color: var(--brand-ink);
    }
  }
`;
const Search = styled(Form)`
  display: flex;
  gap: 9px;
  padding: 0 12px;
  min-height: 44px;
  border-radius: 10px;
  background: var(--soft);
  border: 1px solid var(--line);
  color: var(--muted);
  align-items: center;
  grid-column: 1/-1;
  margin: 6px 0;
  order: 3;
  &:focus-within {
    border-color: var(--focus);
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
  input::placeholder {
    color: var(--muted);
    opacity: 1;
  }
  button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--muted);
    width: 24px;
    height: 36px;
    display: grid;
    place-items: center;
  }
  @media (min-width: 768px) {
    order: 0;
    margin: 0;
    width: 190px;
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
  const units = useCart((state) => (state.hydrated ? countUnits(state.lines) : 0));
  const query = readCatalogQuery(params);
  const nextLocale = locale === "fa" ? "en" : "fa";
  const nextQuery = params.toString();

  function search(q: string) {
    const suffix = writeCatalogQuery({ ...query, q: q.trim(), page: 1 });
    if (path === ROUTES.home) {
      window.history.pushState(null, "", localPath(locale, ROUTES.home) + suffix + "#catalog");
      document.getElementById("catalog")?.scrollIntoView();
    } else {
      router.push(ROUTES.home + suffix + "#catalog");
    }
    setMenu(false);
  }

  return (
    <Header>
      <div className="inner">
        <Link href={ROUTES.home} className="brand" aria-label={t("store")}>
          <Brand />
        </Link>
        <nav className="navigation" aria-label={t("store")}>
          <Link href={ROUTES.home}>{t("home")}</Link>
          <Link href="/#catalog">{t("products")}</Link>
          <Link href="/#categories">
            {t("categories")}
            <Icon name="down" size={15} />
          </Link>
        </nav>
        <Formik
          initialValues={{ q: query.q }}
          enableReinitialize
          validationSchema={searchSchema}
          onSubmit={({ q }, { setSubmitting }) => {
            search(q);
            setSubmitting(false);
          }}
        >
          {({ values, resetForm }) => (
            <Search role="search">
              <button type="submit" aria-label={t("search")}>
                <Icon name="search" size={17} />
              </button>
              <Field type="search" name="q" aria-label={t("search")} placeholder={t("search")} />
              {values.q && (
                <button
                  type="button"
                  aria-label={t("clearSearch")}
                  onClick={() => {
                    resetForm({ values: { q: "" } });
                    search("");
                  }}
                >
                  <Icon name="x" size={15} />
                </button>
              )}
            </Search>
          )}
        </Formik>
        <div className="tools">
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
          <Link
            href={ROUTES.cart}
            className="cart"
            aria-label={t("cart") + " · " + formatNumber(units, locale)}
          >
            <Icon name="bag" size={19} />
            {formatNumber(units, locale)}
          </Link>
          <IconButton
            type="button"
            className="menu-toggle"
            aria-controls="store-menu"
            aria-expanded={menu}
            aria-label={menu ? t("closeMenu") : t("openMenu")}
            onClick={() => setMenu(!menu)}
          >
            <Icon name={menu ? "x" : "menu"} size={19} />
          </IconButton>
        </div>
        {menu && (
          <nav id="store-menu" className="mobile-menu" aria-label={t("store")}>
            <Link href={ROUTES.home} onClick={() => setMenu(false)}>
              {t("home")}
            </Link>
            <Link href="/#catalog" onClick={() => setMenu(false)}>
              {t("all")}
            </Link>
            <Link href={ROUTES.cart} onClick={() => setMenu(false)}>
              {t("cart")}
            </Link>
          </nav>
        )}
      </div>
    </Header>
  );
}
