"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import hero from "@/assets/Images/hero.jpg";
import { Anchor } from "@/shared/controls";
import Icon from "@/shared/Icon";

const Hero = styled.section`
  display: grid;
  border-radius: 18px;
  overflow: hidden;
  background: #f4e8db;
  color: #122139;
  .copy {
    padding: 20px;
    display: grid;
    gap: 12px;
    justify-items: start;
    align-content: center;
  }
  .photo {
    position: relative;
    grid-row: 1;
    min-height: 176px;
  }
  img {
    object-fit: cover;
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    color: #873605;
    background: #fde0cc;
    border-radius: 14px;
    padding: 4px 10px;
    min-height: 28px;
  }
  h1 {
    font-size: 32px;
    white-space: pre-line;
  }
  p {
    font-size: 14px;
    color: #4e5261;
  }
  a {
    min-width: 156px;
  }
  [data-theme="dark"] & {
    background: #24374e;
    color: #f4f7fb;
  }
  [data-theme="dark"] & p {
    color: #b1c0d3;
  }
  [data-theme="dark"] & .label {
    color: #ffc6a5;
    background: #3c302f;
  }
  @media (min-width: 768px) {
    min-height: 276px;
    grid-template-columns: 48% 52%;
    .copy {
      padding: 24px 26px;
    }
    .photo {
      grid-row: auto;
    }
    h1 {
      font-size: 35px;
    }
    p {
      font-size: 16px;
    }
    a {
      min-width: 178px;
    }
  }
  @media (min-width: 1024px) {
    min-height: 350px;
    .copy {
      padding: 24px clamp(26px, 3.33vw, 48px);
    }
    h1 {
      font-size: 49px;
    }
  }
`;
const Indicator = styled.div`
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  direction: ltr;
  span {
    height: 6px;
    width: 6px;
    border-radius: 3px;
    background: var(--line);
  }
  span:first-child {
    width: 22px;
    background: var(--brand);
  }
`;

export default function CatalogHero() {
  const t = useTranslations("Store");
  return (
    <>
      <Hero>
        <div className="copy">
          <span className="label">{t("heroKicker")}</span>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroDescription")}</p>
          <Anchor href="#catalog">
            <Icon name="arrow" size={17} directional />
            {t("explore")}
          </Anchor>
        </div>
        <div className="photo">
          <Image src={hero} fill priority sizes="(max-width: 767px) 100vw, 50vw" alt="" />
        </div>
      </Hero>
      <Indicator aria-hidden="true">
        <span />
        <span />
        <span />
      </Indicator>
    </>
  );
}
