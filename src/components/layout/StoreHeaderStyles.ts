import styled from "styled-components";
import { Form } from "formik";

export const Header = styled.header`
  background: var(--surface);
  color: var(--ink);
  border-block-end: 1px solid var(--line);
  .inner {
    max-width: 1440px;
    margin: auto;
    padding-inline: var(--gutter);
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto 1fr;
    gap: 0 8px;
  }
  .brand {
    min-height: 64px;
    display: flex;
    align-items: center;
    grid-column: 2;
    grid-row: 1;
  }
  .navigation,
  .desktop-preferences {
    display: none;
  }
  .tools,
  .desktop-preferences {
    gap: 6px;
    justify-content: flex-end;
    align-items: center;
  }
  .tools {
    display: flex;
    grid-column: 3;
    grid-row: 1;
  }
  .menu-toggle {
    justify-self: start;
    grid-column: 1;
    grid-row: 1;
  }
  .language {
    min-height: 44px;
    padding-inline: 4px;
    display: flex;
    gap: 5px;
    align-items: center;
    font:
      700 12px Inter,
      sans-serif;
  }
  .cart {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: var(--ink);
  }
  .cart-count {
    position: absolute;
    inset-block-start: 1px;
    inset-inline-end: 0;
    padding-inline: 3px;
    min-width: 19px;
    min-height: 19px;
    border-radius: 999px;
    background: var(--brand);
    color: var(--on-brand);
    font-size: 11px;
    font-weight: 800;
    display: grid;
    place-items: center;
  }
  .search-box {
    grid-column: 1 / -1;
    display: none;
  }
  .search-box[data-expanded="true"] {
    display: block;
  }
  .nav-category {
    max-width: 160px;
  }
  @media (min-width: 768px) {
    .inner {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }
    .brand {
      min-height: 76px;
    }
    .menu-toggle,
    .search-toggle {
      display: none;
    }
    .search-box,
    .desktop-preferences {
      display: block;
    }
    .desktop-preferences {
      display: flex;
    }
    .navigation {
      display: flex;
      align-items: center;
      gap: clamp(8px, 1.7vw, 24px);
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }
    .navigation a {
      min-height: 44px;
      display: flex;
      align-items: center;
      gap: 3px;
      position: relative;
    }
    .navigation a[aria-current="page"]::after {
      content: "";
      position: absolute;
      inset: auto 0 3px;
      height: 2px;
      border-radius: 2px;
      background: var(--brand);
    }
  }
`;
export const Drawer = styled.nav`
  display: grid;
  gap: 8px;
  a {
    min-height: 44px;
    display: flex;
    align-items: center;
    padding-inline: 12px;
    border-radius: 10px;
    background: var(--soft);
  }
  .tree {
    display: grid;
    gap: 4px;
  }
  .tree-parent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    min-height: 44px;
    padding-inline: 12px;
    border: 0;
    border-radius: 10px;
    background: var(--soft);
    color: var(--ink);
    font: inherit;
    font-weight: 700;
    text-align: start;
  }
  .tree-parent .nova-icon {
    transition: transform 160ms ease;
  }
  .tree-parent[aria-expanded="true"] .nova-icon {
    transform: rotate(180deg);
  }
  .tree-children {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 180ms ease;
  }
  .tree-children[data-open="true"] {
    grid-template-rows: 1fr;
  }
  .tree-inner {
    display: grid;
    gap: 2px;
    min-height: 0;
    overflow: hidden;
    margin-inline-start: 13px;
    padding-inline-start: 10px;
    border-inline-start: 1px solid var(--line);
  }
  .tree-children[data-open="true"] .tree-inner {
    padding-block: 6px 2px;
  }
  .tree-link {
    min-height: 40px;
    padding-inline: 10px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--muted);
    font: inherit;
    text-align: start;
  }
  .tree-link:hover,
  .tree-link:focus-visible {
    background: var(--soft);
    color: var(--ink);
  }
  .tree-link[aria-current="true"] {
    background: var(--tint);
    color: var(--brand-ink);
    font-weight: 700;
  }
  @media (prefers-reduced-motion: reduce) {
    .tree-parent .nova-icon,
    .tree-children {
      transition: none;
    }
  }
  .preferences {
    display: flex;
    gap: 12px;
    align-items: center;
  }
`;

export const Search = styled(Form)`
  display: flex;
  gap: 9px;
  padding: 0 12px;
  min-height: 46px;
  padding-inline: 16px 14px;
  border-radius: 999px;
  background: var(--soft);
  border: 2px solid #c9d2df;
  color: var(--muted);
  align-items: center;
  grid-column: 1/-1;
  margin: 6px 0;
  [data-theme="dark"] & {
    border-color: var(--line);
  }
  &:focus-within {
    border-color: var(--focus);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--focus) 20%, transparent);
  }
  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: none;
    background: none;
    color: var(--ink);
    font-size: 13px;
  }
  > button {
    order: 2;
  }
  input::-webkit-search-cancel-button {
    appearance: none;
  }
  input::placeholder {
    color: var(--muted);
    opacity: 1;
  }
  button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--muted);
    width: 28px;
    flex: none;
    height: 36px;
    display: grid;
    place-items: center;
  }
  @media (min-width: 768px) {
    margin: 0;
    width: clamp(176px, 22vw, 260px);
  }
  @media (min-width: 1024px) {
    width: 268px;
  }
`;

