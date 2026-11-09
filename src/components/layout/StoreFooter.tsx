"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Link } from "@/dictionary/navigation";
import { Brand } from "@/shared/controls";
import { ROUTES } from "@/utils/routes";

const Footer = styled.footer`
  background: #122139;
  color: white;
  .inner {
    max-width: 1440px;
    margin: auto;
    padding: 24px max(20px, var(--gutter));
    display: grid;
    gap: 20px;
  }
  .groups {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 18px;
  }
  .group {
    display: grid;
    align-content: start;
    gap: 6px;
  }
  .group:nth-child(n + 3) {
    display: none;
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
      gap: 28px;
    }
    .group:nth-child(n + 3) {
      display: grid;
    }
  }
`;

export default function StoreFooter() {
  const t = useTranslations("Store");
  return (
    <Footer>
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
            <span className="link-label">Instagram</span>
            <span className="link-label">Telegram</span>
          </div>
        </div>
        <small className="copyright">{t("rights")}</small>
      </div>
    </Footer>
  );
}
