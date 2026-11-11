"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/shared/controls";
import { useToast } from "@/shared/Toast";

const MailMark = () => (
  <svg className="mail-mark" viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
    <mask id="nova-mail-flap">
      <rect width="24" height="24" fill="white" />
      <path
        d="M4 6.5 12 12l8-5.5"
        fill="none"
        stroke="black"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </mask>
    <path
      fill="currentColor"
      mask="url(#nova-mail-flap)"
      d="M3 5.75A2.75 2.75 0 0 1 5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V5.75Z"
    />
  </svg>
);

const Contact = styled.section`
  width: 100%;
  padding: clamp(20px, 2.2vw, 28px) clamp(20px, 2.6vw, 34px);
  border-radius: 12px;
  background: #f1f2f4;
  color: var(--ink);
  [data-theme="dark"] & {
    background: var(--soft);
  }
  .inner {
    display: grid;
    align-items: center;
    gap: 18px;
  }
  .intro {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }
  .mail-mark {
    flex: none;
    color: #122139;
  }
  [data-theme="dark"] & .mail-mark {
    color: var(--ink);
  }
  .copy {
    display: grid;
    gap: 4px;
    min-width: 0;
  }
  strong {
    font-size: 15px;
    font-weight: 800;
    line-height: 1.5;
    color: var(--ink);
  }
  p {
    font-size: 12px;
    line-height: 1.7;
    color: var(--muted);
  }
  form {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 520px;
    justify-self: end;
  }
  input {
    flex: 1;
    min-width: 0;
    height: 46px;
    padding: 0 16px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: 13px;
  }
  input::placeholder {
    color: var(--muted);
    opacity: 1;
  }
  input:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 1px;
  }
  form button {
    min-width: 110px;
    height: 46px;
  }
  @media (min-width: 768px) {
    .inner {
      grid-template-columns: minmax(0, 1fr) minmax(300px, 40%);
      gap: 32px;
    }
  }
  @media (max-width: 420px) {
    form {
      flex-wrap: wrap;
    }
    form button {
      width: 100%;
    }
  }
`;

const contactEmail = process.env.NEXT_PUBLIC_NOVA_CONTACT_EMAIL;

export default function ContactSection() {
  const t = useTranslations("Store");
  const toast = useToast();
  return (
    <Contact aria-label={t("contactHeading")}>
      <div className="inner">
        <div className="intro">
          <MailMark />
          <div className="copy">
            <strong>{t("contactHeading")}</strong>
            <p>{t("contactHelp")}</p>
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!contactEmail) {
              toast(t("contactUnavailable"), "error");
              return;
            }
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
          />
          <Button type="submit">{t("subscribe")}</Button>
        </form>
      </div>
    </Contact>
  );
}
