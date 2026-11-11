import styled from "styled-components";
import { Button, IconButton } from "./controls";
import Icon from "./Icon";

const Pages = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  button {
    min-width: 44px;
    padding-inline: 8px;
  }
  [dir="ltr"] & .previous .nova-icon,
  [dir="rtl"] & .next .nova-icon {
    transform: scaleX(-1);
  }
  select {
    min-height: 44px;
    padding-inline: 8px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--surface);
    color: var(--ink);
  }
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
`;
interface Props {
  readonly page: number;
  readonly pages: number;
  readonly label: string;
  readonly previous: string;
  readonly next: string;
  readonly format: (page: number) => string;
  readonly pageLabel: (page: number) => string;
  readonly onChange: (page: number) => void;
  readonly size?: {
    readonly value: number;
    readonly options: readonly number[];
    readonly label: string;
    readonly onChange: (value: number) => void;
  };
}
export default function Pagination({
  page,
  pages,
  label,
  previous,
  next,
  format,
  pageLabel,
  onChange,
  size,
}: Props) {
  return (
    <Pages aria-label={label}>
      <IconButton
        type="button"
        className="previous"
        aria-label={previous}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <Icon name="chevron" size={17} />
      </IconButton>
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <Button
          type="button"
          key={number}
          $kind={page === number ? "primary" : "secondary"}
          aria-current={page === number ? "page" : undefined}
          aria-label={pageLabel(number)}
          onClick={() => onChange(number)}
        >
          {format(number)}
        </Button>
      ))}
      <IconButton
        type="button"
        className="next"
        aria-label={next}
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        <Icon name="chevron" size={17} />
      </IconButton>
      {size && (
        <label>
          {size.label}
          <select
            value={size.value}
            onChange={(event) => size.onChange(Number(event.currentTarget.value))}
          >
            {size.options.map((value) => (
              <option key={value} value={value}>
                {format(value)}
              </option>
            ))}
          </select>
        </label>
      )}
    </Pages>
  );
}
