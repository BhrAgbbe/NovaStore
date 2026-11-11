"use client";

import ProductPhoto from "@/shared/ProductPhoto";
import { Skeleton } from "@/shared/Skeleton";
import { groupCategory } from "@/utils/catalog";
import type { Product } from "@/types/product";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Category } from "@/types/enums/catalog";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import hero from "@/assets/Images/hero.jpg";
import { Button } from "@/shared/controls";
import Icon from "@/shared/Icon";

const Hero = styled.div`
  border-radius: 18px;
  overflow: hidden;
  background: #f4e8db;
  color: #122139;
  .slide {
    display: grid;
    touch-action: pan-y pinch-zoom;
    user-select: none;
    transition: transform 200ms ease;
  }
  .slide[data-dragging="true"] {
    transition: none;
    cursor: grabbing;
  }
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
    .slide {
      min-height: 276px;
      grid-template-columns: 48% 52%;
    }
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
    .slide {
      min-height: 350px;
    }
    .copy {
      padding: 24px clamp(26px, 3.33vw, 48px);
    }
    h1 {
      font-size: 49px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .slide {
      transition: none;
    }
    .copy,
    .photo {
      animation: none;
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

const THRESHOLD = 40;
const MAX_OFFSET = 160;

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
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const drag = useRef<{ x: number; y: number; pointerId: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (hovered || focused || dragging || slides.length < 2) return;
    const interval = setInterval(() => {
      if (!document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hovered, focused, dragging, slides.length, position]);

  useEffect(() => () => clearTimeout(settle.current), []);

  function move(step: number) {
    setOffset(0);
    setIndex((current) => (current + step + slides.length) % slides.length);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId, moved: false };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy)) return;
      start.moved = true;
      setDragging(true);
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic pointers cannot be captured; element listeners still receive the release.
      }
    }
    event.preventDefault();
    setOffset(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx)));
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    drag.current = null;
    setDragging(false);
    setOffset(0);
    if (!start?.moved) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    suppressClick.current = true;
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      suppressClick.current = false;
    }, 300);
    if (Math.abs(dx) < THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;
    const forward = document.documentElement.dir === "rtl" ? dx > 0 : dx < 0;
    move(forward ? 1 : -1);
  }

  function cancelDrag() {
    drag.current = null;
    setDragging(false);
    setOffset(0);
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
        aria-live="off"
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={cancelDrag}
      >
        <div
          className="slide"
          data-dragging={dragging}
          style={{
            transform: offset ? `translateX(${offset}px)` : undefined,
            cursor: dragging ? "grabbing" : undefined,
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
        </div>
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
