"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import Dropdown from "@/shared/Dropdown";
import { Sort } from "@/types/enums/catalog";

const Positioner = styled.div`
  @media (min-width: 768px) {
    justify-self: end;
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
  const options = [
    { value: Sort.Featured, label: t("featured") },
    { value: Sort.PriceAscending, label: t("priceAsc") },
    { value: Sort.PriceDescending, label: t("priceDesc") },
    { value: Sort.TitleAscending, label: t("titleAsc") },
  ] as const;
  const current = options.find((option) => option.value === value);

  return (
    <Positioner>
      <Dropdown
        label={t("sort")}
        displayLabel={t("sort") + ": " + (current?.label ?? "")}
        value={value}
        options={options}
        onChange={onChange}
        align="end"
      />
    </Positioner>
  );
}
