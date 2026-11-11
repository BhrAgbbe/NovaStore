"use client";

import ProductPhoto from "@/shared/ProductPhoto";
import { Skeleton } from "@/shared/Skeleton";
import { groupCategory } from "@/utils/catalog";
import type { Product } from "@/types/product";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Category } from "@/types/enums/catalog";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import hero from "@/assets/Images/hero.jpg";
import { Button } from "@/shared/controls";
import Icon from "@/shared/Icon";

const Hero = styled.section`
  display: grid;
  touch-action: pan-y pinch-zoom;
  .copy,
  .photo {
    animation: slide-appear 200ms ease-out;
  }
  @keyframes slide-appear {
    from {
      opacity: 0.65;
    }
    to {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .copy,
    .photo {
      animation: none;
    }
  }
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
  .product-photo img {
    object-fit: contain;
  }
  .photo-skeleton {
    height: 100%;
    min-height: 176px;
  }
  h1 {
    font-size: 32px;
    white-space: pre-line;
  }
  p {
    font-size: 14px;
    color: #4e5261;
  }
  .copy button {
    min-width: 156px;
  }
  [data-theme="dark"] & {
    background: #24374e;
    color: #f4f7fb;
  }
  [data-theme="dark"] & p {
    color: #b1c0d3;
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
    .copy button {
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
const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-block-start: 6px;
  .dot {
    min-width: 32px;
    min-height: 40px;
    display: grid;
    place-items: center;
    border: 0;
    background: transparent;
  }
  .dot::before {
    content: "";
    height: 8px;
    width: 8px;
    border-radius: 6px;
    background: var(--muted);
  }
  .dot[aria-current="true"]::before {
    width: 22px;
    background: var(--brand);
  }
`;

const SLIDES = [
  { title: "heroTitle", description: "heroDescription", category: Category.All, icon: "image" },
  {
    title: "heroElectronicsTitle",
    description: "heroElectronicsDescription",
    category: Category.Electronics,
    icon: "laptop",
  },
  {
    title: "heroApparelTitle",
    description: "heroApparelDescription",
    category: Category.Apparel,
    icon: "shirt",
  },
] as const;

export default function CatalogHero({
  onExplore,
  products,
  loading,
}: {
  readonly products: readonly Product[];
  readonly loading: boolean;
  readonly onExplore: (category: Category) => void;
}) {
  const t = useTranslations("Store");
  const [index, setIndex] = useState(0);
  const photos = SLIDES.map(
    ({ category }) => products.find((item) => groupCategory(item.category) === category)?.image
  );
  const slides = SLIDES.filter(
    ({ category }, position) => category === Category.All || photos[position]
  );
  const position = index % slides.length;
  const slide = slides[position];
  const image = photos[SLIDES.indexOf(slide)];
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (hovered || focused || paused || slides.length < 2) return;
    const interval = setInterval(() => {
      if (!document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hovered, focused, paused, slides.length, position]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  function move(step: number) {
    setIndex((current) => (current + step + slides.length) % slides.length);
  }
  return (
    <section
      aria-label={t("carousel")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <Hero
        as="div"
        aria-live={paused ? "polite" : "off"}
        onPointerDown={(event) => {
          if (event.pointerType === "touch" && event.isPrimary) {
            touchStart.current = { x: event.clientX, y: event.clientY };
          }
        }}
        onPointerCancel={() => {
          touchStart.current = null;
        }}
        onPointerUp={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || event.pointerType !== "touch") return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy)) return;
          move((dx < 0 ? 1 : -1) * (document.documentElement.dir === "rtl" ? -1 : 1));
        }}
      >
        <div key={slide.title} className="copy">
          <h1>{t(slide.title)}</h1>
          <p>{t(slide.description)}</p>
          <Button type="button" onClick={() => onExplore(slide.category)}>
            <Icon name="arrow" size={17} directional />
            {t("explore")}
          </Button>
        </div>
        {loading ? (
          <div className="photo">
            <Skeleton className="photo-skeleton" aria-hidden="true" />
          </div>
        ) : slide.category === Category.All ? (
          <div className="photo">
            <Image src={hero} fill priority sizes="(max-width: 767px) 100vw, 50vw" alt="" />
          </div>
        ) : (
          image && <ProductPhoto key={image} className="photo product-photo" src={image} />
        )}
      </Hero>
      {slides.length > 1 && (
        <Controls>
          {slides.map(({ category }, slideIndex) => (
            <button
              key={category}
              className="dot"
              type="button"
              aria-current={slideIndex === position}
              aria-label={t("slide", { number: slideIndex + 1 })}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
         
        </Controls>
      )}
    </section>
  );
}
