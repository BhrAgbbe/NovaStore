"use client";

import { useFormatter, useTranslations } from "next-intl";
import styled from "styled-components";
import { Link } from "@/dictionary/navigation";
import { Brand } from "@/shared/controls";
import SocialLinks from "./SocialLinks";
import { ROUTES } from "@/utils/routes";

const Footer = styled.footer`
  background: var(--navy);
  color: white;
  .inner {
    max-width: 1440px;
    margin: auto;
    padding: 24px max(20px, var(--gutter));
    display: grid;
    gap: 20px;
  }
  .groups {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    justify-content: space-between;
    gap: 18px;
  }
  .group:first-child,
  .group:last-child {
    grid-column: 1/-1;
  }
  .group:first-child > span {
    justify-self: start;
  }
  .group {
    display: grid;
    align-content: start;
    gap: 6px;
  }
  strong {
    font-size: 14px;
  }
  p,
  a,
  small,
  .link-label {
    color: #bac8dd;
    font-size: 12px;
  }
  a:hover {
    text-decoration: underline;
  }
  .copyright {
    border-block-start: 1px solid #33445c;
    padding-block-start: 20px;
  }
  @media (min-width: 768px) {
    .inner {
      padding-block: 32px;
    }
    .groups {
      display: flex;
      flex-wrap: wrap;
      gap: 28px;
    }
  }
`;

export default function StoreFooter({ year }: { readonly year: number }) {
  const t = useTranslations("Store");
  const format = useFormatter();
  return (
    <Footer id="contact">
      <div className="inner">
        <div className="groups">
          <div className="group">
            <Brand inverse />
            <p>{t("storeTag")}</p>
          </div>
          <div className="group">
            <strong>{t("shoppingHelp")}</strong>
            <Link href={ROUTES.cart}>{t("cartGuide")}</Link>
            <span className="link-label">{t("faqs")}</span>
            <span className="link-label">{t("contact")}</span>
          </div>
          <div className="group">
            <strong>{t("store")}</strong>
            <Link href="/#catalog">{t("products")}</Link>
            <Link href="/#categories">{t("categories")}</Link>
            <span className="link-label">{t("about")}</span>
          </div>
          <div className="group">
            <strong>{t("follow")}</strong>
            <SocialLinks />
          </div>
        </div>
        <small className="copyright">
          {t("rights", { year: format.number(year, { useGrouping: false }) })}
        </small>
      </div>
    </Footer>
  );
}
