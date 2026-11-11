"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styled, { css } from "styled-components";
import Icon from "./Icon";

export interface DropdownOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

type Variant = "field" | "borderless";

interface Props<T extends string> {
  readonly label: string;
  readonly value: T;
  readonly options: readonly DropdownOption<T>[];
  readonly onChange: (value: T) => void;
  readonly variant?: Variant;
  /** Fixed trigger copy (for navigation) instead of the selected option label. */
  readonly displayLabel?: string;
  readonly align?: "start" | "end";
  readonly className?: string;
}

const Root = styled.div`
  position: relative;
  min-width: 0;
`;

const Trigger = styled.button<{ $variant: Variant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  max-width: 100%;
  min-height: 44px;
  white-space: nowrap;
  font: inherit;
  cursor: pointer;
  ${({ $variant }) =>
    $variant === "field"
      ? css`
          padding: 0 14px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: var(--surface);
          color: var(--ink);
          font-size: 14px;
          font-weight: 700;
          &:hover {
            border-color: var(--muted);
          }
        `
      : css`
          padding: 0;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: var(--ink);
          font-size: inherit;
          font-weight: 700;
          &:hover,
          &[aria-expanded="true"] {
            color: var(--brand-ink);
          }
        `}
  .nova-icon {
    transition: transform 160ms ease;
  }
  &[aria-expanded="true"] .nova-icon {
    transform: rotate(180deg);
  }
  &:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    .nova-icon {
      transition: none;
    }
  }
`;

const Menu = styled.div<{ $align: "start" | "end" }>`
  position: absolute;
  z-index: 40;
  inset-block-start: calc(100% + 6px);
  ${({ $align }) => ($align === "end" ? "inset-inline-end: 0;" : "inset-inline-start: 0;")}
  min-width: max(100%, 190px);
  max-height: min(60dvh, 264px);
  overflow-y: auto;
  overscroll-behavior: contain;
  display: grid;
  gap: 4px;
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 12px 32px #12213926;
  animation: dropdown-in 140ms ease-out;
  @keyframes dropdown-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 42px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  text-align: start;
  &:hover,
  &:focus-visible {
    background: var(--soft);
  }
  &[aria-pressed="true"] {
    background: var(--tint);
    color: var(--brand-ink);
    font-weight: 700;
  }
`;

function Check(): ReactNode {
  return <Icon name="check" size={15} />;
}

export default function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  variant = "field",
  displayLabel,
  align = "start",
  className,
}: Props<T>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  function close(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }

  useEffect(() => {
    if (!open || !pendingFocus.current) return;
    const buttons = menu.current?.querySelectorAll<HTMLButtonElement>("button");
    if (!buttons?.length) return;
    buttons[pendingFocus.current === "last" ? buttons.length - 1 : 0]?.focus();
    pendingFocus.current = null;
  }, [open]);

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    if (open) {
      const buttons = menu.current?.querySelectorAll<HTMLButtonElement>("button");
      buttons?.[event.key === "ArrowDown" ? 0 : buttons.length - 1]?.focus();
      return;
    }
    pendingFocus.current = event.key === "ArrowDown" ? "first" : "last";
    setOpen(true);
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (!buttons.length) return;
    const index =
      document.activeElement instanceof HTMLButtonElement
        ? buttons.indexOf(document.activeElement)
        : -1;
    let next = -1;
    if (event.key === "ArrowDown") next = index + 1;
    if (event.key === "ArrowUp") next = index < 0 ? buttons.length - 1 : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    if (next < 0) return;
    event.preventDefault();
    buttons[(next + buttons.length) % buttons.length]?.focus();
  }

  return (
    <Root
      className={className}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Trigger
        ref={trigger}
        type="button"
        $variant={variant}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onKeyDown={onTriggerKeyDown}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {displayLabel ?? selected?.label}
        <Icon name="down" size={16} />
      </Trigger>
      {open && (
        <Menu
          ref={menu}
          id={id}
          role="group"
          aria-label={label}
          $align={align}
          onKeyDown={onMenuKeyDown}
        >
          {options.map((option) => (
            <Option
              key={option.value}
              type="button"
              aria-pressed={option.value === value}
              onClick={() => {
                onChange(option.value);
                close();
              }}
            >
              {option.label}
              {option.value === value && <Check />}
            </Option>
          ))}
        </Menu>
      )}
    </Root>
  );
}
