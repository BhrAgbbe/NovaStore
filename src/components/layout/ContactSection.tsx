"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/shared/controls";
import Icon from "@/shared/Icon";

const Contact = styled.section`
  display: grid;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 14px;
  background: var(--soft);
  color: var(--ink);
  .intro {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .intro p {
    color: var(--muted);
    font-size: 13px;
  }
  form {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  input {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 0 12px;
    background: var(--surface);
    color: var(--ink);
  }
  @media (min-width: 768px) {
    grid-template-columns: 1fr minmax(270px, 40%);
    align-items: center;
  }
`;

const contactEmail = process.env.NEXT_PUBLIC_NOVA_CONTACT_EMAIL;
export default function ContactSection() {
  const t = useTranslations("Store");
  return (
    <Contact aria-label={t("contactHeading")}>
      <div className="intro">
        <Icon name="mail" size={26} />
        <div>
          <strong>{t("contactHeading")}</strong>
          <p>{t(contactEmail ? "contactHelp" : "contactUnavailable")}</p>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!contactEmail) return;
          const email = new FormData(event.currentTarget).get("email");
          const query = new URLSearchParams({
            subject: t("subscribe"),
            body: typeof email === "string" ? email : "",
          });
          window.location.href =
            "mailto:" +
            encodeURIComponent(contactEmail) +
            "?" +
            query.toString().replace(/\+/g, "%20");
        }}
      >
        <input
          name="email"
          type="email"
          required
          placeholder={t("emailPlaceholder")}
          aria-label={t("emailPlaceholder")}
          disabled={!contactEmail}
        />
        <Button type="submit" disabled={!contactEmail}>
          {t("subscribe")}
        </Button>
      </form>
    </Contact>
  );
}
