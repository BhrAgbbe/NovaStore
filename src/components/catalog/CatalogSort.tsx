"use client";

import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "@/shared/controls";
import Icon from "@/shared/Icon";
import { Sort } from "@/types/enums/catalog";

const Dropdown = styled.div`
  position: relative;
  .options {
    position: absolute;
    z-index: 5;
    inset-block-start: calc(100% + 6px);
    inset-inline-start: 0;
    min-width: max(100%, 184px);
    max-height: min(50dvh, 220px);
    overflow-y: auto;
    padding: 5px;
    display: grid;
    gap: 3px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 10px;
    box-shadow: 0 8px 24px #12213926;
  }
  .options button {
    min-height: 42px;
    justify-content: flex-start;
    border: 0;
  }
  .options button:hover,
  .options button[aria-pressed="true"] {
    color: var(--brand-ink);
    background: var(--tint);
  }
  @media (min-width: 768px) {
    .options {
      inset-inline-start: auto;
      inset-inline-end: 0;
    }
  }
`;

export default function CatalogSort({
  value,
  onChange,
}: {
  readonly value: Sort;
  readonly onChange: (value: Sort) => void;
}) {
  const t = useTranslations("Store");
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const labels = {
    [Sort.Featured]: t("featured"),
    [Sort.PriceAscending]: t("priceAsc"),
    [Sort.PriceDescending]: t("priceDesc"),
    [Sort.TitleAscending]: t("titleAsc"),
  };

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <Dropdown
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
        if (open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
          const buttons = Array.from(options.current?.querySelectorAll("button") ?? []);
          if (!buttons.length) return;
          event.preventDefault();
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
          const next =
            event.key === "ArrowDown" ? index + 1 : index < 0 ? buttons.length - 1 : index - 1;
          buttons[(next + buttons.length) % buttons.length]?.focus();
        }
      }}
    >
      <Button
        ref={trigger}
        $kind="secondary"
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
      >
        {t("sort")}: {labels[value]}
        <Icon name="down" size={17} />
      </Button>
      {open && (
        <div ref={options} id={id} role="group" aria-label={t("sort")} className="options">
          {Object.values(Sort).map((sort) => (
            <Button
              key={sort}
              type="button"
              $kind="secondary"
              aria-pressed={sort === value}
              onClick={() => {
                onChange(sort);
                close();
              }}
            >
              {labels[sort]}
            </Button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
