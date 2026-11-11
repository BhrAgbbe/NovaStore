"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Link } from "@/dictionary/navigation";
import { Brand, Button } from "@/shared/controls";
import { ROUTES } from "@/utils/routes";

const Missing = styled.main`
  width: min(100%, 1200px);
  margin-inline: auto;
  padding: clamp(32px, 6vw, 80px) var(--gutter);
  display: grid;
  place-items: center;
  text-align: center;
  gap: 20px;
  color: var(--ink);
  .number { color: var(--brand-ink); font: 800 clamp(90px, 20vw, 180px)/1 Inter, sans-serif; letter-spacing: -0.08em; }
  h1 { font-size: clamp(24px, 4vw, 36px); }
  p { color: var(--muted); max-width: 40ch; }
`;

export default function NotFoundPage() {
  const t = useTranslations("Store");
  return (
    <Missing>
      <Brand />
      <span className="number" aria-hidden="true">404</span>
      <h1>{t("notFound")}</h1>
      <p>{t("notFoundHelp")}</p>
      <Button as={Link} href={ROUTES.home}>{t("goHome")}</Button>
    </Missing>
  );
}
